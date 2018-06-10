// pages/shopCar/shopCar.js
const app = getApp()

Page({

	data: {

	},
	getLocation() {
		
		this.setData({
			location: '广兰大道418号东华理工大学(南昌校区)'
		})
	},

	getShopCar() {
		const shopList = app.globalData.shopInfo
		const myCart = wx.getStorageSync('myCart') ?wx.getStorageSync('myCart') : []
		myCart.forEach(item => {
			shopList.forEach(ele => {
				if (item.id == ele.id) {
					item.name = ele.name
				}
			})
		});
		this.setData({
			shopCar: myCart
		})
	},
	navToMain() {
		wx.switchTab({ 
			url: '../index/index'
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '购物车'
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getLocation()
		this.getShopCar()
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