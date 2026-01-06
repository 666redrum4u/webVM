const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.json());

// Serve main page
// Note: In production, consider adding rate limiting to prevent abuse
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get available operating systems
app.get('/api/os-list', (req, res) => {
    res.json({
        systems: [
            {
                id: 'ubuntu',
                name: 'Ubuntu Linux',
                version: '22.04 LTS',
                description: 'Popular Linux distribution based on Debian',
                icon: '🐧'
            },
            {
                id: 'debian',
                name: 'Debian Linux',
                version: '11',
                description: 'Stable and reliable Linux distribution',
                icon: '🌀'
            },
            {
                id: 'fedora',
                name: 'Fedora Linux',
                version: '38',
                description: 'Cutting-edge Linux distribution',
                icon: '🎩'
            },
            {
                id: 'arch',
                name: 'Arch Linux',
                version: 'Rolling',
                description: 'Lightweight and flexible Linux distribution',
                icon: '⚡'
            },
            {
                id: 'kali',
                name: 'Kali Linux',
                version: '2024.1',
                description: 'Advanced penetration testing platform with all security tools',
                icon: '🐉'
            }
        ]
    });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            
            // Handle different message types
            switch(data.type) {
                case 'command':
                    handleCommand(ws, data.command, data.os);
                    break;
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
                default:
                    ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'An error occurred processing your request' }));
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
    
    // Send welcome message
    ws.send(JSON.stringify({ 
        type: 'welcome', 
        message: 'Connected to WebVM Server' 
    }));
});

// Handle terminal commands
function handleCommand(ws, command, osType) {
    // Simulate command execution with basic input validation
    if (!command || typeof command !== 'string') {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid command' }));
        return;
    }
    
    // Trim and sanitize input
    command = command.trim();
    if (command.length > 1000) {
        ws.send(JSON.stringify({ type: 'error', message: 'Command too long' }));
        return;
    }
    
    let output = '';
    
    // Kali Linux specific tools
    if (osType === 'kali') {
        switch(command.trim()) {
            case 'nmap --version':
                output = 'Nmap version 7.94 ( https://nmap.org )\nPlatform: x86_64-pc-linux-gnu\nCompiled with: liblua-5.3.6 openssl-3.0.11';
                break;
            case 'metasploit':
            case 'msfconsole':
                output = '      =[ metasploit v6.3.55-dev                          ]\n+ -- --=[ 2397 exploits - 1235 auxiliary - 422 post       ]\n+ -- --=[ 1391 payloads - 46 encoders - 11 nops            ]\n+ -- --=[ 9 evasion                                        ]\n\nmsf6 > [Use "exit" to quit]';
                break;
            case 'aircrack-ng --version':
                output = 'Aircrack-ng 1.7  - (C) 2006-2023 Thomas d\'Otreppe\n  https://www.aircrack-ng.org';
                break;
            case 'wireshark --version':
                output = 'Wireshark 4.2.0 (Git v4.2.0 packaged as 4.2.0-1)\nCopyright 1998-2023 Gerald Combs <gerald@wireshark.org>';
                break;
            case 'john --version':
                output = 'John the Ripper 1.9.0-jumbo-1+bleeding-aec1328d6c 2021-11-02 10:45:52 +0100\nCopyright (c) 1996-2021 by Solar Designer and others';
                break;
            case 'hydra --version':
            case 'hydra -h':
                output = 'Hydra v9.5 (c) 2023 by van Hauser/THC - Please do not use in military or secret service organizations';
                break;
            case 'sqlmap --version':
                output = 'sqlmap/1.7.12#stable';
                break;
            case 'burpsuite':
                output = 'Starting Burp Suite Professional v2023.12.1...';
                break;
            case 'nikto --version':
            case 'nikto -Version':
                output = 'Nikto v2.5.0';
                break;
            case 'tools':
            case 'kali-tools':
                output = 'Kali Linux Security Tools Installed:\n\n[Information Gathering]\n  nmap, wireshark, nikto, maltego, recon-ng\n\n[Vulnerability Analysis]\n  openvas, nikto, sqlmap, wpscan\n\n[Exploitation Tools]\n  metasploit, armitage, beef-xss, sqlmap\n\n[Wireless Attacks]\n  aircrack-ng, wifite, fern-wifi-cracker, kismet\n\n[Password Attacks]\n  john, hydra, hashcat, crunch, cewl\n\n[Sniffing & Spoofing]\n  wireshark, ettercap, dsniff, sslstrip\n\n[Post Exploitation]\n  powersploit, empire, mimikatz\n\n[Forensics]\n  autopsy, binwalk, foremost, volatility\n\n[Reverse Engineering]\n  gdb, radare2, ghidra, ida-free\n\n[Social Engineering]\n  set (Social-Engineer Toolkit)\n\nType tool name + "--version" for more info';
                break;
        }
        
        if (output) {
            ws.send(JSON.stringify({ type: 'output', data: output }));
            return;
        }
    }
    
    switch(command.trim()) {
        case 'ls':
        case 'dir':
            output = 'Desktop\nDocuments\nDownloads\nPictures\nVideos\nMusic';
            break;
        case 'pwd':
            output = `/home/user`;
            break;
        case 'whoami':
            output = 'user';
            break;
        case 'uname -a':
            output = `${osType} 5.15.0-generic #1 SMP x86_64 GNU/Linux`;
            break;
        case 'date':
            output = new Date().toString();
            break;
        case 'help':
            if (osType === 'kali') {
                output = 'Available commands:\n  ls, dir - List directory contents\n  pwd - Print working directory\n  whoami - Print current user\n  uname -a - Print system information\n  date - Display current date and time\n  clear - Clear terminal\n  tools - List all Kali Linux security tools\n  help - Show this help message\n\nKali Linux Tools (examples):\n  nmap --version, metasploit, aircrack-ng --version\n  wireshark --version, john --version, hydra --version\n  sqlmap --version, nikto --version, burpsuite';
            } else {
                output = 'Available commands:\n  ls, dir - List directory contents\n  pwd - Print working directory\n  whoami - Print current user\n  uname -a - Print system information\n  date - Display current date and time\n  clear - Clear terminal\n  help - Show this help message';
            }
            break;
        case 'clear':
            ws.send(JSON.stringify({ type: 'clear' }));
            return;
        default:
            if (command.trim()) {
                output = `bash: ${command}: command not found`;
            }
    }
    
    ws.send(JSON.stringify({ 
        type: 'output', 
        data: output 
    }));
}

// Start server
server.listen(PORT, () => {
    console.log(`WebVM Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server is ready for connections`);
});

// Graceful shutdown
function shutdown() {
    console.log('\nShutting down server gracefully...');
    
    // Close WebSocket connections
    wss.clients.forEach((client) => {
        client.close();
    });
    
    // Close WebSocket server
    wss.close(() => {
        console.log('WebSocket server closed');
    });
    
    // Close HTTP server
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
    }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
