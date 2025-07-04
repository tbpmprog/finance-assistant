
import { getEl } from './dom.js';
import { getItemSchemas, selectItemsSchemas, addItemSchemas, updateItemSchemas, deleteItemSchemas } from './schemas.js';
import { logoutAuth } from './auth.js';
import { renderAuthScreen, initAuthHandlers } from './auth_ui.js';

export function renderMainScreen(options = {}) {
    console.log ('----- main_ui.js renderMainScreen -----');
    console.log ('options', options);

    const authScreen     = getEl('authScreen');
	const mainScreen     = getEl('mainScreen');
    const navbarUser     = getEl('navbarUser');
    const navbarUsername = getEl('navbarUsername');

    authScreen.style.display = 'none';
	mainScreen.style.display = 'block';

    if (navbarUser) navbarUser.style.display = 'flex';

    const session = getItemSchemas({
        appName:   options.appName,
        tableName: 'sessions',
        id:        options && options.id_session ? options.id_session : -1,
        fields:    ['id', 'id_user', 'is_deleted']
    });

    if (!session || session.is_deleted) {
        console.error('renderMainScreen: невалидная сессия');
        return;
    }
    
    const user = getItemSchemas({
		appName:   options.appName,
		tableName: 'users',
		id:        session && session.id_user ? session.id_user : -1,
        fields:    ['id', 'is_deleted', 'name']
	});

    if (!user || user.is_deleted) {
        console.error('renderMainScreen: пользователь не найден или удалён');
        return;
    }

    let title = mainScreen.querySelector('#main-title');
	if (!title) {
		title = document.createElement('p');
		title.id = 'main-title';
		mainScreen.prepend(title);
	}
	
    title.textContent = `Здравствуйте, ${user.name}!`;

    if (navbarUsername) navbarUsername.textContent = user.name;
}

export function initMainHandlers(options = {}) {
    console.log ('----- main_ui.js renderMainScreen -----');
    console.log ('options', options);
    
    const logoutBtn = getEl('userLogoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            const ok = logoutAuth(options);
            if (ok) {
                renderAuthScreen();
		        initAuthHandlers({ appName: options.appName });
            }
        };
    }

    const settingsBtn = getEl('userSettingsBtn');
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            alert('Настройки пока не реализованы.');
        };
    }
}
