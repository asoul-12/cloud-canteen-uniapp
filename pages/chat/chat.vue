<template>
	<view>
		<view class="item-list">
			<view class="item" v-for=" item in chatList">
				<view class="content" @click="openChatHandler(item[0],item[1])">
						<image
							:src="item[1].user.avatar"
							mode="aspectFill" style="width: 200rpx;height: 200rpx; " />
					<view class="text">
						<view class="uni-badge--x">
							{{item[1].user.name}}
							<text class="uni-badge" v-if="item[1].unreadMsgCount!==0">{{item[1].unreadMsgCount}}</text>
						</view>
						<view class="unreadMsg">
							{{item[1].unreadMsg}}
						</view>
					</view>
				</view>
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
				chatList: {},
			}
		},
		onLoad() {
			this.chatList = new Map();
			this.chatList = this.store.getChatMap();
		},
		onShow() {
			uni.hideTabBarRedDot({
				index:1
			})
		},
		methods: {
			// click-avatar
			openChatHandler(sessionId, chatInfo) {
				// reset
				chatInfo.unreadMsgCount =0;
				chatInfo.unreadMsg = '';
				this.chatList.set(sessionId,chatInfo);
				uni.navigateTo({
					url: `/pages/chatInterface/chatInterface?name=${chatInfo.user.name}&sessionId=${sessionId}&userId=${chatInfo.user.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.item-list {
		padding-top: 10rpx;

		.item {
			border-bottom-color: #ccc;
			border-bottom-style: solid;

			.content {
				display: flex;
				padding-bottom: 15rpx;

				.text {
					font-size: 32rpx;
					font-weight: bold;
					padding-left: 10rpx;
					.unreadMsg{
						height: 80rpx;
						width: 18rem;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 25rpx;
						font-weight: normal;
						margin-top: 50rpx;
						overflow: hidden;
					}
				}
			}
		}
	}
	.uni-badge--x {
		position: relative;
	}
	.uni-badge{
		justify-content: center;
		flex-direction: row;
		height: 20px;
		min-width: 20px;
		padding: 0 4px;
		line-height: 18px;
		color: #fff;
		border-radius: 100px;
		background-color: #dd524d;
		border: 1px solid #fff;
		text-align: center;
		font-family: 'Helvetica Neue', Helvetica, sans-serif;
		font-feature-settings: "tnum";
	}
</style>
