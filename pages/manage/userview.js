const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userarray: [],
  },
  onLoad: function (options) {
    // 查询本人提交的全部产品
    const db = wx.cloud.database()
    db.collection('USER').get({
      success: res => {
        wx.setStorageSync('LUser', res.data);
        //括号1开始
        this.setData({
          userarray: res.data,
        })
        console.log("全部用户", this.data.userarray)
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