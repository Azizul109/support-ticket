import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Disable Echo completely for now to avoid authentication issues
window.Echo = {
    private: (channel) => ({
        listen: (event, callback) => {
            console.log(`Echo disabled: Would listen to ${channel} for ${event}`);
        },
        stopListening: (event, callback) => {
            console.log(`Echo disabled: Would stop listening to ${channel} for ${event}`);
        }
    }),
    leave: (channel) => {
        console.log(`Echo disabled: Would leave channel ${channel}`);
    },
    connector: {
        pusher: {
            connection: {
                bind: () => {}
            }
        }
    }
};

console.log('Echo disabled - using polling only');