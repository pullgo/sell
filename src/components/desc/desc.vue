<template>
  <div class="desc">
    <ul v-if="seller.supports" class="supports">
      <li class="support-item border-1px" v-for="(item,index) in seller.supports">
        <span class="icon" :class="classMap[seller.supports[0].type]"></span>
        <span class="text">{{seller.supports[0].description}}</span>
      </li>
    </ul>
  </div>
  </div>
</template>
<script type="text/ecmascript-6">

  export default {
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">

  .desc
    .supports
      width: 80%
      margin: 0 auto
      .support-item
        padding: 0 12px
        margin-bottom: 12px
        font-size: 0
        &:last-child
          margin-bottom:0
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_2')
          &.discount
            bg-image('discount_2')
          &.guarantee
            bg-image('guarantee_2')
          &.invoice
            bg-image('invoice_2')
          &.special
            bg-image('special_2')
        .text
          display: inline-block
          line-height: 16px
          font-size: 12px

</style>
