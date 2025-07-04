export const dataSchemas = {
    sessions: {
        id:        { default: '', required: true },
        id_user:   { default: '', required: true },
        dt:        { default: '', required: true },
        is_deleted:{ default: 0,  required: true }
    },
    
    users: {
		id:        { default: '', required: true },
		login:     { default: '', required: true },
		password:  { default: '', required: true },
		name:      { default: '', required: true },
		sex:       { default: '', required: false },
		is_deleted:{ default: 0,  required: true }
    },

    incomes: {
		id:         { default: '', required: true },
		user_id:    { default: '', required: true },
		dt:         { default: '', required: true },
		amount:     { default: 0,  required: true },
		description:{ default: '', required: false },
		is_deleted: { default: 0,  required: true }
	},

    expenses: {
		id:         { default: '', required: true },
		user_id:    { default: '', required: true },
		dt:         { default: '', required: true },
		amount:     { default: 0,  required: true },
		description:{ default: '', required: false },
		is_deleted: { default: 0,  required: true }
	}
};