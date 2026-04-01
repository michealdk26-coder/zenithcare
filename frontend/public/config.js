const API_CONFIG = {
    resolveBaseUrl: function() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('apiBase');
        const fromStorage = localStorage.getItem('zenithcare_api_base');

        const chosen = (fromQuery || fromStorage || '').trim();
        if (chosen) {
            return chosen.replace(/\/$/, '');
        }

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const hasHttpProtocol = window.location.protocol === 'http:' || window.location.protocol === 'https:';

        if (isLocal || !hasHttpProtocol || window.location.origin === 'null') {
            return 'http://localhost:5000';
        }

        return window.location.origin;
    },

    BASE_URL: '',

    getApiUrl: function(endpoint) {
        endpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        return this.BASE_URL + endpoint;
    }
};

API_CONFIG.BASE_URL = API_CONFIG.resolveBaseUrl();
window.API_CONFIG = API_CONFIG;
