// pages/pay/pay.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		radioItems: [{
				name: '微信支付',
				icon: 'https://static-o2o.360buyimg.com/daojia/new/images/cashier/icon_wechat.png',
				value: '0',
				checked: true
			},
			{
				name: '打白条',
				value: '1',
				icon: 'https://storage.360buyimg.com/payment-assets/sdk/icon/BAITIAO_2.0.png',
			},
			{
				name: '京东支付',
				icon: 'https://static-o2o.360buyimg.com/daojia/new/images/cashier/icon_jdpay.png',
				value: '2'
			},
			{
				name: '银行卡支付',
				value: '3',
				icon: 'https://storage.360buyimg.com/payment-assets/sdk/bank/BANKCARD1.png'
			}
		],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const price = options.price
		const shopName = options.shopName
		this.setData({
			price,
			shopName
		})
		this.countDown()
	},
	radioChange: function (e) {
		var radioItems = this.data.radioItems;
		for (var i = 0, len = radioItems.length; i < len; ++i) {
			radioItems[i].checked = radioItems[i].value == e.detail.value;
		}
		this.setData({
			radioItems: radioItems
		});
	},
	countDown() {
		let minutes = '30',
			seconds = '00'
		this.setData({       
			minutes,
			seconds
		})
		let m = 29
		let s = 60
		var timer = setInterval(() => {
			let flag = 0
			s--
			if (s < 0) {
				flag = 1
				s = 59
			}
			if (flag == 1) {
				flag = 0
				m--
			}
			if (s<10) {
				s = `0${s}`
			}
			if (m == 0 && s == 0) {
				clearInterval(timer)
				wx.showToast({
					title: '支付超时已取消订单',
					duration: 1000
				})
				wx.navigateBack({
					delta: 1
				})
			}
			this.setData({       
				minutes: m,
				seconds: s
			})
		}, 1000)
	},
	confirmPay() {
		wx.showToast({
			title: '支付成功',
			duration: 1000
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