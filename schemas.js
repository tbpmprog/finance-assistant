
import { dataSchemas } from './schemas_model.js';

export function generateId() {
    return '_' + Math.random().toString(36).slice(2, 11);
}

export function initializeSchemas(options = {}) {
    console.log ('----- schemas.js initializeSchemas -----');
    console.log ('options:', options);

    if (!options.appName) {
		console.error('initializeSchemas: нужнен appName');
		return null;
	}
    
    const raw = localStorage.getItem(options.appName);
    if (!raw) {
        console.error(`initializeSchemas: контейнер '${options.appName}' не найден`);
        return null;
    }

    const container = JSON.parse(raw);

    if (!container.data) {
        container.data = {};
    }

    for (const [tableName, schema] of Object.entries(dataSchemas)) {
        let table = container.data[tableName] || [];

        table = table.map(entry => {
            for (const [field, { default: def }] of Object.entries(schema)) {
                if (!(field in entry)) {
                    entry[field] = def;
                }
            }
            return entry;
        });

        if (tableName === 'users' && table.length === 0) {
            table.push({
                id: generateId(),
                login: 'test',
                password: '123',
                name: 'Тестовый пользователь',
                sex: '',
                is_deleted: 0
            });
        }

        container.data[tableName] = table;
    }

    localStorage.setItem(options.appName, JSON.stringify(container));
    console.log(`Схемы инициализированы в '${options.appName}':`, Object.keys(dataSchemas));
}

export function getItemSchemas(options = {}) {
    console.log ('----- schemas.js getItemSchemas -----');
    console.log ('options:', options);

    const {
		appName,
		tableName,
		id,
		fields = []
	} = options;

    if (!appName || !tableName || !id) {
		console.error('getItemSchemas: нужны appName, tableName и id');
		return null;
	}

    const schema = dataSchemas[tableName];
    if (!schema) {
		console.error(`addItemSchemas: таблица "${tableName}" не описана в dataSchemas`);
		return null;
	}

    const raw = localStorage.getItem(appName);
    if (!raw) {
        console.error(`getItemSchemas: контейнер '${appName}' не найден`);
        return null;
    }

    const table = (JSON.parse(raw).data || {})[tableName] || [];
	const record = table.find(r => r.id === id);
	if (!record) return null;

    if (!Array.isArray(fields) || fields.length === 0) {
		return record;
	}

    const result = {};
	for (const f of fields) {
		if (f in record) result[f] = record[f];
	}
	return result;
}

export function selectItemsSchemas(options = {}) {
    console.log ('----- schemas.js selectItemsSchemas -----');
    console.log ('options:', options);

    const {
		appName,
		tableName,
		filters   = {},
		fields    = []
	} = options;

    if (!appName || !tableName) {
		console.error('selectItemsSchemas: нужны appName и tableName');
		return [];
	}

    const schema = dataSchemas[tableName];
    if (!schema) {
		console.error(`addItemSchemas: таблица "${tableName}" не описана в dataSchemas`);
		return null;
	}

    const raw = localStorage.getItem(appName);
    if (!raw) {
        console.error(`selectItemsSchemas: контейнер '${appName}' не найден`);
        return [];
    }

    const table = (JSON.parse(raw).data || {})[tableName] || [];
    
    let records = table;
    for (const [field, value] of Object.entries(filters)) {
		records = records.filter(r => r[field] === value);
	}

    if (!Array.isArray(fields) || fields.length === 0) {
		return records;
	}

    return records.map(r => {
		const results = {};
		for (const f of fields) {
			if (f in r) results[f] = r[f];
		}
		return results;
	});
}

export function addItemSchemas(options = {}) {
    console.log ('----- schemas.js addItemSchemas -----');
    console.log ('options:', options);

    const {
		appName,
		tableName,
		data = {}
	} = options;

    if (!appName || !tableName) {
		console.error('addItemSchemas: нужны appName и tableName');
        return null;
	}

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        console.error('addItemSchemas: пустые или некорректные данные, запись не добавлена');
        return null;
    }

    const schema = dataSchemas[tableName];
    if (!schema) {
		console.error(`addItemSchemas: таблица "${tableName}" не описана в dataSchemas`);
		return null;
	}

    const raw = localStorage.getItem(appName);
    if (!raw) {
        console.error(`selectItemsSchemas: контейнер '${appName}' не найден`);
        return null;
    }

    const container = JSON.parse(raw);

    const table = container.data?.[tableName];
    if (!Array.isArray(table)) {
		console.error(`addItemSchemas: таблица "${tableName}" ещё не инициализирована`);
		return null;
	}

    const record = {};
    for (const [key, props] of Object.entries(schema)) {
        if (key === 'id') {
            record[key] = generateId();
        } else if (data.hasOwnProperty(key)) {
            record[key] = data[key];
        } else {
            record[key] = props.default;
        }
    }

    for (const [key, props] of Object.entries(schema)) {
        if (props.required && (record[key] === undefined || record[key] === null || record[key] === '')) {
            console.error(`addItemSchemas: обязательное поле "${key}" не заполнено, запись не добавлена`);
            return null;
        }
    }

    container.data[tableName].push(record);
	localStorage.setItem(appName, JSON.stringify(container));

	return record;
}

export function updateItemSchemas(options = {}) {
    console.log ('----- schemas.js updateItemSchemas -----');
    console.log ('options:', options);

    const {
		appName,
		tableName,
        id,
		changes = {}
	} = options;

    if (!appName || !tableName || !id) {
		console.error('updateItemSchemas: нужны appName, tableName и id');
        return false;
	}

    if (!changes || typeof changes !== 'object' || Object.keys(changes).length === 0) {
        console.error('updateItemSchemas: пустые или некорректные данные, запись не обновлена');
        return false;
    }

    const schema = dataSchemas[tableName];
    if (!schema) {
		console.error(`addItemSchemas: таблица "${tableName}" не описана в dataSchemas`);
		return false;
	}

    const raw = localStorage.getItem(appName);
    if (!raw) {
        console.error(`selectItemsSchemas: контейнер '${appName}' не найден`);
        return false;
    }

    const container = JSON.parse(raw);

    const table = container.data?.[tableName];
	if (!Array.isArray(table)) {
		console.error(`updateItemSchemas: таблица "${tableName}" ещё не инициализирована`);
		return false;
	}

    const record = table.find(r => r.id === id);
	if (!record) {
		console.warn(`updateItemSchemas: запись id="${id}" не найдена`);
		return false;
	}

    for (const field in changes) {
		if (field === 'id') continue;
		if (field in schema) {
			record[field] = changes[field];
		}
	}

    for (const [key, props] of Object.entries(schema)) {
        if (props.required && (record[key] === undefined || record[key] === null || record[key] === '')) {
            console.warn(`updateItemSchemas: обязательное поле "${key}" не заполнено, запись не обновлена`);
            return false;
        }
    }

    localStorage.setItem(appName, JSON.stringify(container));

    return true;
}

export function deleteItemSchemas(options = {}) {
    console.log ('----- schemas.js deleteItemSchemas -----');
    console.log ('options:', options);

    const {
		appName,
		tableName,
        id,
	} = options;

    if (!appName || !tableName || !id) {
		console.error('updateItemSchemas: нужны appName, tableName и id');
        return false;
	}

    const schema = dataSchemas[tableName];
	if (!schema) {
		console.error(`deleteItemSchemas: таблица "${tableName}" не описана`);
		return false;
	}
	if (!('is_deleted' in schema)) {
		console.error(`deleteItemSchemas: таблица "${tableName}" не поддерживает мягкое удаление`);
		return false;
	}

    const raw = localStorage.getItem(appName);
    if (!raw) {
        console.error(`deleteItemSchemas: контейнер '${appName}' не найден`);
        return false;
    }
	
    const container = JSON.parse(raw);

    const table = container.data?.[tableName];
    if (!Array.isArray(table)) {
		console.error(`deleteItemSchemas: таблица "${tableName}" ещё не инициализирована`);
		return false;
	}

    const record = table.find(r => r.id === id);
	if (!record) {
        console.error(`deleteItemSchemas: запись в таблице "${tableName}" не найдена`);
        return false;
    }

    if (record.is_deleted) return true;

    record.is_deleted = 1;

    localStorage.setItem(appName, JSON.stringify(container));

    return true;
}
