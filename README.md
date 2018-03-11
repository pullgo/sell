# app-music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


2018-3-1
node 7.6+

启动一个项目的步骤
1.npm install vue-cli -g
2.vue init webpack **
3.cd **
4. npm install
5.npm run dev


配置别名路径
在 build /base / config 

{//404路由 访问不存在 直接跳转
	path:'*',
	redirect: '/goods'
}


<style lang="stylus" rel="stylesheet/stylus"> 也可以直接使用<style scoped lang="less">

less 安装  npm install less less-loader --save-dev

配置当前激活的样式 在路由里面配置  linkActiveClass: 'active' 在组件里面写样式 .active