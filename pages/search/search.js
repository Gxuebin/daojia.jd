// pages/search/search.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hotItems: [
			'蛋糕', '阿莫西林', '酸菜', '满天星', '维生素', '感冒', '辣椒', '火锅底料', '黄体酮', '百合', '鸡蛋', '百香果'
		],
		history_record: [],
		search: {
			placeholder: '搜索附近的商家商品',
			inputVal: "",
		},
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
	add_search(e) {
		console.log(e)
		const index = e.currentTarget.dataset.index
		console.log(index)
		const hotItems = this.data.hotItems
		const item = hotItems[index]
		this.setData({
			search: {
				inputVal: item
			},
		})
	},
	DoSearch() {
		this.setData({
			history_record: [this.data.search.inputVal, ...this.data.history_record]
		})
	},
	clear_history() {
		this.setData({
			history_record: []
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '搜索'
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