import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echoConfig = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
};

// Add cluster only if it's not 'local'
if (import.meta.env.VITE_PUSHER_APP_CLUSTER && import.meta.env.VITE_PUSHER_APP_CLUSTER !== 'local') {
    echoConfig.cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
}

window.Echo = new Echo(echoConfig);