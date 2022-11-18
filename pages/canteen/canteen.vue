<template>
	<page-meta :page-style="'overflow:'+(shopCartShow?'hidden':'visible')"></page-meta>
	<view class="store_content">
		<view class="head">
			<uni-card :title="canteenInfo.canteenName" padding="10px 0" :thumbnail="canteenInfo.canteenAvatar">
				<text class="uni-body uni-mt-5">今晚吃什么</text>
			</uni-card>
		</view>

		<view class="menu">
			<y-tabs direction="vertical" navWidth="210rpx" @click="loadCanteenDish">
				<y-tab v-for="(item,index) in categoryList" :title="item.name" :name="item.id">
					<view class="dish-list">
						<view class="dish-item" v-for="(item,index) in dishList">
							<image
								:src="item.image"
								mode="scaleToFill" style="height: 200rpx;
								 width: 200rpx;
								 margin-right: 20rpx;
								 padding-bottom: 20rpx;
								 " />
							<view class="item-right">
								<view class="item-name">
									{{item.name}}
								</view>

								<view class="item-desc">
									{{item.description}}
								</view>

								<view class="item-bottom">
									<view class="item-price">
										<span>￥</span>
										<span>{{item.price/100}}</span>
									</view>
									<view class="dish_add_btn" @click="addItemHandler(item,item.id)">
										<image src="../../static/bbh-shopcar/icon/addf.png" mode="aspectFit"
											style="height: 50rpx;width: 50rpx;"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</y-tab>
			</y-tabs>
		</view>




		<view class="bottom">
			<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="goodsNavHandler"
				@buttonClick="goodsNavButtonHandler" />
		</view>

		<uni-popup ref="cartMessage" type="message">
			<uni-popup-message type="warn" message="没点东西呢!" :duration="2000"></uni-popup-message>
		</uni-popup>


		<view class="cart-popup">
			<uni-popup ref="popup" type="bottom" @change="popupChange" safeArea backgroundColor="#fff"
				style="height: 300rpx;">
				<scroll-view scroll-y="true">
					<view class="shop-cart">
						<view class="cart-title">
							<view class="title">购物车</view>
						</view>
						<view class="cart-content" v-for="(item,index) in shopCartList">
							<view class="cart-item">
								<view class="item-image">
									<image
										:src="item[1].image"
										style="width:140rpx;height: 140rpx; margin-top: 20rpx;margin-left: 20rpx;" />
								</view>
								<view class="content-left">
									<view class="item-name">
										{{item[1].name}}
									</view>
									<view class="item-price">
										<span>￥</span>
										<span>{{item[1].amount/100}}</span>
									</view>
								</view>
								<view class="content-right">
									<view @click="subItemHandler(item[0])">
										<image src="../../static/bbh-shopcar/icon/signf.png"
											style="width:50rpx;height: 50rpx;"></image>
									</view>
									<view style="margin-left: 15rpx; margin-right: 15rpx;">
										<span>{{item[1].count}}</span>
									</view>
									<view @click="addItemHandler(undefined,item[0])">
										<image src="../../static/bbh-shopcar/icon/addf.png"
											style="width:50rpx;height: 50rpx;"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</uni-popup>
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
				canteenInfo: {
					canteenId: '',
					canteenName: '',
					canteenAvatar: '',
					canteenHostId: '',
				},
				categoryList: [],
				dishList: [],
				shopCartList: {},
				shopCartShow: false,
				options: [{
						icon: 'chat',
						text: '联系'
					},
					{
						icon: 'star',
						text: '评价'
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 0,
					}
				],
				buttonGroup: [{
					text: '去下单',
					backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
					color: '#fff'
				}],
			}
		},
		onLoad(item) {
			this.shopCartList = new Map();
			this.canteenInfo.canteenName = item.canteenName;
			this.canteenInfo.canteenId = item.canteenId;
			this.canteenInfo.canteenHostId = item.hostId;
			this.canteenInfo.canteenAvatar =item.canteenAvatar;
			this.loadCanteenCategory(item.canteenId);
		},
		onShow() {
			const map = this.store.getShopCartMap();
			const shopcart = map.get(this.canteenInfo.canteenId);
			if (shopcart !== undefined) {
				this.shopCartList = shopcart;
				this.shopCartList.forEach((k,v)=>{
					this.options[2].info += k.count
				})
			}
		},
		methods: {
			// 加载餐厅菜品分类
			loadCanteenCategory(canteenId) {
				uni.request({
					url: `/common-api/canteen/category/${canteenId}`,
					success: (res) => {
						this.categoryList = res.data.data;
						this.loadCanteenDish(this.categoryList[0].id);
					},
					fail: (err) => {wx
						console.log(err);
					}
				})
			},
			// 根据categoryId加载餐厅菜品
			loadCanteenDish(categoryId) {
				uni.request({
					url: `/common-api/canteen/dish/${categoryId}`,
					success: (res) => {
						this.dishList = res.data.data
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			// 添加菜品到购物车
			addItemHandler(item, id) {
				let cartItem = this.shopCartList.get(id)
				if (cartItem === undefined) {
					cartItem = {
						name: item.name,
						image: item.image,
						count: 1,
						amount: item.price,
						price: item.price,
					}
				} else {
					cartItem = {
						name: cartItem.name,
						image: cartItem.image,
						count: cartItem.count + 1,
						amount: cartItem.amount + cartItem.price,
						price: cartItem.price,
					}
				}
				this.options[2].info += 1;
				this.shopCartList.set(id, cartItem);
				this.store.getShopCartMap().set(this.canteenInfo.canteenId,this.shopCartList);
			},
			//
			subItemHandler(id) {
				let cartItem = this.shopCartList.get(id)
				cartItem = {
					name: cartItem.name,
					image: cartItem.image,
					count: cartItem.count - 1,
					amount: cartItem.amount - cartItem.price,
					price: cartItem.price,
				}
				this.options[1].info -= 1;
				if (cartItem.count === 0) {
					this.shopCartList.delete(id);
				} else {
					this.shopCartList.set(id, cartItem);
				}
			},
			// 阻止弹出层滚动穿透
			popupChange(e) {
				this.shopCartShow = e.show;
			},
			// 底部左侧导航栏点击事件
			goodsNavHandler(e) {
				if (e.index === 0) {
					this.openChatHandler();
				} else if (e.index === 1) {
					//TODO
				} else if (e.index === 2) {
					this.openShopCartHandler();
				}
			},
			// 底部导航栏右侧点击事件
			goodsNavButtonHandler(e) {
				this.checkoutHandler();
			},
			// 打开聊天界面
			openChatHandler() {
				uni.navigateTo({
					url: `/pages/chatInterface/chatInterface?userId=${this.canteenInfo.canteenHostId}&name=${this.canteenInfo.canteenName}&avatar=${this.canteenInfo.canteenAvatar}`
				})
			},
			// 触发购物车弹出层
			openShopCartHandler() {
				this.$refs.popup.open();
			},
			// 触发结账
			checkoutHandler() {
				// 判断购物车size
				if (this.shopCartList.size === 0) {
					this.$refs.cartMessage.open();
				} else {
					uni.showLoading({
						title: "请稍后"
					});
					// 保存购物车信息到store
					const map = this.store.getShopCartMap();
					map.set(this.canteenInfo.canteenId, this.shopCartList);
					this.store.setShopCartMap(map);
					uni.navigateTo({
						url: `/pages/order/order?canteenId=${this.canteenInfo.canteenId}`,
						complete() {
							uni.hideLoading();
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.menu {
		box-sizing: border-box;

		.dish-list {

			.dish-item {
				margin-top: 20rpx;
				display: flex;

				.item-right {

					.item-name {
						height: 32rpx;
						opacity: 1;
						font-size: 28rpx;
						font-family: PingFangSC, PingFangSC-Semibold;
						font-weight: 600;
						text-align: left;
						color: #333333;
						line-height: 32rpx;
						letter-spacing: 0;
						padding-top: 5rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						width: 175rpx;
					}

					.item-desc {
						height: 100rpx;
						opacity: 1;
						font-size: 25rpx;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #666666;
						line-height: 28rpx;
						letter-spacing: 0rpx;
						margin-bottom: 10rpx;
						margin-top: 10rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						width: 250rpx;
					}

					.item-bottom {
						display: flex;

						.item-price {
							padding-top: 10rpx;
							font-size: 30rpx;
							font-family: DIN, DIN-Medium;
							font-weight: 100;
							text-align: left;
							color: #000000;
							line-height: 20rpx;
							letter-spacing: 0rpx;
							width: 60rpx;
						}

						.dish_add_btn {
							margin-left: 160rpx;
							height: 100rpx;
							text-align: right;
						}
					}
				}
			}
		}
	}


	.bottom {
		bottom: 0;
		width: 100%;
		position: fixed;
		z-index: 999;
	}

	.cart-popup {

		.shop-cart {
			height: 700rpx;

			.cart-title {
				height: 59rpx;
				display: flex;
				line-height: 60rpx;
				position: relative;
				margin-left: 15rpx;
				margin-right: 10rpx;
				border-bottom: 1rpx solid #efefef;

				.title {
					font-size: 30rpx;
					font-family: PingFangSC, PingFangSC-Semibold;
					font-weight: 600;
					text-align: left;
					color: #333333;
				}

			}

			.cart-content {

				.cart-item {
					display: flex;

					.content-left {

						width: 200rpx;

						.item-name {
							height: 32rpx;
							opacity: 1;
							font-size: 32rpx;
							font-family: PingFangSC, PingFangSC-Semibold;
							font-weight: 600;
							text-align: left;
							color: #333333;
							line-height: 32rpx;
							letter-spacing: 0;
							padding-top: 35rpx;
							padding-left: 30rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							width: 200rpx;
						}

						.item-price {
							padding-top: 50rpx;
							padding-left: 20rpx;
							font-size: 30rpx;
							font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
							font-weight: 400;
							text-align: left;
							color: #000000;
							line-height: 20rpx;
							letter-spacing: 0rpx;
							width: 60rpx;
						}
					}

					.content-right {
						padding-top: 105rpx;
						padding-left: 150rpx;
						display: flex;
					}
				}

			}
		}
	}
</style>
