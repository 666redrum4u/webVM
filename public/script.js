// Global state
let currentOS = null;
let windows = [];
let windowZIndex = 100;
let ws = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOSList();
    updateClock();
    setInterval(updateClock, 1000);
    initWebSocket();
});

// Load available operating systems
async function loadOSList() {
    try {
        const response = await fetch('/api/os-list');
        const data = await response.json();
        
        const osGrid = document.getElementById('os-grid');
        osGrid.innerHTML = '';
        
        data.systems.forEach(os => {
            const card = document.createElement('div');
            card.className = 'os-card';
            card.onclick = () => selectOS(os);
            
            card.innerHTML = `
                <div class="os-icon">${os.icon}</div>
                <div class="os-name">${os.name}</div>
                <div class="os-version">${os.version}</div>
                <div class="os-description">${os.description}</div>
            `;
            
            osGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading OS list:', error);
    }
}

// Select an operating system
function selectOS(os) {
    currentOS = os;
    document.getElementById('current-os-icon').textContent = os.icon;
    document.getElementById('current-os-name').textContent = os.name;
    
    // Hide selector, show desktop
    document.getElementById('os-selector').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    
    // Update desktop background based on OS
    const desktop = document.getElementById('desktop');
    switch(os.id) {
        case 'ubuntu':
            desktop.style.background = 'linear-gradient(135deg, #E95420 0%, #772953 100%)';
            break;
        case 'debian':
            desktop.style.background = 'linear-gradient(135deg, #D70A53 0%, #A80030 100%)';
            break;
        case 'fedora':
            desktop.style.background = 'linear-gradient(135deg, #294172 0%, #3C6EB4 100%)';
            break;
        case 'arch':
            desktop.style.background = 'linear-gradient(135deg, #1793D1 0%, #0A5A7A 100%)';
            break;
        default:
            desktop.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    }
}

// Update clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${dateString} ${timeString}`;
    }
}

// WebSocket connection
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(initWebSocket, 3000);
    };
}

function handleWebSocketMessage(data) {
    switch(data.type) {
        case 'welcome':
            console.log('Server:', data.message);
            break;
        case 'output':
            appendTerminalOutput(data.data);
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'error':
            console.error('Server error:', data.message);
            break;
    }
}

// Toggle application menu
function toggleAppMenu() {
    const menu = document.getElementById('app-menu');
    menu.classList.toggle('hidden');
}

// Close app menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('app-menu');
    const launcher = document.querySelector('.app-launcher');
    
    if (!menu.contains(e.target) && !launcher.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Open a window
function openWindow(type) {
    // Close app menu
    document.getElementById('app-menu').classList.add('hidden');
    
    // Check if window already exists
    const existingWindow = windows.find(w => w.type === type);
    if (existingWindow) {
        focusWindow(existingWindow.element);
        return;
    }
    
    const template = document.getElementById('window-template');
    const windowElement = template.content.cloneNode(true).querySelector('.window');
    
    // Set window properties based on type
    let title = '';
    let content = '';
    
    switch(type) {
        case 'terminal':
            title = '💻 Terminal';
            content = createTerminalContent();
            break;
        case 'files':
            title = '📁 File Manager';
            content = createFilesContent();
            break;
        case 'browser':
            title = '🌐 Web Browser';
            content = createBrowserContent();
            break;
        case 'settings':
            title = '⚙️ Settings';
            content = createSettingsContent();
            break;
        case 'about':
            title = 'ℹ️ About WebVM';
            content = createAboutContent();
            break;
        case 'editor':
            title = '📝 Text Editor';
            content = createEditorContent();
            break;
        case 'calculator':
            title = '🔢 Calculator';
            content = createCalculatorContent();
            break;
        default:
            title = 'Window';
            content = '<p>Unknown window type</p>';
    }
    
    windowElement.querySelector('.window-title').textContent = title;
    windowElement.querySelector('.window-content').innerHTML = content;
    
    // Position window
    const offset = windows.length * 30;
    windowElement.style.left = `${100 + offset}px`;
    windowElement.style.top = `${80 + offset}px`;
    windowElement.style.width = type === 'terminal' ? '600px' : '500px';
    windowElement.style.height = type === 'terminal' ? '400px' : '450px';
    windowElement.style.zIndex = ++windowZIndex;
    
    // Add to desktop
    document.getElementById('desktop-area').appendChild(windowElement);
    
    // Store window reference
    const windowObj = { type, element: windowElement };
    windows.push(windowObj);
    
    // Add to taskbar
    addToTaskbar(windowObj, title);
    
    // Make window draggable
    makeDraggable(windowElement);
    
    // Focus window
    focusWindow(windowElement);
    
    // Initialize terminal if it's a terminal window
    if (type === 'terminal') {
        initializeTerminal(windowElement);
    }
}

function createTerminalContent() {
    return `
        <div class="terminal-content">
            <div class="terminal-output" id="terminal-output">
Welcome to WebVM Terminal
Type 'help' for available commands
            </div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">user@${currentOS ? currentOS.id : 'webvm'}:~$</span>
                <input type="text" class="terminal-input" id="terminal-input" autocomplete="off">
            </div>
        </div>
    `;
}

function createFilesContent() {
    return `
        <div class="file-manager">
            <div class="file-toolbar">
                <button onclick="alert('Home')">🏠 Home</button>
                <button onclick="alert('Back')">← Back</button>
                <button onclick="alert('Forward')">Forward →</button>
                <button onclick="alert('Refresh')">🔄 Refresh</button>
            </div>
            <div class="file-list">
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Desktop</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Documents</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Downloads</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Pictures</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Videos</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📁</div>
                    <div>Music</div>
                </div>
                <div class="file-item">
                    <div class="file-icon">📄</div>
                    <div>readme.txt</div>
                </div>
            </div>
        </div>
    `;
}

function createBrowserContent() {
    return `
        <div class="browser-content">
            <div class="browser-toolbar">
                <button onclick="alert('Back')">←</button>
                <button onclick="alert('Forward')">→</button>
                <button onclick="alert('Refresh')">🔄</button>
                <input type="text" class="browser-url" value="https://example.com" readonly>
                <button onclick="alert('Go')">Go</button>
            </div>
            <div class="browser-frame">
                <div style="padding: 40px; text-align: center;">
                    <h2>🌐 Web Browser</h2>
                    <p>Browser functionality would be implemented here</p>
                    <p style="margin-top: 20px; color: #666;">
                        In a production environment, this could embed a web view or proxy.
                    </p>
                </div>
            </div>
        </div>
    `;
}

function createSettingsContent() {
    return `
        <div class="settings-content">
            <div class="setting-group">
                <h3>System</h3>
                <div class="setting-item">
                    <span>Operating System</span>
                    <span>${currentOS ? currentOS.name : 'Unknown'}</span>
                </div>
                <div class="setting-item">
                    <span>Version</span>
                    <span>${currentOS ? currentOS.version : 'Unknown'}</span>
                </div>
            </div>
            <div class="setting-group">
                <h3>Display</h3>
                <div class="setting-item">
                    <span>Theme</span>
                    <select>
                        <option>Default</option>
                        <option>Dark</option>
                        <option>Light</option>
                    </select>
                </div>
            </div>
            <div class="setting-group">
                <h3>Network</h3>
                <div class="setting-item">
                    <span>WebSocket Status</span>
                    <span style="color: ${ws && ws.readyState === WebSocket.OPEN ? 'green' : 'red'}">
                        ${ws && ws.readyState === WebSocket.OPEN ? '● Connected' : '● Disconnected'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function createAboutContent() {
    return `
        <div style="text-align: center; padding: 20px;">
            <h1 style="font-size: 3em; margin-bottom: 10px;">🖥️</h1>
            <h2>WebVM</h2>
            <p style="margin: 20px 0; color: #666;">Version 1.0.0</p>
            <p style="margin: 20px 0; line-height: 1.6;">
                A web-based virtual cloud desktop for multiple operating systems.
                <br><br>
                Experience different Linux distributions directly in your browser.
            </p>
            <p style="margin-top: 30px; font-size: 0.9em; color: #999;">
                Current OS: <strong>${currentOS ? currentOS.name : 'None'}</strong>
            </p>
            <p style="margin-top: 20px; font-size: 0.9em; color: #999;">
                © 2026 WebVM Project
            </p>
        </div>
    `;
}

function createEditorContent() {
    return `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <button onclick="alert('New')">📄 New</button>
                <button onclick="alert('Open')">📂 Open</button>
                <button onclick="alert('Save')">💾 Save</button>
            </div>
            <textarea style="flex: 1; border: 1px solid #ddd; padding: 10px; font-family: monospace; resize: none;" placeholder="Start typing..."></textarea>
        </div>
    `;
}

function createCalculatorContent() {
    return `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <input type="text" readonly style="width: 100%; padding: 20px; font-size: 24px; text-align: right; border: 1px solid #ddd; margin-bottom: 10px;" value="0" id="calc-display">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; flex: 1;">
                <button onclick="calcButton('7')" style="padding: 20px; font-size: 18px;">7</button>
                <button onclick="calcButton('8')" style="padding: 20px; font-size: 18px;">8</button>
                <button onclick="calcButton('9')" style="padding: 20px; font-size: 18px;">9</button>
                <button onclick="calcButton('/')" style="padding: 20px; font-size: 18px;">÷</button>
                <button onclick="calcButton('4')" style="padding: 20px; font-size: 18px;">4</button>
                <button onclick="calcButton('5')" style="padding: 20px; font-size: 18px;">5</button>
                <button onclick="calcButton('6')" style="padding: 20px; font-size: 18px;">6</button>
                <button onclick="calcButton('*')" style="padding: 20px; font-size: 18px;">×</button>
                <button onclick="calcButton('1')" style="padding: 20px; font-size: 18px;">1</button>
                <button onclick="calcButton('2')" style="padding: 20px; font-size: 18px;">2</button>
                <button onclick="calcButton('3')" style="padding: 20px; font-size: 18px;">3</button>
                <button onclick="calcButton('-')" style="padding: 20px; font-size: 18px;">-</button>
                <button onclick="calcButton('0')" style="padding: 20px; font-size: 18px;">0</button>
                <button onclick="calcButton('.')" style="padding: 20px; font-size: 18px;">.</button>
                <button onclick="calcButton('=')" style="padding: 20px; font-size: 18px;">=</button>
                <button onclick="calcButton('+')" style="padding: 20px; font-size: 18px;">+</button>
                <button onclick="calcButton('C')" style="padding: 20px; font-size: 18px; grid-column: span 4; background: #dc3545; color: white;">Clear</button>
            </div>
        </div>
    `;
}

let calcValue = '0';
let calcOperation = null;
let calcPrevValue = null;

function calcButton(value) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    if (value === 'C') {
        calcValue = '0';
        calcOperation = null;
        calcPrevValue = null;
    } else if (value === '=') {
        if (calcOperation && calcPrevValue !== null) {
            const current = parseFloat(calcValue);
            const prev = parseFloat(calcPrevValue);
            switch(calcOperation) {
                case '+': calcValue = (prev + current).toString(); break;
                case '-': calcValue = (prev - current).toString(); break;
                case '*': calcValue = (prev * current).toString(); break;
                case '/': calcValue = (prev / current).toString(); break;
            }
            calcOperation = null;
            calcPrevValue = null;
        }
    } else if (['+', '-', '*', '/'].includes(value)) {
        calcOperation = value;
        calcPrevValue = calcValue;
        calcValue = '0';
    } else {
        if (calcValue === '0' && value !== '.') {
            calcValue = value;
        } else {
            calcValue += value;
        }
    }
    
    display.value = calcValue;
}

// Terminal functions
function initializeTerminal(windowElement) {
    const input = windowElement.querySelector('.terminal-input');
    if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    appendTerminalOutput(`\nuser@${currentOS ? currentOS.id : 'webvm'}:~$ ${command}`);
                    
                    // Send command to server via WebSocket
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: 'command',
                            command: command,
                            os: currentOS ? currentOS.id : 'unknown'
                        }));
                    }
                    
                    input.value = '';
                }
            }
        });
    }
}

function appendTerminalOutput(text) {
    const output = document.getElementById('terminal-output');
    if (output) {
        output.textContent += '\n' + text;
        output.scrollTop = output.scrollHeight;
    }
}

function clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (output) {
        output.textContent = 'Terminal cleared\n';
    }
}

// Window management functions
function addToTaskbar(windowObj, title) {
    const taskbarWindows = document.getElementById('taskbar-windows');
    const button = document.createElement('div');
    button.className = 'taskbar-window';
    button.textContent = title;
    button.onclick = () => focusWindow(windowObj.element);
    
    windowObj.taskbarButton = button;
    taskbarWindows.appendChild(button);
}

function focusWindow(windowElement) {
    // Remove active class from all taskbar buttons
    document.querySelectorAll('.taskbar-window').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set z-index
    windowElement.style.zIndex = ++windowZIndex;
    
    // Add active class to corresponding taskbar button
    const windowObj = windows.find(w => w.element === windowElement);
    if (windowObj && windowObj.taskbarButton) {
        windowObj.taskbarButton.classList.add('active');
    }
}

function minimizeWindow(button) {
    const windowElement = button.closest('.window');
    windowElement.style.display = 'none';
    
    // Remove active from taskbar
    const windowObj = windows.find(w => w.element === windowElement);
    if (windowObj && windowObj.taskbarButton) {
        windowObj.taskbarButton.classList.remove('active');
    }
}

function maximizeWindow(button) {
    const windowElement = button.closest('.window');
    windowElement.classList.toggle('maximized');
}

function closeWindow(button) {
    const windowElement = button.closest('.window');
    
    // Remove from windows array
    const index = windows.findIndex(w => w.element === windowElement);
    if (index > -1) {
        const windowObj = windows[index];
        
        // Remove taskbar button
        if (windowObj.taskbarButton) {
            windowObj.taskbarButton.remove();
        }
        
        windows.splice(index, 1);
    }
    
    // Remove window element
    windowElement.remove();
}

function makeDraggable(windowElement) {
    const titlebar = windowElement.querySelector('.window-titlebar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;
        
        isDragging = true;
        initialX = e.clientX - windowElement.offsetLeft;
        initialY = e.clientY - windowElement.offsetTop;
        
        focusWindow(windowElement);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            windowElement.style.left = currentX + 'px';
            windowElement.style.top = currentY + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Double click to maximize
    titlebar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.window-controls')) {
            windowElement.classList.toggle('maximized');
        }
    });
}

// System functions
function changeOS() {
    // Close all windows
    windows.forEach(w => {
        if (w.element) w.element.remove();
        if (w.taskbarButton) w.taskbarButton.remove();
    });
    windows = [];
    
    // Show OS selector
    document.getElementById('desktop').classList.add('hidden');
    document.getElementById('os-selector').classList.remove('hidden');
}

function showAbout() {
    openWindow('about');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        changeOS();
    }
}
