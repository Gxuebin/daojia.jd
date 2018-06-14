// pages/search/search.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hotItems: [
			'蛋糕', '西红柿', '酸菜', '满天星', '维生素', '感冒', '辣椒', '火锅底料', '黄体酮', '百合', '鸡蛋', '百香果'
		],
		history_record: [],
		search: {
			placeholder: '搜索附近的商家商品',
			hasItems: false
		},
		hasItems: false
		
	},
	clearInput: function () {
		this.setData({
			search: {
				inputVal: ""
			},
			hasItems: false,
		});
	},
	inputTyping: function (e) {
		this.setData({
			search: {
				inputVal: e.detail.value
			},
			input: e.detail.value,
			isInput: true
		})
		// this.searchItem(e.detail.value)
		this.showKeyList(e.detail.value)
	},
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
		console.log(keyList)
		this.setData({
			hasItems: true,
			search: {
				keyList,
				hasItems: true,
			}
		})
	},
	searchItem(keyWords) {
		const goods = app.globalData.details
		const shops = app.globalData.shopInfo
		let temp = []
		goods.forEach(item => {
			item.desc.forEach(ele => {
				temp.push(ele)
			})			
		})
		this.search(keyWords, temp)
		const list = []
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
			console.log(this.data.search.desc)
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
	search(keyWords, arr) {
		const cur = []
		const desc = new Set()
		const key = keyWords ? keyWords.split('') : []
		console.log(key)
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
		console.log(this.data.search.desc)
	},
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
	showAll() {
		const shops = app.globalData.shopInfo
		this.setData({
			hasItems: true,
			search: {
				resList: shops,
				hasItems: true,
			},
		})
	},
	doSearch() {
		if (!this.data.search.resList || this.data.search.resList.length<0) {
			this.showAll()
		}
		const history = wx.getStorageSync('history')
		let rec = this.data.input	
		this.searchItem(rec)
		wx.setStorageSync('history', [rec, ...history])
		this.setData({
			history_record: [rec, ...history]
		})
	},
	clear_history() {
		wx.setStorageSync('history', [])
		this.setData({
			history_record: []
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			search: {
				inputVal: options.keyWord
			}
		})
		this.searchItem(options.keyWord)
		wx.setNavigationBarTitle({
			title: '搜索'
		})
		const history = wx.getStorageSync('history')
		this.setData({
			history_record: history
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