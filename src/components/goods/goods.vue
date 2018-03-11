<template>
    <div class="goods">
	   	<!--在vue1.0中v-el 和 v-ref 合并为一个 ref=“”--> 
   		<div class="menu-wrapper" ref="menuWrapper">
	   		<ul>
	   			<!--$event解决在APP端点击正常在PC端点击出现两次情况-->
	   			<!--'current':currentIndex===index 意思是当两个index相等的时候 就赋class current 为高亮-->
	   			<!--selectMenu点击滚动事件-->
	   			<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
	   				<span class="text border-1px">
	   					<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
	   				</span>
	   			</li>
	   		</ul>
	    </div>
	    <!--右侧-->
	    <div class="foods-wrapper" ref="foodsWrapper">
	    	<ul>
	    		<li v-for="(item,index) in goods" class="food-list food-list-hook">
	    			<h1 class="title">{{item.name}}</h1>
	    			<ul>
	    				<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
	    					<div class="icon" height="57" width="57">
	    						<img :src="food.icon">
	    					</div>
	    					<div class="content">
	    						<h2 class="name">{{food.name}}</h2>
	    						<p class="desc">{{food.description}}</p>
	    						<div class="extra">
	    							<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}个</span>
	    						</div>
	    						<div class="price">
	    							<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
	    						</div>
	    						<div class="cartcontrol-wrapper">
	    							<cartcontrol :food="food"></cartcontrol>
	    						</div>	    						
	    					</div>
	    				</li>
	    			</ul>
	    		</li>
	    	</ul>
	    </div>
	   	<!--selectFoods传入购物车组件 实现联动-->	    
	    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.inPrice"></shopcart> 
    <food ref="food" :food="selectedFood"></food>
    </div>
</template>

<script type="text/ecmascript-6">

	import BScroll from "better-scroll"
	import axios from 'axios'
	import shopcart from 'components/shopcart/shopcart'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import food from 'components/food/food'

    export default {
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data() {
    		return {
    			goods: [],
    			ListHeight: [],//每个区间的高度
    			scrollY: 0,//跟踪变量  需要跟踪就放在data里面
    			selectedFood: {}//data观测的数据不能与methods里面的方法重名
    		};
    	},
    	//左侧的索引 计算属性
    	computed: {
    		currentIndex() {//计算左侧索引
    			for(let i=0;i<this.ListHeight.length;i++) {
    				let height1 = this.ListHeight[i];//当前索引值的高度 高点
    				let height2 = this.ListHeight[i + 1];//下一个索引值的高度  低点
    				//是>= 默认第一个是高亮 向下的闭区间>= 一开始就是o 否则不会跟着滚动
    				if(!height2 || ( this.scrollY >= height1 && this.scrollY < height2)) {
    					return i;//最后一个 或者当前区间则返回索引
    				}
    			}
    			return 0;//否则返回0
    		},
    		selectFoods() { //计算属性 观测的是goods变化
    			let foods = []; //首先遍历goods
    			this.goods.forEach((good) => {
    				good.foods.forEach((food) => {//遍历foods
    					if (food.count) {//判断food.count是否大于0 如果大于0 表示被选择过
    						foods.push(food);
    					}
    				});
    			});
    			return foods;
    		}    		
    	},
    	created() {
	    	this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		    axios.get('../data.json').then((res) => {
			    this.goods = res.data.goods
		    //计算 产生滚动
	      	this.$nextTick(() => {//渲染后才可以使用 这个是一个接口 改变了DOM 但是数据没有更新需要使用$nextTick 才可以计算高度得到滚动效果
	      	this._initScroll();//调用
		    //左右联动
	     	this._calculateHeight();//计算高度 相应位置高亮
	      		});
		    })
		},
		methods: {
			//点击左侧 跳到相对应部分 需要跳转对应的话传入index event点击事情
			selectMenu(index,event) {
			//解决pc端2次  阻止默认的点击事件
			//better-scroll派发事件就返回电脑本身无_constructed
				if(!event._constructed) {
					return;
				}
			   	let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');

			   	let el = foodsList[index];//相应的元素
			   	this.foodsScroll.scrollToElement(el, 300);//scrollToElement指定跳到哪里 滚动到相应元素
			}, 
			//购物车详情页
			selectFood(food, event) {
				if(!event._constructed) {
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},

			//调用shopcart1 里面的drop事件 在这里定义下落的方法
			
			_drop(target) { 
				//小球动画 在手机端动画执行是会出现2次 比较卡 需要使用nexttICK回调里面异步执行 体验优化 异步执行下落动画

				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);//调取子组件用refs 调用drop并且传入target
				});
			},

		   //BScroll初始化 接收2个参数 1.dom对象 2.jsop对象--this.$refs.menuWrapper, {}
		    _initScroll() {
		   		this.menuScroll = new BScroll(this.$refs.menuWrapper, {
		   			click:true,//这样才可以点击 BScroll实现原理是监听了star 与end 阻止了默认事件  但是派发了2次点击事件 造成PC端点击2次 需要传$event
		   			probeType: 3//为1时非实时派发滚动事件 为2时屏幕滑动 为 3 的时候，不仅在屏幕滑动的过程中而且在 momentum 滚动动画实时派发
		   		});
		   		this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
		   			click:true,
		   		});
                //监听滚动位置
		   		this.foodsScroll.on('scroll', (pos) => {
		   			if (pos.y <= 0) {
			   			this.scrollY = Math.abs(Math.round(pos.y));//Math.round转化为整数  Math.abs绝对值 正值	
		   			}
		   		});
		   	},
		    _calculateHeight() {
			   	let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			   	let height = 0;
			   	this.ListHeight.push(height);//pust第一个的高度
			   	for(let i = 0;i < foodsList.length;i++){
			   		let item = foodsList[i];
			   		height += item.clientHeight;//clientHeight接口 对区间的统计 可理解为内部可视区高度,样式的height+上下padding
			   		this.ListHeight.push(height);
			   	}
		    }
		},
		components: {
			shopcart,
			cartcontrol,
			food
		},
		events: {//父传子  小球动画
			'cart.add'(target) {//父
				this._drop(target);//子 调用子组件的方法
			}
		}		
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">

    @import "../../common/stylus/mixin";

	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px//等分 内容的缩放情况 占位宽度
			width: 80px//不写这个 在安卓有兼容问题
			background: #f3f5f7
			.menu-item
				display: table //一行或者多行垂直居中
				height: 54px
				width: 56px
				line-height: 14px
				padding: 0 12px//居中
				&.current
					position: relative
					z-index: 10
					margin-top: -1px//盖住
					background: #fff
					font-weight: 700
					.text
						border-none()
				.icon
		            display: inline-block
		            vertical-align: top
		            width: 12px
		            height: 12px
		            margin-right: 2px
		            background-size: 12px 12px
		            background-repeat: no-repeat
		            &.decrease
		              bg-image('decrease_3')
		            &.discount
		              bg-image('discount_3')
		            &.guarantee
		              bg-image('guarantee_3')
		            &.invoice
		              bg-image('invoice_3')
		            &.special
		              bg-image('special_3')
		        .text
		        	display: table-cell//格子
		        	width: 56px
		        	vertical-align: middle//垂直居中
		        	border-1px(rgba(7, 17, 27, 0.1))
		        	font-size: 12px
		.foods-wrapper
			flex: 1
			overflow: hidden
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dd1
				font-size: 12px
				color: rgb(147, 153, 159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px//描边不紧贴底部
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
					margin-bottom: 0//最后一个屋描边
				.icon
					flex: 0 0 57px//左右分栏布局
					margin-right: 10px
				.content
					flex: 1//左右分栏布局
					font-size: 0
					.name
						display: inline-block
						margin: 2px 0 8px 0
						font-size: 14px
						height: 14px
						line-height: 18px
						color: rgb(7, 17, 27)
					.desc, .extra
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						display: inline-block
						margin: 3px 0px 3px 1px
					.extra
						.count
							margin-right: 10px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px	
							color: rgb(240, 20, 20)	
						.old
							text-decoration: line-through
							font-size: 10px	
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 0

</style>
