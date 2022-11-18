<template>
	<view>
		<view class="order-list">
			<uni-card isShadow="true">
				<view class="order-item" v-for="(item,index) in orderList">
					<image
						:src="item[1].image"
						style="width: 200rpx;height: 200rpx;" />
					<view class="info">
						<view class="name">
							{{item[1].name}}
							<view class="count">
								x{{item[1].count}}
							</view>
						</view>


						<view class="amount">
							{{item[1].amount/100}}
						</view>
					</view>
				</view>
				<view class="split">
					合计
				</view>
				<view class="total-price">
					{{totalPrice}}
				</view>
			</uni-card>
		</view>

		<view class="bottom">
			<view class="right">
				<button type="default" @click="createOrder"
					style="width: 19rem; background-color: #cccaaa">提交</button>
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
				orderList: {},
				canteenId:'',
				totalPrice: 0,
				store: useCounterStore(),
			}
		},
		onLoad(option) {
			this.canteenId = option.canteenId;
			const map = this.store.getShopCartMap();
			this.orderList = map.get(this.canteenId);
			this.CalculateTotalPrice();
		},
		methods: {
			loadOrder(canteenId) {
				const map = this.store.getShopCartMap();
				this.orderList = map.get(canteenId);
			},
			CalculateTotalPrice() {
				this.orderList.forEach((v, k) => {
					this.totalPrice += v.amount / 100;
				})
			},
			createOrder() {
				const map = this.store.getShopCartMap();
				const _this = this;
				uni.request({
					url: `/common-api/order/${_this.canteenId}`,
					method: 'POST',
					header: {
						'Authorization': this.store.getToken(),
						'content-type': 'application/json',
					},
					data:JSON.stringify(this.strMapToObj(_this.orderList)),
					success(data) {
						const orderId = data.data.data;
						uni.redirectTo({
							url: `/pages/pay/pay?totalPrice=${_this.totalPrice}&orderId=${orderId}&canteenId=${_this.canteenId}`,
							success() {
								_this.orderList = {}
								_this.totalPrice = 0;
							}
						})
					}
				})
			},
			strMapToObj(map) {
				let obj = Object.create(null);
				for (let [k, v] of map) {
					obj[k] = v;
				}
				return obj;
			}
		}
	}
</script>

<style lang="scss">
	.order-list {
		.order-item {
			display: flex;
			padding-top: 10rpx;

			.info {
				width: 13rem;

				.name {
					padding: 20rpx 0 0 20rpx;
					font-size: bold;
					font-weight: 1000;
					font-family: Verdana, Geneva, Tahoma, sans-serif;
					color: #000;
				}

				.count {
					padding-top: 66rpx;
					text-align: right;
				}

				.amount {
					text-align: right;
				}


			}
		}

		.split {
			padding-top: 20rpx;
			padding-bottom: 10rpx;
			border-bottom-style: solid;
			border-bottom-color: #ccc;
			border-bottom-width: rpx;
			font-weight: bold;
			color: #000;
		}

		.total-price {
			padding-top: 10rpx;
			padding-right: 47rpx;
			text-align: right;
			color: #000;
		}
	}
</style>
