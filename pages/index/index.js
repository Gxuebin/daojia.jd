//index.js
//获取应用实例
const app = getApp()
// console.log(app.globalData)

Page({
  data: {
    cateBarLists: [],
    shopInfo: [],
    stars: [],
    hasMoreActivity: false,
  },
  onLoad() {
    this.showStars()
    this.showActivities()
  },
  onShow() {  
    this.setData({
      cateBarLists: app.globalData.cateBarLists,
      shopInfo: app.globalData.shopInfo
    })
  },
  showStars() {
    const shoplist = app.globalData.shopInfo

    shoplist.forEach((list, id) => {
      
      shoplist[id].star_on = Math.floor(Number(list.star ? list.star : '0'))
      shoplist[id].star_half = Math.floor(Number(list.star*10%10 == 0 ? '0' : '1'))
      shoplist[id].star_off = Math.floor(Number(shoplist[id].star_half == 0 ? 5 - shoplist[id].star_on : 4 - shoplist[id].star_on))

    })

    this.setData({
      shopInfo: shoplist
    })

  },
  showActivities() {
    const shopInfo = app.globalData.shopInfo
    shopInfo.forEach((list, index) => {
      if (JSON.stringify(list.activities)=='{}') list.noactivity = true
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
})
