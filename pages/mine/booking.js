const app = getApp()
const utils = require("../../utils/utils");
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
    btnhidden: false,
    // 轮播头图
    image: [],

  },
  bvBookingCancel(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.index)
    let that = this

      const db = app.globalData.c1.database()
      db.collection('BOOKING').doc(e.currentTarget.dataset.id).update({
        data: {
          BookingStatus: "canceled"
        },
        success: res => {
          console.log(res)
          that.data.bookingarray[e.currentTarget.dataset.index].BookingStatus = "canceled"
          that.setData({
            btnhidden: true,
            bookingarray: that.data.bookingarray
          })
          utils._SuccessToast('当前预约已取消')
        }
      })

  },
  bvNewBooking(e) {
    wx.navigateTo({
      url: '../mine/newbooking',
    })
  },
  bvBookingChange(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../mine/newbooking?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
    })
    let that = this
    
      const db = app.globalData.c1.database()
      db.collection('BOOKING').where({
        UserId: app.globalData.Guserid,
      }).get({
        success: res => {
          that.setData({
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
    let that = this
    
      const db = app.globalData.c1.database()
      db.collection('BOOKING').where({
        UserId: app.globalData.Guserid,
      }).get({
        success: res => {
          that.setData({
            bookingarray: res.data,
          })
        },
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