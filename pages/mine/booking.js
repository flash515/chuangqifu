const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingarray: [],
    address: "",
    phone: "",
    contacts: "",
    data: "",
    time: "",
    status: "",
    // 轮播头图
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
  bvBookingCancel(e) {
    const db = wx.cloud.database()
    db.collection('BOOKING').doc(e.currentTarget.dataset.id).update({
        date: {
          BookingStatus: "canceled"
        },
      success: res => {
        wx.showToast({
          title: '当前预约已取消',
          icon: 'success',
          duration: 2000 //持续的时间
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      image: app.globalData.Gimagearray,
    })
    const db = wx.cloud.database()
    db.collection('BOOKING').where({
      _openid: app.globalData.Gopenid,

    }).get({
      success: res => {
        this.setData({
          bookingarray: res.data,
        })
      },
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