
import { getEl } from './dom.js';
import { getSession, loginAuth, registerAuth } from './auth.js';
import { renderMainScreen, initMainHandlers } from './main_ui.js';

export function renderAuthScreen() {
    console.log ('----- auth_ui.js renderAuthScreen -----');

    const authScreen   = getEl('authScreen');
    const mainScreen   = getEl('mainScreen');
    const loginForm    = getEl('loginForm');
    const registerForm = getEl('registerForm');
    const navbarUser   = getEl('navbarUser');

    if (navbarUser) navbarUser.style.display = 'none';

    authScreen.style.display = 'block';
    mainScreen.style.display = 'none';

    loginForm.reset();
    registerForm.reset();

    loginForm.style.display    = 'block';
	registerForm.style.display = 'none';
}

export function initAuthHandlers(options) {
    console.log ('----- auth_ui.js initAuthHandlers -----');

    const loginBtn           = getEl('authLoginBtn');
	const registerBtn        = getEl('authRegisterBtn');
	const loginForm          = getEl('loginForm');
	const registerForm       = getEl('registerForm');
	const authMessage        = getEl('authMessage');
    const stayLoggedCheckbox = getEl('stayLoggedCheckbox');

    loginBtn.onclick = () => {
		loginForm.style.display    = 'block';
		registerForm.style.display = 'none';
		authMessage.textContent    = '';
	};

    registerBtn.onclick = () => {
		loginForm.style.display    = 'none';
		registerForm.style.display = 'block';
		authMessage.textContent    = '';
	};

    loginForm.onsubmit = e => {
		e.preventDefault();
        console.log (e.target.elements);
		const { login, password } = e.target.elements;
		const ok = loginAuth(login.value.trim(), password.value.trim(), { ...options, stayLogged: stayLoggedCheckbox?.checked });
        if (ok) {
            const id_session = getSession(options);
            console.log ('id_session:', id_session);
            if (id_session) {
                renderMainScreen({ ...options, id_session: id_session });
                initMainHandlers(options);
            }
        } else {
            if (authMessage) authMessage.textContent = 'Неверный логин или пароль';
        }		
	};

    registerForm.onsubmit = e => {
		e.preventDefault();
		const { login, password, name } = e.target.elements;
		const ok = registerAuth(
			login.value.trim(),
			password.value.trim(),
			name.value.trim(),
			options
		);
        if (ok) {
            if (authMessage) authMessage.textContent = 'Пользователь создан — войдите';
        } else {
            if (authMessage) authMessage.textContent = 'Такой логин уже существует, выберите другой';
        }
	};
}
