# 🖥️ WebVM - Virtual Cloud Desktop

A web-based virtual cloud desktop for multiple operating systems. Experience different Linux distributions directly in your browser with a fully functional desktop environment.

## ✨ Features

- 🌐 **Multi-OS Support**: Choose from Ubuntu, Debian, Fedora, Arch, and Kali Linux
- 💻 **Terminal Emulator**: Built-in terminal with command execution
- 🔒 **Kali Linux Tools**: Full suite of penetration testing and security tools
- 📁 **File Manager**: Browse and manage virtual file system
- 🪟 **Window Management**: Full windowing system with minimize, maximize, and close
- 🎨 **OS-Specific Themes**: Each OS comes with its own color scheme
- 🔄 **Real-time Communication**: WebSocket-based communication between client and server
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/666redrum4u/webVM.git
cd webVM
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. To stop the server, press `Ctrl+C` in the terminal where it's running

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 🎮 Usage

1. **Select an Operating System**: Choose from the available Linux distributions on the startup screen
2. **Navigate the Desktop**: Click on desktop icons to open applications
3. **Use the Terminal**: Open the terminal to execute commands
4. **Manage Windows**: Drag windows, minimize, maximize, or close them
5. **Switch OS**: Click the "Switch OS" button in the top bar to change operating systems

## 🛠️ Available Applications

- **Terminal**: Execute system commands
- **File Manager**: Browse the virtual file system
- **Web Browser**: Basic web browsing interface
- **Text Editor**: Simple text editing
- **Calculator**: Perform calculations
- **Settings**: View system settings
- **About**: Information about WebVM

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Real-time Communication**: WebSocket (ws library)
- **Architecture**: Client-Server with WebSocket communication

## 📁 Project Structure

```
webVM/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server & WebSocket handler
├── package.json        # Dependencies
├── .gitignore         # Git ignore rules
├── LICENSE            # MIT License
└── README.md          # This file
```

## 🌟 Supported Operating Systems

- **Ubuntu Linux 22.04 LTS**: Popular, user-friendly distribution
- **Debian Linux 11**: Stable and reliable
- **Fedora Linux 38**: Cutting-edge features
- **Arch Linux**: Lightweight and flexible
- **Kali Linux 2024.1**: Advanced penetration testing platform with comprehensive security tools

### Kali Linux Security Tools

Kali Linux comes pre-configured with all major security and penetration testing tools:

- **Information Gathering**: nmap, wireshark, nikto, maltego, recon-ng
- **Vulnerability Analysis**: openvas, nikto, sqlmap, wpscan
- **Exploitation Tools**: metasploit, armitage, beef-xss, sqlmap
- **Wireless Attacks**: aircrack-ng, wifite, fern-wifi-cracker, kismet
- **Password Attacks**: john, hydra, hashcat, crunch, cewl
- **Sniffing & Spoofing**: wireshark, ettercap, dsniff, sslstrip
- **Post Exploitation**: powersploit, empire, mimikatz
- **Forensics**: autopsy, binwalk, foremost, volatility
- **Reverse Engineering**: gdb, radare2, ghidra, ida-free
- **Social Engineering**: SET (Social-Engineer Toolkit)

Type `tools` in the Kali Linux terminal to see the full list of available security tools.

## 🔌 API Endpoints

- `GET /` - Main application page
- `GET /api/os-list` - Get list of available operating systems
- WebSocket connection for real-time terminal communication

## 🔒 Security Considerations

This is a demonstration project designed for educational purposes. For production use, consider implementing:

- Rate limiting on all endpoints
- Authentication and authorization
- Session management and timeout
- Input sanitization for actual command execution
- HTTPS/WSS for encrypted communication
- CSRF protection
- Content Security Policy (CSP)

**Note**: The terminal command execution is currently simulated and does not execute real system commands. This is intentional for security reasons.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by traditional desktop environments
- Designed for educational and demonstration purposes

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

Made with ❤️ by 666redrum4u
