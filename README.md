# 618 京东到家-小程序也狂欢
> 618 将至，学了这么久小程序，也该自己动手实践一下。最近实现了一个京东到家小程序，我将其中比较有意思，而且常用到的功能做一个展示，大家可以参考参考，完整项目在这里 [github.daojia.jd](https://github.com/tanglintang/daojia.jd)

**本文的实现**
- 小球落入购物车的抛物线动画-createAnimation
- 跳动的小红点-badge
- 购物车的显示和隐藏-actionsheet
- 获取详细地理位置
- 模糊查询

> 参考文档：[w3c小程序文档](https://www.w3cschool.cn/weixinapp/)、[小程序实战指南](http://www.wxappclub.com/book/1)、[weui.wxml](https://github.com/Tencent/weui-wxss/tree/master/dist/example)


## 小球落入购物车的抛物线动画
![图](http://pa5a5whqq.bkt.clouddn.com/shopcart.gif)
实现思路：
创造一个小球，给它一个运动轨迹，最后落入购物车区域。

如果是 DOM 编程，自然是获取点击的位置，用 createElement 创建一个元素，定时器给它一个动态的坐标，让它运动起来，但这并不是 DOM ，而是小程序，使用的是数据绑定。

那这就更好了，只要数据改变，状态就会相应的改变，那我们赶快给它实现坐标的动态输入吧。如果你真的就这样开始做了，那你就会陷入和我之前一样的困境，小球运动的初始位置不是固定的，你想要让它在任何位置都能圆润地滚到购物车，就需要用一个算法，实现这条抛物线。

有聪明的小伙伴可能就想到了贝塞尔曲线，是的这样确实可行，但对与我这样的数学“天才”来说，正余弦什么的还是不了不了，打扰了，告辞。

我就想有什么更简单的方式，能够动态的添加抛物线动画呢，这时我上百度Google到了一个 api `createAnimation` ，就决定是你了。

这是 [wx.createAnimation](https://www.w3cschool.cn/weixinapp/tcga1qcz.html) 的官方文档，简单来说就是，它会创建一个动画实例，这个实例可以描述你想要的动画，并通过页面的 `animation` 属性绑定动画。

那就开始了

- 先在页面文件(也就是你的wxml)写个 view 来装载动画：
```html
<view animation="{{animationY}}" style="position:fixed;top:{{ballY}}px;" hidden="{{!showBall}}">
    <view class="ball" animation="{{animationX}}" style="position:fixed;left:{{ballX}}px;"></view>
</view>
```
外层 view 实现 x轴运动，内层 view 实现 纵轴y运动。
ballX，ballY是它的(坐标)位置，就是以屏幕左上为原点的坐标轴。

- js 文件实现动画的创建和填装
小球在x轴匀速运动，在y轴以三次贝塞尔曲线规定的加速运动，实现抛物线落入购物车
```js
runBall(e) {
    // 从全局获取屏幕高度和宽度
	let bottomX = this.data.screenWidth,
	bottomY = this.data.screenHeight
	// x, y表示手指点击横纵坐标, 即小球的起始坐标
	let ballX = e.detail.x,
	ballY = e.detail.y
	this.setData({
		ballX: ballX-10,
		ballY,
		showBall: false,
		jump: false
    })
    //实例化动画
	this.animationX = wx.createAnimation({
		duration: 1000, 
		timingFunction: 'linear',
	})
	this.animationY = wx.createAnimation({
		duration: 1000, 
		timingFunction: 'cubic-bezier(.93,-0.11,.85,.74)',
    })
    // 第一段动画，向上运动一点
	this.setDelayTime(10).then(() => {
		this.animationX.translateX(-100).step()
		this.animationY.translateY(-10).step()
		this.setData({
			animationX: this.animationX.export(),
			animationY: this.animationY.export()
		})
		return this.setDelayTime(200);
	}).then(() => {
        // 第二段动画，落入购物车
		this.setData({
			showBall: true
        })
        // 平移距离是根据我的元素位置，其他需要自行调整
		this.animationX.translateX(-ballX-ballY*0.5).step()
		this.animationY.translateY(bottomY).step()
		this.setData({
			animationX: this.animationX.export(),
			animationY: this.animationY.export()
		})
		return this.setDelayTime(1000);
	}).then(() => {
        // 重置动画，回到原点
		this.animationX.translateX(0).step()
		this.animationY.translateY(0).step()
		this.setData({
			showBall: false,
			animationX: this.animationX.export(),
			animationY: this.animationY.export()
		})
	})
},
// 同步操作，传入定时器时间，
setDelayTime(second) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, second)
	})
},
```
```css
.ball {
    width: 40rpx;
    height: 40rpx;
    background-color: #4DCC57;
    border-radius: 50%;
    z-index: 999;
}
```
这段js做的事情：
1. 获取屏幕高度和宽度
2. 获取点击位置，我这里就是加入购物车的那个加号，也可以是点击商品位置，不同需求就不同。
3. 实例化动画 animationX、animationY
4. 为这个实例添加动画，我这里有几段动画，为了实现小球先向上运动一点距离，再向下，做抛物线运动。还有一个目的就是隐藏这一段，你可以看到 showBall 有不同状态，因为运动并没有从我的初始位置开始，这里有bug
5. 最后回到原点并隐藏小球

关于 `wx.createAnimation` api 的使用，`实例.运动方式.step()`，`step`分隔动画，`export()` 导出动画，`timingFunction` 规定运动速度效果，详细可见文档。

Promise 是异步编程的一种解决方案，比传统的解决方案–回调函数和事件－－更合理和更强大。这里只需要知道，可以让这几段动画分步执行的就行。详细见[廖雪峰Promise](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000)

另外，有一个小彩蛋就是，显示数量的小红点，在每次小球落入购物车的时候跳一下，以提醒用户。是这样实现的：算了，见下一段

## 跳动的小红点
这个小红点是用 `weui` 的 `badge` 效果，关于`badge`详情见官方文档：[weui.wxml](https://github.com/Tencent/weui-wxss/blob/master/dist/example/badge/badge.wxml)      
```html
<view class="weui-badge {{jump?'badgeJump':''}}" style="position: absolute; display: {{shopCar.length==0?'none':''}}">{{shopCar.length}}</view>
```
动态添加类名，jump 决定是否使用 badgeJump 类。
```js
this.runBall(e)
this.setDelayTime(1000).then(() => {
	this.hasCarList()
	this.getTotalPrice()
	this.setData({
		jump: true
	})
})
```
```css
.badgeJump {
    animation: jump 500ms;
}
@keyframes jump {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-50rpx);
    }
    100% {
        transform: translateY(0);
    }
}
```
同样是在调用 runBall 方法的事件中，先调用runBall方法，在小球下落时间结束之后再将值传入，这样页面的效果跟着小球的下落在改变，最后小红点调皮地跳动一下，提示用户有新商品加入购物车啦。

## 购物车的显示和隐藏
想要实现的是点击一下购物车图标，从下而上弹出一个菜单，显示已添加进购物车的物品。可以用 weui actionsheet 实现，没错又是 weui。但是我想要的是一个滚动区域而不是固定的，所以还是自己写一个类似原生actionsheet 的吧，还可以练手。
1. 购物车和遮罩的结构
> 首先要确定的是，整个页面就是一屏大小，页面不能撑出滚动条，但内部可以有滚动区域。遮罩就是整个屏幕的大小，购物车区域可以自行设定一个高度，给它一个固定定位，初始位置是在整个屏幕的下面，并不显示在可视区，当用户点击购物车图标时，从下方弹出来，单击遮罩区域，缩回去回去并隐藏。来看代码是怎么实现的：
```html
<!-- 遮罩区域 类名控制隐藏与否 -->
<view class="{{clicked?'weui-mask':'weui-mask-on'}}" catchtap="hideMask"></view>
<!-- 购物车区域 -->
<view class="weui-actionSheet {{clicked?'weui-actionsheet_toggle':''}}">
    <view class="cart-header">
        <icon class="total-select" type="{{selectAllStatus?'success':'circle'}}" color="#4DCC57" bindtap="selectAll" />
        <text>{{selectAllStatus?'全选':'全不选'}}</text>
        <text class="cart-total-num"> (已选{{shopCar.length}}件)</text>
        <text class="clear_cart" catchtap="clearCart">清空购物车</text>
    </view>
    <!-- 加入购物车的商品列表 -->
    <scroll-view scroll-y style="width: 100%; height: 700rpx;">
    </scroll-view>
</view>
```
```html
<!-- 底部购物车图标区域 -->
<view class="cart" style="margin-top: 0;">
    <view class="shop_ft" style="z-index: -999;">
        <view class="weui-cell shop_car">
            <view class="weui-cell__hd {{shopCar.length==0?'car-icon_empty':'car-icon_fill'}}" catchtap="{{shopCar.length==0?'':'showCart'}}">
                <view class="weui-badge {{jump?'badgeJump':''}}" style="position: absolute; display: {{shopCar.length==0?'none':''}}">{{shopCar.length}}</view>
            </view>
            <view class="weui-cell__bd car_status" style="{{shopCar.length==0?'':'color: red;'}}">
                <text>{{shopCar.length==0?'购物车是空的':car_status}}</text>
            </view>
        </view>
        <view class="weui-cell__ft pay" style="{{shopCar.length==0?'':'background: #4DCC57'}}" catchtap="submitOrder">
            <text>去结算</text>
        </view>
    </view>
</view>
```
2. 样式
```css
/* 遮罩层 */
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
/* 购物车 actionsheet */
.weui-actionSheet {
    background-color: #fff;    
    position: fixed;
    bottom: 0;
    width: 100%; 
    max-height: 800rpx; 
    margin-bottom: 100rpx;
    z-index: 99; 
    /* 事先隐藏才下方 */
    transform: translateY(100%);
    transition: transform .3s;
    font-size: 32rpx;
    backface-visibility: hidden;
    /*定义当元素不面向屏幕时是否可见*/
}
/* 回到原位显示出来 */
.weui-actionsheet_toggle {
    transform: translate(0, 0);
    transition: transform .3s;
}
```
3. js 控制显示与隐藏
```js
hideMask() {
	this.setData({
		clicked: false
	})
},
//  点击购物车的触发事件
showCart() {
	const shopCar = wx.getStorageSync('myCart')
	shopCar.forEach(item => {
		if (item.id == this.data.shop_id) {
			myCart = item.list
		}
	})
	this.setData({
        // 购物车和遮罩的显隐
	    clicked: !this.data.clicked,
		shopCar: myCart
	})
	this.getTotalPrice()
},
```
这个功能的难点应该是样式，是整个页面高度的控制和购物车区域的定位，这里还有一个`scroll-view`高度自适应的方法，可以试一试，   
flex 布局 、scroll-view的容器设置  flex: auto; overflow: auto; 

## 获取详细地理位置
![](http://pa5a5whqq.bkt.clouddn.com/position.gif)
开始做这个功能的时候，第一个想法是，这种东西肯定是有api支持的，翻文档去。
果然有：`wx.getLocation(OBJECT)`，nice，那不就OK了吗？你们哪，还是 naive，too young，too simple。仔细看，该方法只是返回的位置坐标等信息，并未返回地理位置名称。

[腾讯位置服务](http://lbs.qq.com/qqmap_wx_jssdk/index.html) 提供的接口 SDK 可以解决问题。怎么弄官方文档已经写的很清楚了，接下来就看看我是怎么应用的

首先，按照文档申请秘钥，并下载 SDK，下载完成后，将文件解压到 utils 文件夹，这里有两个文件，压缩和不压缩的，建议压缩的。

然后，在需要获取位置的文件中引入
```js
const QQMapWX = require('../../utils/qqmap-wx-jssdk')
const qqmapsdk
```
接下来就可以使用SDK获取详细位置了，如下
```html
<view class="location">
	<navigator class="par" hover-class="none" url="../location/location?page=1">
		<image src="../../assets/images/location.png"/>
        <!-- 显示地址 -->
		<text>{{address}}</text>
	</navigator>
</view>
```
index.js
```js
onLoad(options) {
    /*判断是第一次加载还是从position页面返回
    如果从position页面返回，会传递用户选择的地点*/
    if (app.globalData.address) {
        //设置变量 address 的值
        this.setData({
            address: app.globalData.address
        });
    } else {
      // 实例化API核心类
        qqmapsdk = new QQMapWX({
            //此key需要用户自己申请
            key: 'JF2BZ-DDH65-DCUIH-QU3TN-FT4UF-EEFEH'
        });
        var that = this
        // 调用接口
        qqmapsdk.reverseGeocoder({
            success: function (res) {
                that.setData({
                    address: res.result.address     // 详细地址
                })  
            },
            fail: function (res) {
            // console.log(res)
            },
            complete: function (res) {
            // console.log(res)
            }
        });
    }
},
```
我的需求是，在进入程序时，自动获取位置信息，并显示在页面，所以直接放置在 `onload` 里，`success` 的回调函数返回的 `res.result.address` 就是详细信息了.

而我这里另外做了一个判断，是因为我还提供了一个用户自主选择地址的功能，地址显示优先为用户自主选择的。有相同需求的小伙伴可以继续看下去。     
```html
<view class="weui-cells weui_cell__nav-chooseLocation" bindtap="chooseLocation" style="display: {{page==1?'':'none'}};">
    <view class="weui-cell">
        <view class="weui-cell__hd">
            <image src="http://static-o2o.360buyimg.com/daojia/new/images/icon/location-eye@2x.png" style="margin-right: 5px;vertical-align: top;width:20px; height: 20px;"></image>
        </view>
        <view class="weui-cell__bd">点击定位当前地点</view>
        <view class="weui-cell__ft weui-cell__ft_in-access"></view>
    </view>
</view>   
``` 
location.js
```js
//选择地点
chooseLocation: function () {
    wx.chooseLocation({
        success: res => {
            //选择地点之后返回到首页
            wx.switchTab({
                url: '/pages/index/index'
            })
            this.setData({
                address: res.address
            })
            // 设置全局变量
            app.globalData.address = res.address
        },
        fail: err => {
            console.log(err)
        }
    })
},
```
绑定的 catchtab 属性触发 `chooseLocation` 事件，`wx.chooseLocation` api 将直接返回当前位置，如果没有，检查是否开启定位。将位置存入全局变量，在返回首页之后可见，地址已改为用户选择的。

> 这里的页面跳转选择 `switchTab` 而不是常用的 `navigateTo` 或 `redirectTo`，是因为小程序为了性能消耗考虑，不允许打开超过 5 个的页面，返回主页 `tabbar` 使用 `switchTab` 是较好的选择，而通过设置全局变量 address 来传递地址信息，也正是在这种情况下，比较适用的传递数据的方法之一。

## 搜索-模糊查询
![](http://pa5a5whqq.bkt.clouddn.com/search.gif)

看起来这个查询有很多，比如关键字啊，热搜啊，历史记录查啊，但实际上用的都是同一个查询器，先来看看吧
1. 搜索页面布局
使用的是 `weui` 的 `searchbar` ，简单实用
```html
<view class="weui-search-bar">
    <view class="weui-search-bar__form">
        <view class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="{{placeholder}}" value="{{inputVal}}" bindinput="inputTyping" />
            <view class="weui-icon-clear" wx:if="{{hasItems}}" bindtap="clearInput">
                <icon type="clear" size="14"></icon>
            </view>
        </view>
    </view>
    <view class="weui-search-bar__btn">
        <text class="weui-search-bar__text" catchtap="doSearch">搜索</text>
    </view>
</view>
```
2. 使用 `bindinput="inputTyping"` ，它可以监测你的每一次输入，并通过 `e.detail.value` 向你反馈出来，我们可以以此获得关键字。
```js
inputTyping: function (e) {
	this.setData({
		search: {
			inputVal: e.detail.value        // 由于我的搜索是使用模板建立的，数据传递需要嵌套一下
	    },
	    input: e.detail.value,
    })
    this.showKeyList(e.detail.value)
},
```
3. `weui-searchbar` 自带清空搜索框，挺方便，接拿来用。
```js
clearInput: function () {
	this.setData({
		search: {
			inputVal: ""
		},
	})
},
```
4. 接下来就是对关键字的处理     
将关键字字符串用 `split` 方法，分割为字符串数组，在关键字列表中查询每一个关键字符，使用 `indexOf` 方法检索，如果存在这样一个字符，就返回这个字符的下标，如果没有将返回 `-1`，最后将检索结果放入数组中，这就是在搜索框下部显示的关键字列表了。
```js
showKeyList(keyWords) {
	const key = keyWords ? keyWords.split('') : []
	const keyListAll = app.globalData.keyList
	const keyList = []
	keyListAll.forEach(item => {
		key.forEach(k => {
			let i = item.indexOf(k)
			if (i > -1) {
				keyList.push(item)
			}
		})
    })
	this.setData({
		search: {
			keyList,    // 查询结果将在页面显示
		}
    })
},
```
5. 既然有了关键字，那么就可以查询数据
在这里，我也是使用如上方法，分割字符串，依次查询，并且将这个方法封装成一个函数，只需传入要检索的关键词和目标数组，就可以在任何地方调用它进行查询。
```js
// 关键字查询
search(keyWords, arr) {
	const cur = []
	const desc = new Set()      // 使用 set 可以去重
	const key = keyWords ? keyWords.split('') : []
	arr.forEach(ele => {
		key.forEach(k => {
			let i = ele.title.indexOf(k)
			if (i > -1) {
				cur.push(ele.id)
				desc.add(ele)
			}
		})
	})
	this.setData({
		cur,
		search: {
		    desc: Array.from(desc)
		}
	})
},
// 数据查询
searchItem(keyWords) {
    const goods = app.globalData.details,
        shops = app.globalData.shopInfo,
        temp = [],
        list = []

	goods.forEach(item => {
		item.desc.forEach(ele => {
			temp.push(ele)
		})			
    })
    // 调用搜索
	this.search(keyWords, temp)
	shops.forEach(item => {
		this.data.cur.forEach(i => {
			if (item.goodslist.indexOf(i) > -1) {
				list.push(item)
			}
		})
	})
	var resList = Array.from(new Set([...list]))
	this.setData({
		search: {
			resList,
		    desc: this.data.search.desc,
		},
	})
	if (this.data.search.resList.length > 0) {
		this.setData({
			hasItems: true,
			search: {
				resList,
				desc: this.data.search.desc,
				hasItems: true,
			},
		})
	} else {
		this.setData({
			hasItems: false,
			search: {
				hasItems: false,
			},
		})
	}
},
```
6. 热搜查询和历史记录再次查询
马上就用到了刚才封装的方法了，
这是热搜和历史记录共用的查询方法，只需一步调用
```js
add_search(e) {
	const index = e.currentTarget.dataset.index
	this.setData({
		search: {
			inputVal: index,
		},
		input: index,
	})
	this.searchItem(index)
},
```
> 其实查询功能还可以精简很多，只是我的伪数据数组太多，需要联合查询，比较麻烦。感觉数据处理还是SQL语句方便多哈，多表查询，模糊查询。。。

## 以上
希望对大家有帮助