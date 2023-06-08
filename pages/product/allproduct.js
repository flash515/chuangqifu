const app = getApp()
const track = require("../../utils/track");
Page({
  data: {
    currentTab:0,
    key1: 0,
    // 计算屏幕滚动窗口的高度
    windowH: "",
    url: "",
    sortarray: [],
    array: [],

    // 轮播参数
    image: [],
  },
  bvSortChange(e) {
    console.log(e.currentTarget.dataset.name)
    console.log(e.currentTarget.dataset.index)
    track.startByClick(e.currentTarget.dataset.name)
    this.setData({
      currentTab: e.currentTarget.dataset.index,   //按钮CSS变化
    })
    var category = e.currentTarget.dataset.name
    this._setarray(category)
    console.log(category)
  },
  _setarray(category) {
    console.log(category)
    for (let i = 0; i < this.data.sortarray.length; i++) {
      if (this.data.sortarray[i].Category1Name == category) {
        this.setData({
          array: this.data.sortarray[i].Category2Array
        })
      }
    }
    console.log(this.data.array)

  },
  bvTagClick(e){
    console.log(e.currentTarget.dataset.name)
    track.startByClick(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: "../product/productview?"+"category3=" + e.currentTarget.dataset.name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      windowH: (app.globalData.Gsysteminfo.windowHeight - 100) * 750 / app.globalData.Gsysteminfo.windowWidth
    })

    //获取小程序全局设置
    let that = this
    const db = wx.cloud.database()
    db.collection('setting')
      .where({
        CurrentStatus: "effect"
      })
      .get({
        success: res => {
          app.globalData.Gsortarray = res.data[0].ProductSort;
          that.setData({
            sortarray: res.data[0].ProductSort
          })
          var category = res.data[0].ProductSort[0].Category1Name
          that._setarray(category)
          console.log(category)
          console.log(that.data.sortarray)
        }
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
  // 点击 tab 时用此方法触发埋点
  onTabItemTap: () => track.startToTrack(),
  handlerClick(e) {track.startByClick(e.currentTarget.id);},

  onShow: function () {
    track.startToTrack()
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
    track.startByBack()
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

})