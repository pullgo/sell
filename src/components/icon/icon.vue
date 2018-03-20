<template>
  <div class="icon":class="iconType">
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    size: {
      type: Number
    }
  },
  /*created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },*/
  computed: {
    iconType() {
      return 'icon-' + this.size;
    }
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../common/stylus/mixin";

  .icon
    font-size: 0
    display: inline-block 
    background-repeat: no-repaet
    width: 100%
    height: 100%
    &.icon-16
      background-size: 16px 16px
      display: inline-block 
      width: 16px
      height: 16px
      vertical-align: top
      //margin-right: 6px
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
  &.icon-12
    background-size: 16px 16px
    .icon-item
      display: inline-block 
      width: 12px
      height: 12px
      vertical-align: top
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

</style>
