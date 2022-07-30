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
          IndirectInviterId: 'omLS75T9_sWFA7pBwdg0uL6AUtcI',
          PointsStatus:'checked',
        }]
      },
      success: res => {
          this.setData({
            pointshistory: res.result.data
          })
      }
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
    db.collection('POINTS').get({
      success: res => {
        console.log(res);
        wx.setStorageSync('LPointslist', res.data);
        this.setData({
          // 列表渲染
          pointshistory: res.data
        })
        var personalfliter = []
        var inviterfliter = []
        var indirectinviterfliter = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].PersonalId == app.globalData.Gopenid) {
            personalfliter.push(res.data[i]);
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].InviterId == app.globalData.Gopenid) {
            inviterfliter.push(res.data[i]);
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].IndirectInviterId == app.globalData.Gopenid) {
            indirectinviterfliter.push(res.data[i]);
          }
        }
        this.setData({
          personalpoints: personalfliter,
          inviterpoints:inviterfliter,
          indirectinviterpoints:indirectinviterfliter
        })
        console.log(this.data.pointshistory);
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