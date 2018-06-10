//index.js
//获取应用实例
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk;
const app = getApp()
// console.log(app.globalData)


Page({
  data: {
    cateBarLists: [],
    shopInfo: [],
    stars: [],
    hasMoreActivity: false,
    address: "",
    src: ""
  },
  onLoad(options) {
    this.showStars()
    this.showActivities()

    /*判断是第一次加载还是从position页面返回
    如果从position页面返回，会传递用户选择的地点*/
    // if (options.address != null && options.address != '') {
    if (app.globalData.address) {
      //设置变量 address 的值
      this.setData({
        address: app.globalData.address
      });
      console.log(this.data.address)
    } else {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        //此key需要用户自己申请
        key: 'JF2BZ-DDH65-DCUIH-QU3TN-FT4UF-EEFEH'
      });
      var that = this;
      // 调用接口
      qqmapsdk.reverseGeocoder({
        success: function (res) {
          that.setData({
            address: res.result.address
          })
        },
        fail: function (res) {
          //console.log(res);
        },
        complete: function (res) {
          //console.log(res);
        }
      });
    }
  },
  onShow() {
    if (app.globalData.address) {
      this.setData({
        address: app.globalData.address
      })
    }
    this.setData({
      cateBarLists: app.globalData.cateBarLists,
      shopInfo: app.globalData.shopInfo,
    })
  },
  showStars() {
    const shoplist = app.globalData.shopInfo

    shoplist.forEach((list, id) => {

      shoplist[id].star_on = Math.floor(Number(list.star ? list.star : '0'))
      shoplist[id].star_half = Math.floor(Number(list.star * 10 % 10 == 0 ? '0' : '1'))
      shoplist[id].star_off = Math.floor(Number(shoplist[id].star_half == 0 ? 5 - shoplist[id].star_on : 4 - shoplist[id].star_on))

    })

    this.setData({
      shopInfo: shoplist
    })

  },
  showActivities() {
    const shopInfo = app.globalData.shopInfo
    shopInfo.forEach((list, index) => {
      if (JSON.stringify(list.activities) == '{}') list.noactivity = true
    })
  },
  show_more(e) {
    const index = e.currentTarget.dataset.index
    const shopInfo = app.globalData.shopInfo

    shopInfo.forEach((list, id) => {
      if (list.id == index) {
        shopInfo[id].hasMoreActivity = !this.data.hasMoreActivity
      }
    })
    this.setData({
      shopInfo,
      hasMoreActivity: !this.data.hasMoreActivity
    })
  },
  switchCate(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../mainPageCate/cate?id=${id}`
    })
  },
})
