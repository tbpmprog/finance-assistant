
const selectors = {
    navbar:             '#navbar',
    navbarTitle:        '#navbar-title',
    navbarUser:         '#navbar-user',
    navbarUsername:     '#navbar-username',
    userSettingsBtn:    '#user_settings-btn',
    userLogoutBtn:      '#user_logout-btn',
    
    authScreen:         '#auth-screen',
    authControl:        '#auth-control',
    authLoginBtn:       '#auth-login-btn',
    authRegisterBtn:    '#auth-register-btn',

    loginForm:          '#login-form',
    registerForm:       '#register-form',
    stayLoggedCheckbox: '#stay-logged',
    authMessage:        '#auth-message',

    mainScreen:         '#main-screen'
};

const elements = {};

export function getEl(name) {
	if (!selectors[name]) {
		console.warn(`Неизвестное имя DOM-элемента: "${name}"`);
		return null;
	}
	if (!elements[name] || !document.body.contains(elements[name])) {
		elements[name] = document.querySelector(selectors[name]);
	}
	return elements[name];
}

export function refreshAll() {
	Object.keys(selectors).forEach(name => {
		elements[name] = document.querySelector(selectors[name]);
	});
}
