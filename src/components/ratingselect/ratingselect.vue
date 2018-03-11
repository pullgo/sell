<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)"  class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)"  class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
    <div @click="toggleContent" class="switch">
      <span class="icon-check_circle" :class="{'on':onlyContent}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;//正向评价
  const NEGATIVE = 1;//夫评价
  const ALL = 2;//所有评价

  export default {
    props: {
      ratings: {
        type: Array,//数组对象都需要返回一个函数
        default() {
          return [];
        }
      },
      selectType: {//选择类型
        type: Number,
        default: ALL//默认显示所有的
      },
      onlyContent: {//读内容或者不读内容 是布尔值
        type: Boolean,
        default: false
      },
      desc: {//描述
        type: Object,
        default() {
          return {//返回一个对象 对象有3个key return后面是没有（）
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    //吐槽与不推荐数据 只有ratings数据 无吐槽与不推荐数据
    computed: {
      positives() {
        return this.ratings.filter((rating) => {//filter过滤属性
          return rating.rateType === POSITIVE; //rateType对应data.json里面的rateType
         
        });
      },
      negative() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    //点击按钮更改颜色
    methods: {
      select(type, event) {//外层有BScroll 需要传入event
        if(!event._constructed) {//点击事件
          return;
        }
        this.selectType = type;
        this.$emit('ratingtype.select', type);//点击更改按钮后告知父级 值告诉父的变化 父就可以监听组件
      },
      toggleContent(event) {
        if(!event._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;//取反
        this.$emit('content.toggle', this.onlyContent);//告诉content.toggle把onlyContent传出去
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "../../common/stylus/mixin"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px//padding的话下划线会满
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block//有间隙 父级加font size
        padding: 8px 12px
        border-radius: 2px
        margin-right: 8px
        font-size: 12px
        line-height: 16px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgb(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00B43C
      .icon-check_circle
        margin-right: 4px
        display: inline-block
        vertical-align: top
        font-size: 24px
      .text
        font-size: 12px
        display: inline-block
        vertical-align: top






</style>