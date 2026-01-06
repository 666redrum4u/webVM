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
            output = 'Available commands:\n  ls, dir - List directory contents\n  pwd - Print working directory\n  whoami - Print current user\n  uname -a - Print system information\n  date - Display current date and time\n  clear - Clear terminal\n  help - Show this help message';
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
