import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'
import Seller from 'components/seller/seller'

Vue.use(VueRouter)

export default new VueRouter({
    linkActiveClass: 'active',
	routes: [
		  {
		   path:'/goods',
		   component: Goods
		   },
		  {
		  	path:'/ratings',
		    component: Ratings
		  },
		  {
		  	path:'/seller', 
		  	component: Seller
		  },
		  {//404路由 访问不存在 直接跳转
		  	path:'*',
		  	redirect: '/goods'
		  }
	]
})








