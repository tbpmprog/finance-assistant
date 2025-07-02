export const dataSchemas = {
    users: {
		id:        { default: '', required: true },
		login:     { default: '', required: true },
		password:  { default: '', required: true },
		name:      { default: '', required: true },
		sex:       { default: '', required: false },
		is_deleted:{ default: 0,  required: true }
    }
};