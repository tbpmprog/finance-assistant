
import { getItemSchemas, selectItemsSchemas, addItemSchemas, updateItemSchemas, deleteItemSchemas } from './schemas.js';

export function getSession(options = {}) {
    console.log ('----- auth.js getSession -----');
    console.log ('options:', options);

    if (!options.appName) {
		console.error('getSession: нужнен appName');
		return null;
	}

    let rawSession = sessionStorage.getItem(options.appName);
    let sessObj    = rawSession ? JSON.parse(rawSession) : null;

    if (!(sessObj && sessObj.currentUserSessionId && Array.isArray(sessObj.usersSessions) && sessObj.usersSessions.includes(sessObj.currentUserSessionId))) {
        const rawApp = localStorage.getItem(options.appName);
        const persistentId = rawApp && JSON.parse(rawApp).persistentSessionId;

        if (persistentId) {
			sessObj = {
				currentUserSessionId: persistentId,
				usersSessions:        [persistentId]
			};
			sessionStorage.setItem(options.appName, JSON.stringify(sessObj));
		} else {
			return null;
		}
    }

    const { currentUserSessionId } = sessObj;

    const sessionRow = getItemSchemas({
        appName:   options.appName,
        tableName: 'sessions',
        id:        currentUserSessionId ? currentUserSessionId : -1,
        fields:    ['id', 'id_user', 'is_deleted']
    });
    if (!sessionRow || sessionRow.is_deleted) return null;

    const userRow = getItemSchemas({
        appName:   options.appName,
        tableName: 'users',
        id:        sessionRow.id_user ? sessionRow.id_user : -1,
        fields:    ['id', 'is_deleted']
    });
    if (!userRow || userRow.is_deleted) return null;

    return sessionRow.id;
}

export function loginAuth(login, password, options = {}) {
    console.log ('----- auth.js loginAuth -----');
    console.log ('login:', login);
    console.log ('password:', password);
    console.log ('options:', options);

    if (!options.appName) {
		console.error('loginAuth: нужнен appName');
		return false;
	}

    const [user] = selectItemsSchemas({
		appName:   options.appName,
		tableName: 'users',
		filters:   { login, password, is_deleted: 0 },
        fields:    ['id', 'is_deleted']
	});
	if (!user) return false;

    const activeSessions = selectItemsSchemas({
		appName:   options.appName,
		tableName: 'sessions',
		filters:   { id_user: user.id, is_deleted: 0 },
		fields:    ['id']
	});

    for (const s of activeSessions) {
		deleteItemSchemas({ appName: options.appName, tableName: 'sessions', id: s.id });
	}

    const newSession = addItemSchemas({
		appName:   options.appName,
		tableName: 'sessions',
		data: {
			id_user: user.id,
			dt: new Date().toISOString()
		}
	});

    let sessObj = { currentUserSessionId: newSession.id, usersSessions: [newSession.id] };
    const rawSess = sessionStorage.getItem(options.appName);
    if (rawSess) {
		sessObj = JSON.parse(rawSess);
		sessObj.currentUserSessionId = newSession.id;
		if (!Array.isArray(sessObj.usersSessions)) sessObj.usersSessions = [];
		if (!sessObj.usersSessions.includes(newSession.id)) {
			sessObj.usersSessions.push(newSession.id);
		}
	}
	sessionStorage.setItem(options.appName, JSON.stringify(sessObj));

    if (options.stayLogged) {
        const raw = localStorage.getItem(options.appName);
        const container = raw ? JSON.parse(raw) : {};
        container.persistentSessionId = newSession.id;
        localStorage.setItem(options.appName, JSON.stringify(container));
    }

	return true;
}

export function registerAuth(login, password, name, options = {}) {
    console.log ('----- auth.js registerAuth -----');
    console.log ('login:', login);
    console.log ('password:', password);
    console.log ('name:', name);
    console.log ('options:', options);

    if (!options.appName) {
		console.error('registerAuth: нужнен appName');
		return false;
	}

    const [exists] = selectItemsSchemas({
		appName:   options.appName,
		tableName: 'users',
		filters:   { login },
		fields:    ['id']
	});
	if (exists) return false;

    const newUser = addItemSchemas({
		appName:   options.appName,
		tableName: 'users',
		data: {
            login:    login,
            password: password,
            name:     name
        }
	});
	if (!newUser) return false;

    return true;
}

export function logoutAuth(options = {}) {
    console.log ('----- auth.js logoutAuth -----');
    console.log ('options:', options);

    if (!options.appName) {
		console.error('loginAuth: нужнен appName');
		return false;
	}

    const rawSess = sessionStorage.getItem(options.appName);
    if (!rawSess) {
		return true;
	}

	const sessObj = JSON.parse(rawSess);
	const { currentUserSessionId, usersSessions = [] } = sessObj;
	if (!currentUserSessionId) return;

    deleteItemSchemas({
		appName:   options.appName,
		tableName: 'sessions',
		id:        currentUserSessionId
	});

    const newUsersSessions = usersSessions.filter(id => id !== currentUserSessionId);

    const newSessObj = {
		currentUserSessionId: null,
		usersSessions: newUsersSessions
	};

    sessionStorage.setItem(options.appName, JSON.stringify(newSessObj))

    const rawApp = localStorage.getItem(options.appName);
	if (rawApp) {
		const container = JSON.parse(rawApp);
		if (container.persistentSessionId === currentUserSessionId) {
			delete container.persistentSessionId;
			localStorage.setItem(options.appName, JSON.stringify(container));
		}
	}

    return true;
}
