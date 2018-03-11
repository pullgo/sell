<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-conter">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}"</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}"</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟"</span>
          </div>
        </div>    
      </div>
      <split></split>
      <ratingselect  @select="selectRating" @toggle="toggleContent"  :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-for="ratng in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{ratings.username}}</h1>
              <div class="star-wrapper">
                <span :size="24" :score="rating.score"></span>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in ratng.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ALL = 2;//全选

  import BScroll from "better-scroll"
  import axios from 'axios' 
  import star from 'components/star/star'
  import ratingselect from 'components/ratingselect/ratingselect'
  import split from 'components/split/split'
  import {formatDate} from 'common/js/date' //export方式就需要花括号

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,//子传父
        onlyContent: true,//子传父
      };
    },
    created() {
      axios.get('../data.json').then((res) => {
        this.ratings = res.data.ratings;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true,
          });
        });
      })
    },
    methods: {
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

    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },

    components: {
      star,
      ratingselect,
      split
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden   
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          marging-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px//给子元素加
            vertical-align: top
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px//给子元素加 
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px//给子元素加
          .deliveryTime
            font-size: 12px
            margin-left: 12px
            color: rgb(7, 17, 27)
    .ratings-wrapper
      padding: 0 10px
      .rating-item
        diaplay: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            line-height:  12px
            font-size: 10px
            margin-bottom: 4px
            color: rgb(1, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top 
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top 
              color: rgb(147, 153, 159)
          .text
            line-height: 18PX
            color: rgb(7, 17, 27)
            margin-bottom: 18px
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160,220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)





</style> 