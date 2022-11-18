<template>
	<view class="dish-content">
		<view class="image">
			<image :src="'https://takeout-dish-image-1255913523.cos.ap-guangzhou.myqcloud.com/dish-img/'+dishInfo.image"
				style="width: 150rpx; height: 150rpx;">
			</image>
		</view>

		<view class="name">
			{{dishInfo.name}}
			<view class="price">
				<span>￥</span>
				<span>{{dishInfo.price/100}}</span>
			</view>
		</view>

		<!-- 	<view class="operation">
			<icon type="download" @click="addItemHandler"></icon>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: 'dishItem',
		props: [
			"dishInfo",
			"addItemHandler"
		],
		data() {
			return {

			};
		},
	}
</script>

<style lang="scss">
	.dish-content {
		display: flex;

		.name {

			.price {
				padding-top: 78rpx;
				font-size: 30rpx;
				font-family: DIN, DIN-Medium;
				font-weight: 50;
				text-align: left;
				color: #e94e3c;
				line-height: 20rpx;
				letter-spacing: 0rpx;
			}
		}



		.operation {}
	}
</style>
