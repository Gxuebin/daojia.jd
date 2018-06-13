// pages/innerShop/innerShop.js

const app = getApp()

Page({

	data: {
		shopInfo: [],
		search: {
			placeholder: '搜店内商品',
			inputVal: "",
		},
		menuList: [],
		clicked: false,
		totalNum: 0,

		curIndex: 0,
		toView: 'singleCoupon',
		shopCar: [],
		totalPrice: 0,
		car_status: '',
		showBall: false,

	},
	
	runBall(e) {
		console.log(e)
		let bottomX = this.data.screenWidth,
		bottomY = this.data.screenHeight
		//实例化一个动画
		this.animationX = wx.createAnimation({
			duration: 1000, 
			timingFunction: 'linear',
		})
		this.animationY = wx.createAnimation({
			duration: 1000, 
			timingFunction: 'cubic-bezier(.93,-0.11,.85,.74)',
		})
		let ballX = e.detail.x,
		ballY = e.detail.y
		console.log(ballX, ballY)
		this.setData({
			ballX: ballX-10,
			ballY,
			showBall: false,
			jump: false
		})
		// x, y表示手指点击横纵坐标, 即小球的起始坐标
		this.setDelayTime(10).then(() => {
			
			this.animationX.translateX(-100).step()
			this.animationY.translateY(-20).step()
			this.setData({
				animationX: this.animationX.export(),
				animationY: this.animationY.export()
			})
			return this.setDelayTime(200);
		}).then(() => {
			this.setData({
				showBall: true
			})
			this.animationX.translateX(-ballX-ballY*0.5).step()
			this.animationY.translateY(bottomY).step()
			this.setData({
				animationX: this.animationX.export(),
				animationY: this.animationY.export()
			})
			return this.setDelayTime(1000);
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

	clearInput: function () {
		this.setData({
			search: {
				inputVal: ""
			}
		});
	},
	inputTyping: function (e) {
		this.setData({
			search: {
				inputVal: e.detail.value
			},
		});
	},
	load(id) {
		let name
		const shopList = app.globalData.shopInfo
		const curShop = shopList.filter(item => {
			if (item.id == id) {
				name = item.name
				!item.followed ? item.followed = false : ''
				return item
			}
		})
		const menuList = app.globalData.menuList
		const curMenu = menuList.filter(item => {
			if (item.shop_id == id) {
				item.curIndex = 0
				return item
			}
		})
		console.log(curMenu)
		this.setData({
			shopInfo: curShop,
			menuList: { ...curMenu[0] },
			shop_id: id

		})
		wx.setNavigationBarTitle({
			title: name
		})
		console.log(this.data.menuList)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */

	followed(e) {
		const id = e.currentTarget.dataset.id
		const followed = this.data.shopInfo[0].followed
		if (!followed) {
			wx.showToast({
				title: '关注店铺成功',
				icon: 'success',
				duration: 1000
			})
		} else {
			wx.showToast({
				title: '取消关注',
				icon: 'success',
				duration: 1000
			})
		}
		const shopList = app.globalData.shopInfo
		shopList.forEach(item => {
			if (item.id == id) {
				item.followed = !followed
				return item
			}
		})
		this.load(id)
	},
	switchCategory(e) {
		console.log(e)
		let index = e.currentTarget.dataset.index ? e.currentTarget.dataset.index : 0
		console.log(index)
		const curList = this.data.menuList
		curList.curIndex = index
		let toView = e.currentTarget.dataset.id
		// console.log(toView)
		this.setData({
			menuList: curList,
			toView: toView ? toView : 'noView'
		})
		this.showDetails()
	},
	showCart() {
		const shopCar = wx.getStorageSync('myCart')
		let myCart
		shopCar.forEach(item => {
			if (item.id == this.data.shop_id) {
				console.log(item)
				myCart = item.list
			}
		})
		console.log(myCart)
		this.setData({
			clicked: !this.data.clicked,
			shopCar: myCart
		})

		this.getTotalPrice()
	},
	showDetails() {
		const temp = app.globalData.details
		// console.log(this.data.toView)
		const details = temp.filter(item => {
			if (item.id == this.data.toView) {
				return item
			}
		})
		this.setData({
			details,
		})
	},
	hideMask() {
		this.setData({
			clicked: false
		})
	},

	addCart(e) {
		const id = e.currentTarget.dataset.id
		const details = app.globalData.details
		const menuTitle = this.data.toView
		const shop_id = this.data.shop_id

		let temp = details.filter(item => {
			if (item.id == menuTitle) {
				return item
			}
		})
		const goods = temp[0].desc.filter((item, index) => {
			if (item.id == id) {
				return item
			}
		})

		const preCart = wx.getStorageSync('myCart')
		if (!preCart) {
			goods[0].num = '1'
			goods[0].selected = true
			let temp = {
				id: shop_id,
				list: goods
			}
			wx.setStorageSync('myCart', [temp])
		} else {
			let i = preCart.findIndex(item => item.id == shop_id)
			if (i > -1) {
				let j = preCart[i].list.findIndex(item => item.id == goods[0].id)
				if (j > -1) {
					let temp = preCart[i].list[j]
					temp.num++
					temp.selected = true
					wx.setStorageSync('myCart', preCart)
				} else {
					goods[0].num = '1'
					goods[0].selected = true
					preCart[i].list.push(goods[0])
					wx.setStorageSync('myCart', preCart)
				}
			} else {
				goods[0].num = '1'
				goods[0].selected = true
				let temp = {
					id: shop_id,
					list: goods
				}
				preCart.unshift(temp)
				wx.setStorageSync('myCart', preCart)
			}
		}
		this.runBall(e)
		this.setDelayTime(1000).then(() => {
			this.hasCarList()
			this.getTotalPrice()
			this.setData({
				jump: true
			})
		})
		
	},

	hasCarList() {
		let shopCar = wx.getStorageSync('myCart') 
		shopCar = shopCar ? shopCar : []

		if (shopCar) {
			let myCart
			shopCar.forEach(item => {
				if (item.id == this.data.shop_id) {
					myCart = item.list
				}
			})
			this.setData({
				shopCar: myCart
			})
		}
	},

	getTotalPrice() {
		const carts = this.data.shopCar ? this.data.shopCar : []
		let total = 0
		
		carts.forEach(item => {
			if (item.id == this.data.shop_id) {
				item.list.forEach(ele => {
					if (ele.selected) {
						total += ele.num * ele.cur_price
					}
				})
			}
		})
		for (let i = 0; i < carts.length; i++) {
			if (carts[i].selected) {
				total += carts[i].num * carts[i].cur_price
			}
		}
		this.setData({
			totalPrice: total.toFixed(2),
			car_status: `￥${total.toFixed(2)}`
		})
	},

	operateNum(index, operation) {
		const carts = this.data.shopCar
		// console.log(carts)
		carts.forEach((item, id) => {
			if (id == index) {
				if (operation === '+') {
					item.num++
				} else if (operation === '-') {
					item.num = item.num <= 1 ? 1 : item.num - 1
				}
			}
		})
		return carts
	},
	addCount(e) {
		// console.log(e)
		let index
		if (typeof (e) == 'string') {
			const temp = this.data.shopCar
			// console.log(temp)
			// return
			temp.forEach((item, id) => {
				if (item.id == this.data.shop_id) {
					item.list.forEach(ele => {
						index = ele.id == e ? id : ''
					})
				}
			})
		} else {
			index = e.currentTarget.dataset.index
		}

		const carts = this.operateNum(index, '+')
		
		this.setData({
			shopCar: carts,
		})
		this.getTotalPrice()
	},
	minusCount(e) {
		const index = e.currentTarget.dataset.index
		const carts = this.operateNum(index, '-')

		this.setData({
			shopCar: carts,
		})
		this.getTotalPrice()
	},
	selectAll() {
		let selectAllStatus = this.data.selectAllStatus
		const carts = this.data.shopCar
		selectAllStatus = !selectAllStatus

		for (let i = 0; i < carts.length; i++) {
			carts[i].selected = selectAllStatus
		}

		this.setData({
			shopCar: carts,
			selectAllStatus,
		})
		this.getTotalPrice()
	},
	isAllSelected() {
		const carts = this.data.shopCar
		var flag = true
		for (let i = 0; i < carts.length; i++) {
			if (!carts[i].selected) {
				flag = false
			}
		}
		return flag
	},
	selectList(e) {
		const index = e.currentTarget.dataset.index
		const carts = this.data.shopCar
		let selected = carts[index].selected
		carts[index].selected = !selected
		this.setData({
			shopCar: carts
		})
		let selectAllStatus = this.isAllSelected() ? true : false
		this.setData({
			selectAllStatus,
		})
		this.getTotalPrice()

	},
	clearCart() {
		wx.showModal({
			title: '提示',
			content: '确定要清空购物车吗？？？',
			success: res => {
				if (res.confirm) {
					wx.clearStorageSync()
					this.setData({
						clicked: false,
						shopCar: []
					})
				} else if (res.cancel) {
					console.log('取消')
				}
			}
		})

	},
	checkCart() {
		const carts = this.data.shopCar
		let arr = []
		console.log(carts)
		carts.forEach((item, index) => {
			if (!item.selected) {
				arr.push(item.id)
			}
		})
		console.log(...arr)
		for (const i of arr) {
			this.selectCart(i)
		}
	},
	selectCart(id) {
		const shopCar = wx.getStorageSync('myCart')
		const shop_id = this.data.shop_id
		shopCar.forEach(item => {
			if (item.id == shop_id) {
				console.log(item.list)
				item.list.forEach((ele, index) => {
					if (ele.id == id) {
						item.list.splice(index, 1)
					}
				})
			}
		})
		console.log(shopCar)
		wx.setStorage({
			key: 'myCart',
			data: shopCar
		})
	},
	submitOrder() {
		this.checkCart()
		const shop_id = this.data.shop_id
		wx.navigateTo({
			url: `../submitOrder/submitOrder?shop_id=${shop_id}`
		})
	},

	onLoad: function (options) {
		const id = options.id
		console.log(id)
		this.load(id)
		this.hasCarList()
		wx.getSystemInfo({
			success: res => {
				this.setData({
					screenWidth: res.windowWidth,
					screenHeight: res.windowHeight
				}) 
			}
		})
	},
	

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function (options) {
		// const id = '1'

		this.hasCarList()
		this.showDetails()
		this.getTotalPrice()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})