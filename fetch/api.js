import {
	useCounterStore
} from '@/store/counter.js';
import {
	baseURL
} from '@/fetch/env.js';


export const interceptos = () => {
	uni.addInterceptor('request', {
		invoke(args) {
			if (args.url.includes('common-api')) {
				args.url = baseURL.canteen_service.url + args.url.replace('/common-api', '');
			}else{
				args.url = baseURL.chat_service.url + args.url.replace('/chat-api', '');
			}
			args.header = {
				'Authorization': useCounterStore().getToken(),
			};
		}
	});

	uni.addInterceptor('connectSocket', {
		invoke(args) {
			args.url = baseURL.chat_server.url + args.url;
		}
	});
	
}
