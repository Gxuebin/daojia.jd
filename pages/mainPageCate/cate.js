// pages/mainPageCate/cate.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options.id)
		this.setData({
			cate_id: options.id
		})
		this.switchKeyWords()
	},

	switchKeyWords() {
		const cate_id = this.data.cate_id
		switch (cate_id) {
			case '1':
				this.selectShop('market', 'fish')
				break;
			case '2':
				this.selectShop('food', 'fruit')
				break;
			case '3':
				this.selectShop('cake')
				break;
			case '4':
				this.selectShop('cake', 'flower')
				break;
			case '5':
				this.selectShop('medicine')
				break;
		}
	},

	selectShop(...data) {
		const temp = []
		const shopInfo = app.globalData.shopInfo
		for (const i in data) {
			shopInfo.forEach(item => {
				if (item.keyWords == data[i]) {
					temp.push(item)
				}
			})
		}
		this.setData({
			shopInfo: temp
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