import * as Schemas from './schemas.js';

let currentUser;

window.onload = () => {
	Schemas.initializeSchemas();

	currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
	if (currentUser && currentUser.id) {
		showMainScreen();
	} else {
		showAuthScreen();
	}
};

function showMessage(msg) {
	document.getElementById('auth-message').textContent = msg;
}

function showAuthScreen() {
	console.log ('----- showAuthScreen -----');
	document.getElementById('auth-screen').style.display = 'block';
	document.getElementById('main-screen').style.display = 'none';

	document.getElementById('navbar-user').style.display = 'none';
	document.getElementById('navbar').classList.add('auth-mode');

	document.getElementById('auth-login-btn').onclick = () => {
		showLoginForm();
	}
	document.getElementById('auth-register-btn').onclick = () => {
		showRegisterForm();
	}

	showLoginForm();
}

function showLoginForm() {
	console.log ('----- showLoginForm -----');
	document.getElementById('login-form').style.display = 'flex';
	document.getElementById('register-form').style.display = 'none';

	document.getElementById('auth-login-btn').classList.add('active');
	document.getElementById('auth-register-btn').classList.remove('active');

	document.getElementById('login-username').value = '';
	document.getElementById('login-password').value = '';
	document.getElementById('register-username').value = '';
	document.getElementById('register-password').value = '';
	document.getElementById('register-name').value = '';

	document.getElementById('login-btn').onclick = () => {
		login();
	}

	showMessage('');
}

function showRegisterForm() {
	console.log ('----- showRegisterForm -----');
	document.getElementById('login-form').style.display = 'none';
	document.getElementById('register-form').style.display = 'flex';

	document.getElementById('auth-register-btn').classList.add('active');
	document.getElementById('auth-login-btn').classList.remove('active');

	document.getElementById('login-username').value = '';
	document.getElementById('login-password').value = '';
	document.getElementById('register-username').value = '';
	document.getElementById('register-password').value = '';
	document.getElementById('register-name').value = '';

	document.getElementById('register-btn').onclick = () => {
		register();
	}

	showMessage('');
}

function showMainScreen() {
	console.log ('----- showMainScreen -----');
	const user = Schemas.getItemSchemas('users', currentUser.id, null, ['name', 'sex', 'is_deleted']);
	console.log ('user:', user);

	if (!user || user.is_deleted) {
		console.log('Пользователь не найден');
		showAuthScreen();
		return;
	}
	document.getElementById('auth-screen').style.display = 'none';
	document.getElementById('main-screen').style.display = 'block';

	document.getElementById('display-username').textContent = user.name || '';

	document.getElementById('navbar-user').style.display = 'flex';
	document.getElementById('navbar-username').textContent = user.name || '';
	document.getElementById('navbar').classList.remove('auth-mode');

	document.getElementById('user_settings-btn').onclick = () => {
		openSettings();
	}
	document.getElementById('user_logout-btn').onclick = () => {
		logout();
	}
}

function login() {
	console.log ('----- login -----');
	
	const login = document.getElementById('login-username').value.trim();
	const password = document.getElementById('login-password').value;

	if (!login || !password) {
		showMessage('Введите логин и пароль');
		return;
	}
	
	const user = Schemas.getItemSchemas('users', null, {
		login: login,
		password: password,
		is_deleted: 0
	}, ['id', 'login', 'name']);
	console.log ('user:', user);

	if (user) {
		sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, login: user.login }));
		currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
		showMainScreen(user.name);
	} else {
		document.getElementById('login-username').value = '';
		document.getElementById('login-password').value = '';
		showMessage('Неверный логин или пароль');
	}
}

function register() {
	console.log ('----- register -----');
	const login = document.getElementById('register-username').value.trim();
	const password = document.getElementById('register-password').value;
	const name = document.getElementById('register-name').value.trim();

	if (!login || !password || !name) {
		return showMessage('Заполните все поля');
	}

	let user = Schemas.getItemSchemas('users', null, { login: login }, ['login']);
	console.log ('user:', user);

	if (user) {
		return showMessage('Пользователь с таким логином уже существует');
	}

	const newUser = {
		login    : login,
		password : password,
		name     : name
	};
	console.log (newUser);

	user = Schemas.addItemSchemas('users', newUser);

	if (user) {
		document.getElementById('register-username').value = '';
		document.getElementById('register-password').value = '';
		document.getElementById('register-name').value = '';
		showMessage('Регистрация завершена успешно');
	} else {
		showMessage('Ошибка при регистрации, повторите позже');
	}
}

function logout() {
	console.log('----- logout -----');
	sessionStorage.removeItem('currentUser');
	currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
	showAuthScreen();
}

function openSettings() {
	console.log('----- openSettings -----');
	alert('Настройки пользователя в разработке.');
}