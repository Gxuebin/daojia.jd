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
		car_status: ''

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
		// console.log(followed)
		const shopList = app.globalData.shopInfo
		shopList.forEach(item => {
			if (item.id == id) {
				item.followed = !followed
				// console.log(item.followed)
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
		// console.log(menuTitle)
		// return
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

		let num = 0, myCart

		const preCart = wx.getStorageSync('myCart')
		if (!preCart) {
			goods[0].num = '1'
			goods[0].selected = true

			let temp = {
				id: shop_id,
				list: goods
			}
			// console.log(temp)
			// return
			wx.setStorage({
				key: 'myCart',
				data: [temp, ...preCart]
			})
			console.log('1')
			this.setData({
				shopCar: [temp, ...preCart],
			})
			// return
		} else {
			try {
				preCart.forEach((item, index) => {
					let flag

					if (item.id == shop_id) {		// 是否从该店铺添加过
						console.log(item.list)
						try {
							item.list.forEach(ele => {
								flag = 2
								// console.log(ele)

								if (ele.id == goods[0].id) { 		// 是否存在相同商品
									console.log('if')
									ele.num++
									ele.selected = true
									ele.shop_id = shop_id
									this.addCount(ele.id)
									// return
									// console.log(preCart)
									wx.setStorage({
										key: 'myCart',
										data: preCart
									})
									console.log('2')
									this.setData({
										shopCar: preCart,
										// shopCar: this.data.shopCar
									})
									flag = 1
									// console.log()
									foreach.break = new Error("StopIteration")
								}
							})
						} catch (error) {
							console.log('out of forEach')
						}

						if (flag == 2) {
							goods[0].num = '1'
							goods[0].selected = true
							item.list = [goods[0], ...item.list]
							preCart[index] = item
							// console.log(preCart)
							wx.setStorage({
								key: 'myCart',
								data: preCart
							})
							console.log('3')
							// console.log(myCart)
							this.setData({
								shopCar: preCart,
							})
							foreach.break = new Error("StopIteration")
						}
					} else {
						goods[0].num = '1'
						goods[0].selected = true

						let temp = {
							id: shop_id,
							list: goods
						}
						wx.setStorage({
							key: 'myCart',
							data: [temp, ...preCart]
						})
						console.log('1')
						this.setData({
							shopCar: [temp, ...preCart],
							// shopCar: this.data.shopCar
						})
					}

				})
			} catch (error) {
				console.log('用于跳出forEach')
			}
		}

		this.setData({
			selectAllStatus: true
		})

		this.getTotalPrice()
		console.log('4')

	},

	hasCarList() {
		const shopCar = wx.getStorageSync('myCart')
		// console.log(shopCar)

		if (shopCar) {
			let myCart
			shopCar.forEach(item => {
				console.log(item)
				if (item.id == this.data.shop_id) {
					console.log(item.list)
					myCart = item.list
				}
			})
			console.log(myCart)
			this.setData({
				shopCar: myCart
			})
		}
		// console.log(this.data.shopCar)
	},

	getTotalPrice() {
		const carts = this.data.shopCar ? this.data.shopCar : []
		let total = 0
		
		console.log(carts)
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
		console.log()
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
		// console.log(index)
		const carts = this.data.shopCar
		console.log(carts)
		let selected = carts[index].selected
		carts[index].selected = !selected
		// console.log(carts[index].selected)
		this.setData({
			shopCar: carts
		})
		// console.log(this.data.shopCar)
		// console.log(this.isAllSelected())
		let selectAllStatus = this.isAllSelected() ? true : false
		// console.log(selectAllStatus)
		this.setData({
			selectAllStatus,
		})
		this.getTotalPrice()

	},
	cleaCart() {
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

	onLoad: function (options) {
		const id = options.id
		console.log(id)
		this.load(id)
		this.hasCarList()

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