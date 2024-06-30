const { app, BrowserWindow } = require('electron');
const RPC = require('discord-rpc');
const axios = require('axios');
const path = require('path');

const clientId = '1158978962014359553';
const rpc = new RPC.Client({ transport: 'ipc' });
const updateInterval = 3000;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'assets', 'cover.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('https://frydefm.uk.to');
}

async function updateRPC() {
    try {
        const response = await axios.get('https://listen.gglvxd.eu.org/api/nowplaying/frydefm');
        const data = response.data;

        const songTitle = data.now_playing.song.title;
        const artist = data.now_playing.song.artist;
        const totalListeners = data.listeners.total;

        await rpc.setActivity({
            details: `${artist} - ${songTitle}`,
            state: `Listeners: ${totalListeners}`,
            largeImageKey: 'frydefm', 
            largeImageText: 'FRYDEFM.UK.TO',
            buttons: [
                {
                    label: 'Listen Now',
                    url: 'https://frydefm.uk.to'
                }
            ],
            instance: false
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

app.whenReady().then(() => {
    createWindow();
    rpc.login({ clientId }).catch(console.error);

    rpc.on('ready', () => {
        updateRPC();
        setInterval(updateRPC, updateInterval);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
