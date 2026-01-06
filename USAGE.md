# WebVM Usage Guide

## Getting Started

### Starting the Application

1. Install dependencies (first time only):
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Using the Virtual Desktop

### Selecting an Operating System

When you first load the application, you'll see a selection screen with four Linux distributions:
- **Ubuntu Linux 22.04 LTS** - Popular and user-friendly
- **Debian Linux 11** - Stable and reliable
- **Fedora Linux 38** - Cutting-edge features
- **Arch Linux Rolling** - Lightweight and flexible

Click on any OS card to load that desktop environment.

### Desktop Navigation

Once in the desktop, you'll see:
- **Top Bar**: Shows current OS, time, and system controls
- **Desktop Area**: Contains application icons
- **Taskbar**: At the bottom, shows open applications and the Applications menu

### Opening Applications

You can open applications in three ways:

1. **Double-click desktop icons**:
   - Terminal
   - Files
   - Browser
   - Settings
   - About

2. **Click the Applications menu** (bottom-left):
   - System Tools section
   - Applications section
   - System section

3. **Use top bar buttons**:
   - Switch OS
   - About
   - Logout

### Window Management

Each window supports:
- **Drag**: Click and hold the title bar to move windows
- **Minimize**: Click the `_` button to hide the window (click taskbar to restore)
- **Maximize**: Click the `□` button to fullscreen (click again to restore)
- **Close**: Click the `×` button to close the window
- **Double-click title bar**: Quick maximize/restore

### Using the Terminal

The terminal supports several commands:
- `ls` or `dir` - List directory contents
- `pwd` - Print working directory
- `whoami` - Show current user
- `uname -a` - Display system information
- `date` - Show current date and time
- `clear` - Clear terminal screen
- `help` - Show available commands

Type a command and press Enter to execute it.

### File Manager

Browse the virtual file system with folders:
- Desktop
- Documents
- Downloads
- Pictures
- Videos
- Music

Use the toolbar buttons to navigate:
- Home
- Back
- Forward
- Refresh

### Other Applications

- **Browser**: Simulated web browser interface
- **Text Editor**: Simple text editing application
- **Calculator**: Functional calculator with basic operations
- **Settings**: View system settings and WebSocket status

### Switching Operating Systems

To switch to a different OS:
1. Click the "Switch OS" button in the top bar, OR
2. Open Applications menu and select "Switch OS", OR
3. Click "Logout" button

This will return you to the OS selection screen where you can choose a different distribution.

## Keyboard Tips

- **Enter** in terminal - Execute command
- **Double-click** - Open applications

## Troubleshooting

### WebSocket Connection Issues

If the terminal doesn't respond:
1. Check the browser console for errors
2. Ensure the server is running
3. Refresh the page to reconnect

The system will automatically attempt to reconnect up to 5 times with exponential backoff.

### Multiple Terminal Windows

You can open multiple terminal windows simultaneously. All terminals will receive output from commands executed in any terminal.

## Features Overview

| Feature | Description |
|---------|-------------|
| Multi-OS Support | Choose from 4 Linux distributions |
| Window Management | Drag, minimize, maximize, close |
| Terminal | Execute commands with WebSocket communication |
| File Manager | Browse virtual file system |
| Taskbar | Track and switch between open windows |
| Applications Menu | Quick access to all applications |
| OS-Specific Themes | Each OS has unique colors |
| Responsive Design | Works on different screen sizes |

## Performance Tips

- Close unused windows to improve performance
- The terminal history is limited to prevent memory issues
- Each OS change resets all windows

## Development

To modify the application:
- `public/index.html` - Main page structure
- `public/styles.css` - Styling and themes
- `public/script.js` - Client-side functionality
- `server.js` - Backend server and WebSocket handler

After making changes, restart the server with `npm start`.

## Support

For issues or questions, please open an issue on the GitHub repository.
