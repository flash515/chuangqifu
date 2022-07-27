const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    orderhistory: [],
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  bvRefresh(e) {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: e.currentTarget.dataset.name,
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        if (e.currentTarget.dataset.name == "PAYMENT") {
          this.setData({
            paymenthistory: res.result.data
          })
        } else if (e.currentTarget.dataset.name == "REWARD") {
          this.setData({
            rewardhistory: res.result.data
          })
        }
      }
    })
  },
  bvToPay(e) {
    wx.navigateTo({
      url: '../order/pay?totalfee=' + e.currentTarget.dataset.totalfee + '&productname=' + e.currentTarget.dataset.productname + '&paymentid=' + e.currentTarget.dataset.paymentid+'&database='+e.currentTarget.dataset.database
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的订单,数据库已做权限设置，用户只能查询本人订单
    db.collection('PAYMENT').get({
      success: res => {
        console.log(res);
        wx.setStorageSync('LPaymentList', res.data);
        this.setData({
          // 列表渲染
          paymenthistory: res.data
        })
        console.log(this.data.paymenthistory);
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
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PAYMENT",
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        this.setData({
          paymenthistory: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "REWARD",
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        this.setData({
          rewardhistory: res.result.data
        })
      }
    })
    wx.stopPullDownRefresh()
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