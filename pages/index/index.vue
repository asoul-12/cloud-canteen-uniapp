<template>
	<view class="search-bar">
		<uni-easyinput suffixIcon="search" placeholder="查找附近店家"></uni-easyinput>
	</view>
	<view class="item-list">
		<view class="item" v-for="(item,index) in canteenList" @click="clickItem(item)">
			<view class="image">
				<image
					:src="item.avatar"
					mode="aspectFill" style="width: 250rpx;height: 250rpx;">
				</image>
			</view>
			<view class="right">
				{{item.name}}
			</view>
		</view>
	</view>


</template>

<script>
	import {
		useCounterStore
	} from '@/store/counter.js'
	export default {
		data() {
			return {
				store: useCounterStore(),
				canteenList: [],
			}
		},
		onLoad() {
			this.loadCanteenList();
			this.checkUserIsLogin();
		},
		methods: {
			// 
			checkUserIsLogin() {
				const _this = this;
				const userId = this.store.getUserInfo().id;
				if (userId === '') {
					uni.showModal({
						content: '需要授权获取您的资料以关联您的订单！',
						showCancel: false,
						success: () => {
							_this.userLogin();
						},
					})
				}
			},
			connnectWebSocket() {
				// 用户连接到聊天服务器
				uni.connectSocket({
					url: '/webSocket?token=' + this.store.getToken(),
					success() {
						console.log("ws -> 1uccess");
					}
				});
				// 监听WebSocket连接打开事件
				uni.onSocketOpen((data) => {
					this.loadChatList();
				});
				// 监听WebSocket错误
				uni.onSocketError((err) => {
					console.log('ws->err:', err);
				})
				// 监听WebSocket接受到服务器的消息事件
				uni.onSocketMessage((msg) => {
					const invocation = JSON.parse(msg.data);
					console.log('ws-1>invocation:', invocation);
					uni.showTabBarRedDot({
						index: 1,
					})
					const recordMap = this.store.getChatRecordMap();
					const record = recordMap.get(invocation.message.user.id);
					record.push(invocation.message);
					recordMap.set(invocation.message.user.id, record);
					this.store.setChatRecordMap(recordMap);
				})
				// 监听WebSocket关闭
				uni.onSocketClose((data) => {
					console.log('ws->close', data);
				})
			},


			loadChatList() {
				const userId = this.store.getUserInfo().id;
				const token = this.store.getToken();
				const chatInfoMap = this.store.getChatMap();
				const _this = this;
				uni.request({
					url: `/chat-api/chat/get-chat-list/${userId}`,
					success(res) {
						const data = res.data.data;
						data.forEach((item) => {
							const chatInfo = {
								user: item.user,
								unreadMsgCount: item.unreadCount > 99 ? '99+' : item.unreadCount,
								unreadMsg: '',
								sessionId: item.sessionId,
							}
							chatInfoMap.set(item.user.id, chatInfo);
						})
						_this.store.setChatMap(chatInfoMap);
					},
					fail(err) {
						console.log('loadChatList->fail:', err);
					}
				})
			},

			// 加载餐厅列表
			loadCanteenList() {
				uni.request({
					url: 'common-api/canteen/list/1/5',
					timeout: "3000",
					success: (res) => {
						const data = res.data.data;
						this.canteenList = data.records;
					},
					fail: (err) => {
						console.log('loadCanteenList->fail', err)
					},
				})
			},
			// TODO 下拉刷新

			// 跳转到餐厅页面
			clickItem(item) {
				uni.navigateTo({
					url: `/pages/canteen/canteen?canteenName=${item.name}&canteenId=${item.id}&canteenAvatar=${item.avatar}&hostId=${item.hostId}`,
				})
			},

			// 用户登录
			userLogin() {
				const _this = this;
				uni.getUserProfile({
					desc: '将用户的个人信息与订单关联',
					success: data => {
						const userInfo = {
							name: data.userInfo.nickName,
							avatar: data.userInfo.avatarUrl,
						}
						wx.login({
							success: res => {
								if (res.code) {
									wx.request({
										url: 'http://localhost/userAuth',
										data: {
											code: res.code,
											nickName: userInfo.name,
											avatarUrl: userInfo.avatar
										},
										success(res) {
											const userId = res.data.data.userId;
											const token = res.data.data.token;
											// set
											userInfo.id = userId;
											_this.store.setUserInfo(userInfo);
											_this.store.setToken(token);
											_this.connnectWebSocket();
										}
									})
								}
							}
						});
					},
				});
			}
		}
	}
</script>

<style lang="scss">
	.search-bar {
		padding-top: 20rpx;
		text-align: center;
	}

	.item-list {
		padding: 50rpx 30rpx;

		.item {
			display: flex;
			padding: 20rpx 0;
			border-bottom: 1px dotted #e4e4e4;

			.right {
				padding-left: 20rpx;
				padding-top: 20rpx;
			}
		}
	}
</style>
