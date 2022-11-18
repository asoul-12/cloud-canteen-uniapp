<template>
	<view>
		<view class="header">
			<view class="header-content">
				{{userName}}
			</view>
		</view>

		<view class="content">
			<view class="item" v-for="(item,index) in recordList">

				<view class="receive" :style="{'text-align':item.user.id===userId?'left':'right'}">
					<uni-card>
						<text style="font-size: 32rpx;">{{item.content}}</text>
					</uni-card>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="btn">
				<uni-easyinput type="text" autoHeight confirmType="send" v-model="msgInputVal" @confirm="sendMsgHandler"
					placeholder="请在此输入信息"></uni-easyinput>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useCounterStore
	} from '@/store/counter.js';
	import {
		Invocation,
		Message,
		User
	} from '@/types/protocol/Invocation';
	export default {
		data() {
			return {
				userName: '',
				userId: '',
				userAvatar:'',
				sessionId: '',
				store: useCounterStore(),
				recordList: [],
				msgInputVal: '',
			}
		},
		onLoad(item) {
			this.loadChatRecord(item);
		},
		methods: {
			// 加载聊天记录 | 
			loadChatRecord(item) {
				this.userName = item.name;
				this.userId = item.userId;
				this.userAvatar = item.avatar;
				// 是否发生过对话
				const chatInfo  =this.store.getChatMap().get(this.userId);
				// 无对话
				if(chatInfo===undefined) return;
				const _this = this;
				this.sessionId = chatInfo.sessionId;
				// 读聊天缓存
				const recordMap = this.store.getChatRecordMap();
				const token = this.store.getToken();
				this.recordList = recordMap.get(this.userId);
				// 无缓存
				if (this.recordList === undefined) {
					uni.request({
						url: `/chat-api/chat/get-chat-record/${this.sessionId}`,
						header: {
							'Authorization': token
						},
						success(res) {
							const data = res.data.data;
							_this.recordList = data;
							// 加入缓存
							recordMap.set(_this.userId, data)
							_this.store.setChatRecordMap(recordMap);
						}
					})
				}
			},

			sendMsgHandler() {
				const user = this.store.getUserInfo();
				let flag = false;
				// 新对话
				if(this.sessionId===''){
					flag =true;
					const random = Math.floor(Math.random()*1000000000);
					this.sessionId =random;
					const chatInfo = {
						user:{
							id:this.userId,
							name:this.userName,
							avatar:this.userAvatar,
						},
						unreadMsgCount:0,
						unreadMsg:'',
						sessionId:random,
					}
					this.store.getChatMap().set(this.userId,chatInfo);
				}
				// 组装信息 msg 
				const message = new Message(this.msgInputVal, user, this.userId, this.sessionId);
				const messageType = flag?'newPrivateChat':'privateChat';
				const invocation = new Invocation(messageType, message);
				// upd-cache
				const map = this.store.getChatRecordMap();
				this.recordList.push(message)
				map.set(this.userId, this.recordList);
				this.store.setChatRecordMap(map);
				// send
				uni.sendSocketMessage({
					data: JSON.stringify(invocation),
				})
				// reset
				this.msgInputVal = '';
			},
		}
	}
</script>

<style lang="scss">
	.header {
		text-align: center;
		padding-top: 30rpx;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
		border-bottom-color: #757575;
		background-color: #f7f7f7;
		position: fixed;
		z-index: 998;
		width: 100%;
		height: 4%;

		.content {
			padding-bottom: 16rpx;
		}
	}

	.content {
		padding-top: 11%;
		height: 70%;
		padding-bottom: 18%;
		overflow: hidden;

		.item {
			.receive {
				text-align: left;
			}

			.send {
				text-align: right;
			}
		}
	}



	.footer {
		bottom: 0rpx;
		background-color: #f7f7f7;
		height: 10%;
		position: fixed;
		z-index: 999;
		width: 100%;

		.btn {
			padding-top: 24rpx;
		}

	}
</style>
