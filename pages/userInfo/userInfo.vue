<template>
	<view>
		<uni-card :title="userInfo.name" :thumbnail="userInfo.avatar">
			<text class="uni-body uni-mt-5">今晚吃什么</text>
			<view slot="actions" class="card-actions">
				<view class="card-actions-item" style="text-align: right;">
					<uni-icons type="arrow-right" size="18" color="#999"></uni-icons>
					<text class="card-actions-item-text">登出</text>
				</view>
			</view>
		</uni-card>
		<view class="my-order">
			我的订单
		</view>
		<view class="order-list">
			<view class="list-item" v-for="item in orderMap">
				<uni-card border="false" :title="item[1].canteenName" :extra="`￥${item[1].orders.amount/100}`" 
							@click="orderHandler(item[1].orders)"
				>
					下单时间：{{item[1].orders.orderTime}}
					<view>
						{{item[1].orders.status===0?'未确认':'已确认'}}
					</view>
				</uni-card>
			</view>
		</view>
	</view>

</template>

<script>
	import userInfoVue from './userInfo.vue';
	import {
		useCounterStore
	} from '@/store/counter.js'
	export default {
		data() {
			return {
				store: useCounterStore(),
				userInfo: {},
				orderMap: {},
			}
		},
		onLoad() {
			this.orderMap = new Map();
			this.loadUserInfo();
		},
		onShow() {
			this.loadOrderList();
		},
		methods: {
			loadUserInfo() {
				this.userInfo = this.store.getUserInfo();
			},
			loadOrderList() {
				const _this = this;
				uni.request({
					url: `/common-api/order/${_this.userInfo.id}/1/5`,
					success(data) {
						data.data.data.forEach((item) => {
							const order = {
								canteenName:item.canteenName,
								orders:item.orders,
							}
							_this.orderMap.set(item.id,order);
						})
					}
				})
			},
			orderHandler(item) {
				uni.navigateTo({
					url:`/pages/pay/pay?canteenId=${item.canteenId}&totalPrice=${item.amount/100}&orderId=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.head {
		display: flex;

		.avatar {}

		.info {}
	}

	.my-order {
		font-weight: bold;
		margin-left: 10rpx;
	}

	.order-list {
		margin-top: 10rpx;
	}
</style>
