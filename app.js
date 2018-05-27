import db from './assets/db'

App({
	onLaunch: function () {
		// 拷贝赋值
		Object.assign(this.globalData, db)
		// wx.request({
		// 	url: 'https://resources.ninghao.net/wxapp-case/db.json',
		// 	success: (response) => {
		// 		console.log(response)
		// 		//   赋值
		// 		Object.assign(this.globalData, response.data)
		// 		console.log(this.globalData)
		// 	},
		// 	fail: (error) => {
		// 		console.log(error)
		// 	}
		// })
	},
	globalData: {}
})