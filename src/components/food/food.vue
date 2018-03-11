<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <!---->
          <div class="price">
            <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <div @click.stop.prevent="addFrist" class="buy" v-show="!food.count || food.count ===0" transition="fade">加入购物车</div>
        </div>
        <split></split>
        <div class="info" v-show="!food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.infos}}</p>
        </div> 
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <!--评价的筛选needShow(rating.rateType,rating.text) 定义一个函数将所需要的返回值传入即可v-show也可以绑定一个函数的表达式-->
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <!--时间戳 转为字符串用formatDate 在定义一个方法 filters-->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateTyp===0,'icon-thumb_down':rating.rateTyp===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings && !food.ratings.length">暂无评价</div>
          </div>
        </div>       
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  const ALL = 2;//全选

  import BScroll from "better-scroll"
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import Vue from 'vue'
  import {formatDate} from 'common/js/date' //export方式就需要花括号
  import ratingselect from 'components/ratingselect/ratingselect'
  import split from 'components/split/split'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,//子传父
        onlyContent: true,//子传父
        desc: {//子传父
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {//是对象 不需要小括号
      show() {//外部可以调用的就这样命名（如goods组件） 如果是私有的就加_ 父级传过来的方法 子不能向父传
        this.showFlag = true;
        this.selectType = ALL;//更改按钮切换的颜色this.selectType = 0/1/2
        this.onlyContent = true//更改POSITIVE/NEGATIVE测试评价筛选
        this.$nextTick(() =>{
          if(!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          }else{
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFrist(event) {
        if(!event._constructed) {
          return;
        }
        //此时出现的问题小球送上面飞下来 因为用getBoundingClientRect()重新计算位置 需要重新做一个动画transition="fade"
        this.$emit('cart-add', event.target); //父----子
        Vue.set(this.food, 'count', 1);
      },
      //评价的筛选
      needShow(type, text) {
        if(this.onlyContent && !text) {//是否显示内容 在判断类型
          return false;
        }
        if(this.selectType === ALL) {//类型为全部
          return true;
        }else{
          return type === this.selectType;//类型一致 旋转类型和评价类型一致
        }
      }
    },
    events: {//子----父 因为选择的都是基础类型改变不了父级的组件
      'ratingtype.select'(type) {//TYPE 里面的T是小写 与$emit里面的评写一样
        this.selectType = type;//把子组件的type赋值给父组件selectType
        //选择筛选后窗口的高度会更改 需要进行下一步的操作this.scroll.refresh()但是没有效果 因为DOM没有更新还是需要nexttick 异步更新DOM
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    //将时间戳定义个函数转化日期格式
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      ratingselect,
      split
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "../../common/stylus/mixin"

  .food
    position: fixed//屏幕定位
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    &.move-transition
      transition: all 0.2s linear
      transfrom: translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%//小技巧
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute 
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 10px
        .sell-count
          margin-right: 12px
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
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220)
        &.fade-transition
          transition: all 0.2s
          opacity: 1
        &.fade-enter, &.fade-leave
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 24px
              font-size: 12px
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)

</style>