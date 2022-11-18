<template>
	<view>
		<view class="head">
			<view class="tip">
				{{status}}
			</view>
		</view>

		<view class="content">
			<view class="item-list">
				<view class="item" v-for="(item,index) in shopCartList">
					<view class="left">
						{{item[1].name}}
					</view>
					<view class="right">
						<view class="count">
							￥{{item[1].amount/100}}
						</view>
						<view class="amount">
							x{{item[1].count}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer">
			合计
			<view class="amount">
				{{totalPrice}}
			</view>
			<button @click="payHandler" :disabled="payBtnVisable" >去取菜</button>
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
				status: '待确认',
				shopCartList: '',
				totalPrice: '',
				orderId: '',
				payBtnVisable:false,
			}
		},
		onLoad(item) {
			this.shopCartList = this.store.getShopCartMap().get(item.canteenId);
			this.totalPrice = item.totalPrice;
			this.orderId = item.orderId;
		},
		methods: {
			payHandler() {
				const _this = this;
				// 根据订单id获取订单金额
				uni.request({
					url: `/common-api/order/check-amount/${_this.orderId}`,
					header: {
						'Authorization': this.store.getToken(),
						'content-type': 'application/json',
					},
					success(data) {
						uni.showModal({
							title: '确认信息',
							content: `本次消费${data.data.data/100}`,
							success(res) {
								// 确认付款
								if (res.confirm) {
									uni.request({
										url: `/common-api/order/pay-order/${_this.orderId}`,
										header:{
											'Authorization': _this.store.getToken(),
											'content-type': 'application/json',
										},
										success() {
											_this.status = '已确认，等待商家上菜';
											_this.payBtnVisable = true;
										},
										fail() {
											_this.status = '确认失败了';
										}
									})
								}
							}
						})
					},
					fail() {
						uni.showModal({
							title: '结果',
							content: '拉取失败了，稍后再试试叭'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.head {
		display: flex;
		padding-top: 30rpx;
		padding-bottom: 10rpx;
		border-bottom-style: solid;
		border-bottom-color: #ccc;
		border-bottom-width: rpx;

		.tip {
			font-size: 70rpx;
			font-weight: bold;
			color: #000;
		}

		.stop-watch {
			padding-top: 53rpx;
			width: 10rem;
			text-align: right;

		}

	}

	.content {
		margin-top: 1%;

		.item {
			padding-top: 10rpx;

			.right {
				display: flex;
				flex-direction: row-reverse;
				text-align: right;

				.amount {
					margin-right: 3%;
				}
			}
		}

	}

	.footer {
		margin-top: 5%;

		.amount {
			text-align: right;
			margin-bottom: 3%;
			border-top-color: #ccc;
			border-top-style: solid;
			// border-top-width: 1px;
		}
	}
</style>
