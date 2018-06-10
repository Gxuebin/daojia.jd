const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getStorage() {
    const myCart = wx.getStorageSync('myCart') ? wx.getStorageSync('myCart') : []
    this.setData({
      myCart,
    })
  },
  getshopCart() {
    const shop_id = this.data.shop_id
    let totalPrice = 0
    let curShopCart
    this.data.myCart.forEach(item => {
      if (item.id == shop_id) {
        curShopCart = item.list
      }
    })

    console.log(curShopCart)
    this.setData({
        shopCart: curShopCart
    })

    curShopCart.forEach(item => {
      totalPrice += item.cur_price*item.num
    })
    this.setData({
      totalPrice,
    })
  },
  getShopInfo() {
    const shopInfo = app.globalData.shopInfo
    const shop_id = this.data.shop_id
    shopInfo.forEach(item => {
      if (item.id == shop_id) {
        this.setData({
          shopName: item.name,
          deliver_method: item.deliver_method,
          deliver_price: item.deliverMsg.basePrice,
          conpon_price: 15,
          actual_price: (Number(this.data.totalPrice)+Number(item.deliverMsg.basePrice)-15).toFixed(2)
        })
      }
    })
    
  },
  toPay() {
    const price = this.data.actual_price
    const shopName = this.data.shopName
    wx.navigateTo({
      url: `../pay/pay?price=${price}&shopName=${shopName}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const shop_id = options.shop_id
    this.setData({
      shop_id,
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
    this.getStorage()
    this.getshopCart()
    this.getShopInfo()
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