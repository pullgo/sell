<template>
  	<div class="mheader">
  		<div class="content-wrapper">
 			<div class="avatar">
 				<img width="64" height="64" :src="seller.avatar">
 			</div>
 			<div class="content">
 				<div class="title">
 					<span class="brand"></span>
 					<span class="name">{{seller.name}}</span>
 				</div>
 				<div class="description">
 				    {{seller.description}}/{{seller.deliveryTime}}分钟送达
 				</div>
 				<!--如果不用v-if 则会报错 因为在APP.VUE里面首先传入的seller在初始化的时候是空-->
		        <div v-if="seller.supports" class="support">
		          <!--<span class="icon" width="12" height="12" :class="classMap[seller.supports[0].type]"></span>-->
		          <span class="text">{{seller.supports[0].description}}</span>
		        </div>
 			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
  		</div>
  		<div class="bulletin-wrapper">
  			<span class="bulletin-title" @click="showDetail"></span><span class="bulletin-text">{{seller.bulletin}}</span>
   			<i class="icon-keyboard_arrow_right"></i>
 		</div>
 		<div class="background">
 			<img :src="seller.avatar">
 		</div>
 		<div v-show="detailShow" class="detail">
 			<div class="detail-wrapper clearfix">
 				<div class="detail-main">
 					<h1 class="name">{{seller.name}}</h1>
 					<div class="star-wrapper">
 					<!--:是传入的意思-->
			            <star :size="48" :score="seller.score"></star>
 					</div>
 					<linemarp></linemarp> 					
 					<!--<div class="title">
 						<div class="line"></div>
 						<div class="text">优惠信息</div>
 						<div class="line"></div>
 					</div>-->
		            <ul v-if="seller.supports" class="supports">
		                <li class="support-item" v-for="(item,index) in seller.supports">
			            	<div class="icon-wrapper" :class="classMap[seller.supports[index].type]">
			            		<icon :size="16"></icon>
			            	</div>
				                	<!--<span class="icon"  width="16" height="16" :class="classMap[seller.supports[index].type]"></span>-->
				            <span class="text">{{seller.supports[index].description}}</span>
			            </li>
		            </ul>
		            <linemarp></linemarp>
		            <!--<div class="title">
		              	<div class="line"></div>
		              	<div class="text">商家公告</div>
		              	<div class="line"></div>
		            </div>-->
		            <div class="bulletin">
		            	<p class="content">{{seller.bulletin}}</p>
		            </div> 					
 				</div>
 			</div>
 			<div class="detail-close" @click="hideDetail">
 				<i class="icon-close"></i>
 			</div>
 		</div> 		
  	</div>
</template>
<script type="text/ecmascript-6">

import star from 'components/star/star'
import linemarp from 'components/linemarp/linemarp'
import icon from 'components/icon/icon'

export default {
  	props: {//属性
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			detailShow: false
  		};
  	},
  	methods: {
  		showDetail() {
	  		this.detailShow = true
  		},
  		hideDetail() {
	  		this.detailShow = false 			
  		},
  	},  	
  	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
	},
	components: {
		star,
		linemarp,
		icon
	}	
};
</script>
<style lang="stylus" rel="stylesheet/stylus">

	@import "../../common/stylus/mixin"

	.mheader
		position: relative
		color: #fff
		backgound: rgba(7, 17, 27, 0.8)
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			font-size: 0//去掉并排元素的缝隙 有空白字符在里面 在父元素添加 子元素设置font大小 因为会继承
			.avatar
				display: inline-block//行内并排 两个并排的都需要设置该属性
				vertical-align: top
				img
					border-radius: 2px
			.content
				display: inline-block
				margin-left: 14px
				font-size: 14px
				.title
					margin: 2px 0 8px 0
					.brand
						display: inline-block
						vertical-align: top
						width: 30px
						height: 18px
						bg-image('brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						display: inline-block
						margin-left: 6px
						font-size: 16px
						line-height: 18px
						font-weight: bold
				.description
					margin-bottom: 10x
					line-height: 12px
					font-size: 12px	
				.support
					margin-top: 4px
					/*.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px 12px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')*/
			        .text
				        line-height: 12px
			        	font-size: 10px
			.support-count
				position: absolute 
				right: 12px
				bottom: 14px
				padding: 2px
				height: 24px
				line-height: 24px
				border-radius: 12px
				background-color: rgba(0, 0, 0, 0.2)
				vertical-align: middle
				.count
					padding-left: 3px
					display: inline-block
					vertical-align: middle
					font-size: 10px 
					line-height: 24px  
				.icon-keyboard_arrow_right
					vertical-align: middle
					line-herght: 24px
					margin-left: 2px
					font-size: 10px	
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			background: rgba(7, 17, 27, 0.2)
			.bulletin-title
				display: inline-block
				vertical-align: top
				margin-top: 8px
				width: 22px
				height: 12px 
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				vertical-align: top
				margin: 0 4px
				font-size: 10px
			.icon-keyboard_arrow_right
				position: absolute 
				font-size: 10px
				right: 12px
				top: 8px
		.background
			position: absolute	
			top: 0
			left: 0
			width: 100% 
			height: 100%
			z-index: -1	
			filter: blur(14px)
			img
				width: 100%
				height: 100%				
		.detail
			position: fixed
			top: 0
			left: 0
			z-index: 100
			width: 100%
			height: 100%
			overflow: auto
			background: rgba(7, 17, 27, 0.5)
			.detail-wrapper
				width: 100%
				min-height: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px
					.name
						line-height: 16px
						font-size: 16px
						text-align: center
						font-weight: 700
					.star-wrapper
						margin-top: 18px
						padding: 2px 0px
						text-align: center
					.text
						padding: 0 12px	
						font-weight: 700
						font-size: 14px
					.supports
						width: 80%
						margin: 0 auto
		            	.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom:0
							.icon-wrapper
								display: inline-block
								background: red	
							.text
								display: inline-block
								line-height: 16px
								font-size: 12px
					.bulletin
						width: 80%
						margin: 0 auto
						.content
							padding: 0 12px
							line-height: 24px
							font-size: 14px			
			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px

</style>
