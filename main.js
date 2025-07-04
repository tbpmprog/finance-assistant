
import { refreshAll } from './dom.js';
import { initializeSchemas } from './schemas.js';
import { getSession } from './auth.js';
import { renderAuthScreen, initAuthHandlers } from './auth_ui.js';
import { renderMainScreen, initMainHandlers } from './main_ui.js';

export function start(options = {}) {
    console.log ('----- main.js start -----');
    console.log ('options:', options);

    options.appName ||= 'financeAssistant';
    options.version ||= '';

    let container = localStorage.getItem(options.appName);

    if (!container) {
        container = { name: options.appName, version: options.version };
    } else {
        container = JSON.parse(container);
        container.name = options.appName;
        container.version = options.version;
    }

    localStorage.setItem(options.appName, JSON.stringify(container));

    initializeSchemas(options);
    refreshAll();
    const id_session = getSession(options);
    console.log ('id_session:', id_session);

    if (id_session) {
        renderMainScreen({ ...options, id_session: id_session });
        initMainHandlers({ ...options, id_session: id_session });
    } else {
        renderAuthScreen();
        initAuthHandlers(options);
    }
}

