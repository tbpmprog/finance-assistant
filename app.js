window.onload = () => {
	const currentUser = sessionStorage.getItem('currentUser');
	if (currentUser) {
		showMainScreen(currentUser);
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
	showLoginForm();
}

function showMainScreen(login) {
	console.log ('----- showMainScreen -----');
	const users = JSON.parse(localStorage.getItem('users') || '[]');
	const user = users.find(u => u.login === login);
	document.getElementById('auth-screen').style.display = 'none';
	document.getElementById('main-screen').style.display = 'block';
	document.getElementById('display-username').textContent = user.name || login;
}

function showLoginForm() {
	console.log ('----- showLoginForm -----');
	document.getElementById('login-form').style.display = 'flex';
	document.getElementById('register-form').style.display = 'none';

	document.getElementById('btn-login').classList.add('active');
	document.getElementById('btn-register').classList.remove('active');

	document.getElementById('login-username').value = '';
	document.getElementById('login-password').value = '';
	document.getElementById('register-username').value = '';
	document.getElementById('register-password').value = '';
	document.getElementById('register-name').value = '';

	showMessage('');
}

function showRegisterForm() {
	console.log ('----- showRegisterForm -----');
	document.getElementById('login-form').style.display = 'none';
	document.getElementById('register-form').style.display = 'flex';

	document.getElementById('btn-register').classList.add('active');
	document.getElementById('btn-login').classList.remove('active');

	document.getElementById('login-username').value = '';
	document.getElementById('login-password').value = '';
	document.getElementById('register-username').value = '';
	document.getElementById('register-password').value = '';
	document.getElementById('register-name').value = '';

	showMessage('');
}

function login() {
	console.log ('----- login -----');
	const login = document.getElementById('login-username').value.trim();
	const password = document.getElementById('login-password').value;

	const users = JSON.parse(localStorage.getItem('users') || '[]');
	const user = users.find(u => u.login === login && u.password === password && u.is_deleted === 0);

	if (user) {
		sessionStorage.setItem('currentUser', login);
		showMainScreen(login);
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

	let users = JSON.parse(localStorage.getItem('users') || '[]');

	if (users.find(u => u.login === login && u.is_deleted === 0)) {
		return showMessage('Пользователь с таким логином уже существует');
	}

	const newUser = {
		login,
		password,
		name,
		is_deleted: 0
	};

	users.push(newUser);
	localStorage.setItem('users', JSON.stringify(users));
	document.getElementById('register-username').value = '';
	document.getElementById('register-password').value = '';
	document.getElementById('register-name').value = '';
	showMessage('Регистрация завершена успешно');
}