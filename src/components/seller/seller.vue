<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">{{seller.ratingCount}}</span>
          <span class="text">月售{{seller.sellCount}}</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--收藏部分-->
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="txt">{{favoriteText}}</span>         
        </div>
      </div>
      <split></split>
      <div class="bullietin">
        <h1 class="title"></h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
            <li class="support-item border-1px" v-for="item
             in seller.supports">
              <span class="icon" :class="classMap[seller.supports[0].type]"></span>
              <span class="text">{{seller.supports[0].description}}</span>
            </li>
        </ul>
      </div>
      <split></split>
      <div class="pice">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title"></h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from "better-scroll"
import {saveToLocal, loadFromLocal} from 'common/js/store'
import star from 'components/star/star'
import split from 'components/split/split'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
          //传入的三个值 id value 布尔 后面需要加()立即执行函数
        })()
        //观测收藏部分在计算属性里面写明即可 后面的读取操作不能再直接写false 应该写一个历史执行函数
      };
    },

    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },    
    watch:{
      'seller'() {
        this._initScroll();
        this._initPics();//如果没有的话 无法滚动 因为在reday之后写的话还没有seller
      }
    },
    ready() {//可以操作dom 来回执行
      this._initScroll();//切换后不能滚动 但是加了之后 切花可以滚动 其他不能滚动 需要添加this.scroll.refresh();
      this._initPics();//如果没有的话 无法滚动
    },
    methods: {
      toggleFavorite(event) {
        if(!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite',this.favorite)//
        //localStorage.favorite = this.favorite;//得到缓存
      },
      _initScroll() {
        if(!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      //给每张图片加上宽度
      _initPics() {
        if(this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.lengtgh - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if(!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'//规定图片横向滚动 忽略竖向的滚动
              });
            }else{
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/mixin"

  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden 
   .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
       .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          line-height: 18px
          vertical-align: top
          margin-right: 12px
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        right: 11px
        top: 18px
        width: 50px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .txt
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bullietin
      padding: 18px 18px 0px 18px
      .title
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border: none
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          font-size: 12px
          line-height: 16px
          color: rgb(7, 17, 27)
    .pice
      padding: 18px
      .title
        margin-bottom: 12px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap//横向排列
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0px 18px
      color: rgb(7, 17, 27)
      .title
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border: none



</style>
