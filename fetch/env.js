const env = 'prod';

const dev = {
	chat_server:{
		url:'ws://localhost:8888',
	},
	canteen_service:{
		url:'http://localhost'
	},
	chat_service:{
		url:'http://localhost:81'
	}
}


const prod = {
	chat_server:{
		url:'',
	},
	canteen_service:{
		url:''
	},
	chat_service:{
		url:''
	}
}

const config = {
	dev,
	prod,
}

const baseURL = config[env]


export {baseURL};
