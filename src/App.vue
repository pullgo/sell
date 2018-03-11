<template>
  <div id="app">
    <mheader :seller="seller"></mheader>
    <div class="tab border-1px">
    	<div class="tab-item">
         <router-link to="/goods">商品</router-link>
      </div>
    	<div class="tab-item">
         <router-link to="/ratings">评价</router-link>
      </div>
    	<div class="tab-item">
         <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable no-new */

  import {urlParse} from 'common/js/util'
  import Mheader from "components/m-header/m-header"
  import axios from 'axios'

  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();//立即执行函数
            return queryParam.id;
          })()
        }
      }
    },
    created() {
      axios.get('../data.json?id=' + this.seller.id).then((res) => {//加上?id=' + this.seller.id)
        this.seller = res.data.seller,
        this.goods = res.data.goods,
        this.ratings = res.data.ratings
        //this.seller = Object.assign({},this.seller.response.data);//ES6 方法 assign VUE官网  得到后台缓存数据
      })
    },
    components: {
       Mheader
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
         
</style>
