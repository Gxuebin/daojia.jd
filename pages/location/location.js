// pages/location/location.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    src: "",
    search: {
      placeholder: '搜索地点',
      inputVal: "",
    },
  },

  onLoad: function (options) {
    if (options.page) {
      this.setData({
        page: 1
      })
    }
    wx.setNavigationBarTitle({
      title: '获取当前位置'
    })
    this.getAddress()
  },
  chooseLocation() {
    this.moveToLocation();
  },

  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        //选择地点之后返回到首页
        wx.switchTab({
          url: '/pages/index/index'
        })

        that.setData({
          address: res.address + res.name
        })

        app.globalData.address = res.address + res.name
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // 选择地址
  setLocation(e) {
    app.globalData.address = e.currentTarget.dataset.addr
    wx.navigateBack({
      delta: 1
    })
  },
  // 新建地址
  newAddress() {
    wx.navigateTo({
      url: '../address/address?title=新建地址'
    })
  },
  // 修改地址
  alterAddress(e) {
    const receiver = e.currentTarget.dataset.receiver
    let name = receiver.receiver,
        telephone = receiver.telephone,
        address = receiver.area,
        building = receiver.building
    wx.navigateTo({
      url: `../address/address?title=修改地址&name=${name}&telephone=${telephone}&address=${address}&building=${building}`
    })
  },
  getAddress() {
    const addrList = wx.getStorageSync('myAddress')
    console.log(addrList)
    this.setData({
      addrList,
    })
  },
  onShow() {
    this.getAddress()
  },
})