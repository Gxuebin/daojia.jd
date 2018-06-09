// pages/category/category.js
const app = getApp()

Page({

	data: {
		search: {
			placeholder: '搜分类商品',
			inputVal: "",
		},
		cate_nav_list: [
			{ id: 'fruit', name: '水果蔬菜'},
			{ id: 'cake', name: '鲜花蛋糕'},
			{ id: 'meatDiet', name: '肉禽蛋奶'},
			{ id: 'fastFood', name: '冷热速食'},
			{ id: 'snacks', name: '休闲食品'},
			{ id: 'drink', name: '酒水饮料'},
			{ id: 'condiment', name: '粮油调味'},
			{ id: 'furnishing', name: '家居用品'},
			{ id: 'medical', name: '医药健康'},
		],
		curIndex: '0',
		title: '水果蔬菜'
	},
	switchCategory(e) {
		// console.log(e)
		let index = e.currentTarget.dataset.index
		let toView = e.currentTarget.dataset.id

		this.setData({
			curIndex: index,
			toView,
		})
		
	},
	showCate() {
		const cateList = app.globalData.categories
		// console.log(cateList)
		this.setData({
			detail: cateList,
			curIndex: '0',
		})
		console.log(this.data.detail)
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '分类'
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
		this.showCate()
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