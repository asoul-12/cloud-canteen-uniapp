import {
	defineStore
} from 'pinia';

export const useCounterStore = defineStore('store', {
	state: () => {
		return {
			shopCartMap: new Map(),
			chatRecordMap: new Map(),
			chatMap:new Map(),
			userInfo: {
				id:'',
				avatar:'',
				name:'',
			},
			token: '',
		};
	},

	actions: {
		getShopCartMap() {
			return this.shopCartMap;
		},
		setShopCartMap(obj) {
			this.shopCartMap = obj;
		},
		getUserInfo() {
			return this.userInfo;
		},
		setUserInfo(obj) {
			this.userInfo = obj;
		},
		getToken() {
			return this.token;
		},
		setToken(obj) {
			this.token = obj;
		},
		setChatRecordMap(obj) {
			this.chatRecordMap = obj;
		},
		getChatRecordMap() {
			return this.chatRecordMap;
		},
		setChatMap(obj) {
			this.chatMap = obj;
		},
		getChatMap() {
			return this.chatMap;
		},

	},
});
