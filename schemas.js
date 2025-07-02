import { dataSchemas } from './schemas_model.js';

export function generateId() {
	return '_' + Math.random().toString(36).slice(2, 11);
}

export function initializeSchemas() {
    console.log ('----- initializeSchemas -----');
	for (const [key, schema] of Object.entries(dataSchemas)) {
		let data = JSON.parse(localStorage.getItem(key) || '[]');

		data = data.map(entry => {
			for (const field in schema) {
				if (!(field in entry)) {
					entry[field] = schema[field];
				}
			}
			return entry;
		});

		localStorage.setItem(key, JSON.stringify(data));
	}
}

export function getItemSchemas(name, id = null, options = null, fields = null) {
    console.log ('----- getItemSchemas -----');
    console.log ('name:', name);
    console.log ('id:', id);
    console.log ('options:', options);
    console.log ('fields:', fields);

    if (!name || !dataSchemas[name]) {
        console.error(`Схема "${name}" не найдена.`);
        return null;
    }

	const schema = dataSchemas[name];
	const validKeys = Object.keys(schema);
	const items = JSON.parse(localStorage.getItem(name) || '[]');

    let item = null;

	if (id !== null) {
		item = items.find(item => item.id === id) || null;
	} else if (options && typeof options === 'object') {
		item = items.find(item =>
			Object.entries(options).every(([key, value]) => item[key] === value)
		) || null;
	}

    if (!item) return null;

    const cleanItem = {};
	validKeys.forEach(key => {
		cleanItem[key] = item[key] ?? schema[key].default;
	});

    if (Array.isArray(fields)) {
		const filtered = {};
		fields.forEach(key => {
			if (key in cleanItem) filtered[key] = cleanItem[key];
		});
		return filtered;
	}

    return cleanItem;
}

export function addItemSchemas(name, data) {
    console.log ('----- addItemSchemas -----');
    console.log ('name:', name);
    console.log ('data:', data);

    if (!name || !dataSchemas[name]) {
        console.log(`Схема "${name}" не найдена.`);
        return;
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
		console.log('Пустые или некорректные данные, запись не добавлена.');
		return;
	}

    const schema = dataSchemas[name];

    const newItem = {};
	for (const [key, props] of Object.entries(schema)) {
		if (key === 'id') {
            newItem[key] = generateId();
        } else if (data.hasOwnProperty(key)) {
			newItem[key] = data[key];
		} else {
            newItem[key] = props.default;
		}
	}

    for (const [key, props] of Object.entries(schema)) {
		if (props.required && (newItem[key] === undefined || newItem[key] === null || newItem[key] === '')) {
			console.log(`Обязательное поле "${key}" не заполнено. Запись не добавлена.`);
			return;
		}
	}

    const items = JSON.parse(localStorage.getItem(name) || '[]');

    items.push(newItem);
    localStorage.setItem(name, JSON.stringify(items));
    console.log(`Добавлена запись в "${name}":`, newItem);

    return getItemSchemas(name, newItem.id, null, ['login']);
}