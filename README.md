---
title: daojia.jd
sub-title: 仿京东到家极速达小程序 
---
# 从头撸一个京东到家小程序
> 写在前面：商城小程序可太多了，淘宝天猫京东购物小米商城，选择京东到家的原因是，京东到家在在众多商城来看，可以做到小而精，而且方便快捷，这是一个你没有玩过的全新版本。京东到家一直在更新客户端，我觉得小程序也应该大力推广。话不多说，下面就为你介绍我的第一个小程序学习成果，仿京东到家小程序，界面参照京东到家，功能自己实现，以及小技巧和踩过的各种坑。萌新还不快快上车。
## 这是一波效果图

> 参考文档：[w3c小程序文档](https://www.w3cschool.cn/weixinapp/)、[小程序实战指南](http://www.wxappclub.com/book/1)、[weui.wxml](https://github.com/Tencent/weui-wxss/tree/master/dist/example)

## 这些功能看看有没有你想要的

### 地址的获取和选择
图

这个很简单，用官方`api`就可以获取当前位置，这里我使用了腾讯的位置服务 [小程序JavaScript SDK](http://lbs.qq.com/qqmap_wx_jssdk/index.html)，它提供了调用腾讯位置服务的POI检索、关键词输入提示、地址解析、逆地址解析、行政区划和距离计算等数据服务（原话），京东到家小程序可以在这方面增加功能性。
```js
/*判断是第一次加载还是从 location 页面返回
    如果从 location 页面返回，会传递用户选择的地点*/
    if (app.globalData.address) {
      this.setData({
        address: app.globalData.address
      })
    } else {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        //这个 key 需要用户自己申请
        key: 'JF2BZ-DDH65-DCUIH-QU3TN-FT4UF-EEFEH'
      })
      // 调用接口
      qqmapsdk.reverseGeocoder({
        success: res => {
          this.setData({
            address: res.result.address
          })
        },
      })
    }
```
```js
//移动选点
moveToLocation: function () {
    wx.chooseLocation({
      success: function (res) {
        //选择地点之后返回到首页
        wx.switchTab({
            url: '/pages/index/index'
        })
        this.setData({
            address: res.address + res.name
        })
        app.globalData.address = res.address + res.name
        },
        fail: function (err) {
            console.log(err)
        }
    })
},
```
这里既有自动定位，又有选择地址，所以需要判断地址的来源，以及向首页显示数据的传递，这里碰到一个数据传递的坑，后面会说。

### 搜索功能    
搜索功能基本是标配了，实现了模糊查询，界面用的是 `weui-searchbar`，这个我用模板把它封装起来了，因为小程序中有多次使用到

我的想法是，匹配 `keywords` 的每一个字符，找出匹配相似度最高的，最紧密的，显示在前列，想法很好，emmm
```js
const desc = new Set()
const keyWords = keyWords ? keyWords.split('') : []
temp.forEach(item => {
	keyWords.forEach(key => {
		let i = item.title.indexOf(key)
		if (i > -1) {
			desc.add(ele)
		}
	})
})
```
这里我用 `spilt()` 方法将字符串转换为数组以遍历，`indexOf()` 获取遍历结果，可以得到正确结果，但是没做优先级排序，其实使用正则去做或许 `match(`/\s\S*${key}\s\S*/`)`这样？有兴趣可以试试

### 购物车相关  
- 购物车的显示与隐藏        
`weui` 的 [actionsheet](https://weui.io/#actionsheet) 就是很好的容器，但它好像没有添加 scroll ，还是自己写一个原生的 `actionsheet` 吧
```html
<view class="weui-actionSheet {{clicked?'weui-actionsheet_toggle':''}}">
    <view class="cart-header">
        <icon class="total-select" type="{{selectAllStatus?'success':'circle'}}" bindtap="selectAll" />
        <text>{{selectAllStatus?'全选':'全不选'}}</text>
        <text class="cart-total-num"> (已选{{shopCar.length}}件)</text>
        <text class="clear_cart" catchtap="clearCart">清空购物车</text>
    </view>
    <scroll-view scroll-y style="width: 100%; height: 700rpx;">
        <view class="weui-actionSheet__menu" style="width: 100%;">
            <block wx:for="{{shopCar}}" wx:key="{{index}}">
                <view class="weui-actionsheet__cell cart-list">
                </view>
            </block>
        </view>
    </scroll-view>
</view>
```
```css
.weui-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6);
}
.weui-mask-on {
    display: block;
}
.weui-actionSheet {
    background-color: #fff;    
    position: fixed;
    bottom: 0;
    width: 100%; 
    max-height: 800rpx; 
    margin-bottom: 100rpx;
    z-index: 99; 
    transform: translateY(100%);
    transition: transform .3s;
    font-size: 32rpx;
    backface-visibility: hidden;
    /*定义当元素不面向屏幕时是否可见*/
}
.weui-actionsheet_toggle {
    transform: translate(0, 0);
    transition: transform .3s;
}
```
- 添加购物车    
添加购物车很简单，就是基于数据绑定的添加与移除，唯一看点就是那个掉落进购物车的小球，这是用了 微信 api 动画的 `createAnimation` 。

    这个api 是用来创建一个**动画实例`animation`**。调用实例的方法来描述动画。最后通过动画实例的`export`方法导出动画数据传递给组件的`animation`属性。了解详情可见 [小程序动画api](http://www.wxappclub.com/doc/1-45) 和三次贝塞尔曲线 [cubic-bezier](http://www.w3school.com.cn/cssref/pr_transition-timing-function.asp)
```js
runBall(e) {
	let bottomX = this.data.screenWidth,
	bottomY = this.data.screenHeight
	//实例化一个动画
	this.animationX = wx.createAnimation({
		duration: 1000, 
		timingFunction: 'linear',
		delay: 0,
	})
	this.animationY = wx.createAnimation({
		duration: 1000, 
		timingFunction: 'cubic-bezier(.93,-0.11,.85,.74)',
		delay: 0
	})
	// x, y表示手指点击横纵坐标, 即小球的起始坐标
	let ballX = e.detail.x,
		ballY = e.detail.y
		console.log(ballX, ballY)
		this.setData({
			ballX: ballX - 20,
			ballY,
			showBall: true
        })
	this.setDelayTime(10).then(() => {
		this.animationX.translateX(-ballX-ballY*0.5).step()
		this.animationY.translateY(bottomY).step()
		this.setData({
			animationX: this.animationX.export(),
			animationY: this.animationY.export()
		})
		// 400ms延时, 即小球的抛物线时长
		return this.setDelayTime(1000)
	}).then(() => {
		this.animationX.translateX(0).step()
		this.animationY.translateY(0).step()
		this.setData({
			showBall: false,
			animationX: this.animationX.export(),
			animationY: this.animationY.export()
		})
	})
},
setDelayTime(sec) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, sec)
	})
},
```
图中可见，这个动画效果还有一点小bug ，就是动画初始位置不是小球的初始位置，调了几次没调出来，等待修复
### 分类 tabbar
这个地方有一个要说的就是 `scroll-into-view`，它是一个像锚点一样的，通过动态改变`scroll-into-view`的值可以滚动到索引位置，非常实用。     
注意：
- 它是通过一个 `id` 属性定位的，必不可少，不然无法定位索引
- 如果你想让他回顶部 直接用scroll-top即可
```html
<scroll-view scroll-y class="category-left">
    <view class="cate-nav-list {{curIndex==index?'on':''}}" wx:for="{{cate_nav_list}}" wx:key="index" data-id="{{item.id}}" data-index="{{index}}"
                bindtap="switchCategory">
    </view>
</scroll-view>
<scroll-view class="category-right" scroll-y="{{true}}" scroll-into-view="{{toView}}" scroll-with-animation="true">
    <view class="cate-content">
        <block wx:for="{{detail}}" wx:key="{{item.id}}" id="{{item.id}}">
            <view class="cate-list" id="{{item.id}}"></view>
        </block>
    </view>
</scroll-view>
```
## 说好的踩坑
- 跳转页面失效
> 问题描述：在位置选择的时候，需要携带数据返回主页，尝试过 `navigateTo`、`navigateBack`、`redirectTo`、`switchTab`，不是无法跳转，就是无法携带数据。  

原因：小程序不允许打开超过5个层级的页面(原因见总结5)，`navigateBack` 无法直接携带数据，最后我使用`switchTab`返回主页，并将数据存储在 `app.globalData`中，解决问题。

- `scroll-view` 高度自适应
> 问题描述：在店铺内部菜单中有一个类似分类 tabbar 的功能，但并没有使用 `scroll-into-view`实现，问题是左右两个`scroll-view` 无法独立滚动，并且超出屏高撑出滚动条，这并不是我想要的。 

解决办法：使用 `flex` 布局， `scroll-view` 的容器设置 `flex: auto;` `overflow: auto;`

- `input` 标签 `value="{{value}}"` 传值无法触发 `bindinput` 事件
> 问题描述：value="{{value}}" 动态向中传值时，无法触发 `bindinput` 事件，并且两者会冲突，就像这样
```js
this.setData({
	search: {
		inputVal: value     // somedata
	}
})
console.log(this.data.value)    // undefined
```
解决办法：前面说过，我的 `searchbar` 是一个模板，这个模板传值需要嵌套一些东西，但其实我的数据不需要这样传递，可以直接绑定到view，这算是曲线救国了，没有从根本解决这个问题。

- 数据操纵
> 问题描述：这个小程序我使用的是本地的假数据，并没有通过easy-mock伪造数据，当然这不是重点，数据页面一多，json的嵌套也变得深了，不然就是多个数据的关联更深，这就给数据查找带来了不便。

解决：forEach、filter、map、set、indexOf、push、Array from、some、findIndex、unshift、promise、解构。。。感觉快学完一遍es6的数组方法了

- 一种子元素垂直居中方法
> 父容器下只有一个元素，且父元素设置了高度，则只需要使用相对定位即可
```css
.par {
    height: 200rpx;
}
.child {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
```

## 最后小程序的总结
如果你看到这里，说明你在小程序方面的学习阶段和我差不多，我就总结几个要点来提醒我们和后来者：    
1. 前端 `wxapp` 开发与以往 `web` 体系开发的不同是什么？是 `MVVM` ，是数据绑定，数据驱动界面。   

    实质是：通过数据传输接口（注册Page时的data属性及后续的setData方法调用）将逻辑层的数据传输给视图层。视图层由WXML语言编写的模板通过“数据绑定”与逻辑层传输过来的数据merge成展现结果并展现。

2. 使用 MVVM 框架开发，我们首先关注的不是 `DOM` 结构，而是关心数据如何存储。数据的存储方式是 `JavaScript` 对象，或者说 `json` 对象。

4. 一个 `wxapp` 应用程序就是一个单页面应用，所有的页面渲染和事件处理，都在一个页面内进行。

5. 小程序的UI视图和逻辑处理是用多个`webview`实现的，逻辑处理的JS代码全部加载到一个`Webview`里面，而所有的视图（wxml和wxss）都是单独的`Webview`来承载，所以一个小程序打开至少就会有2个webview进程，考虑到性能消耗，小程序不允许打开超过5个层级的页面，当然同是也是为了体验更好。

6. 可以尝试新的框架开发，wepy、mpvue等正在学习中