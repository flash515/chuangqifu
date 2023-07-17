const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
const track = require("../../utils/track");
const Time = require("../../utils/getDates");
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingid: "",
    booklock: false,
    adddate: "",
    address: "",
    phone: "",
    contacts: "",
    date: "",
    time: "",
    content: "",
    // 轮播头图
    image: [],
  },
  bvTime(e) {
    this.setData({
      time: e.detail.value,
    })
  },
  bvDate(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  bvContacts(e) {
    this.setData({
      contacts: e.detail.value,
    })
  },
  bvPhone(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  bvAddress(e) {
    this.setData({
      address: e.detail.value,
    })
  },
  bvContent(e) {
    console.log(e.detail)
    this.setData({
      content: e.detail.key,
    })
  },
  bvBooking() {
    // 判断是否重复提交
    if (this.data.booklock) {
      // 锁定时很执行
      utils._ErrorToast('请勿重复提交')

    } else {
      // 未锁定时执行
      // 获取数据库引用
      let that = this
      const db = app.globalData.c1.database()
      db.collection('BOOKING').add({
          data: {
            Address: this.data.address,
            Phone: this.data.phone,
            Contacts: this.data.contacts,
            BookingDate: this.data.date,
            BookingTime: this.data.time,
            BookingContent: this.data.content,
            BookingStatus: "unchecked",
            UserId: app.globalData.Guserid,
            AddDate: Time.getServerTime(),
            From: "创企服"
          },
          success: res => {
            utils._SuccessToast('预约提交成功')
          },
          fail: res => {
            utils._ErrorToast('预约提交失败')
          }
        }),
        that.data.booklock = true // 修改上传状态为锁定
    }
  },
  bvUpdateData() {
    let that = this

    const db = app.globalData.c1.database()
    db.collection('BOOKING').doc(that.data.bookingid).update({
      data: {
        BookingContent: that.data.content,
        Address: that.data.address,
        Phone: that.data.phone,
        Contacts: that.data.contacts,
        BookingDate: that.data.date,
        BookingTime: that.data.time,
        BookingStatus: "unchecked",
        UpdateDate: Time.getServerTime(),
      },
      success: res => {
        utils._SuccessToast('预约更新成功')
      },
      fail: res => {
        utils._ErrorToast('预约更新失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var str = new Date()
    this.setData({
      bookingid: options.id,
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })
    console.log(this.data.bookingid)
    if (this.data.bookingid != "" && this.data.bookingid != undefined) {
      let that = this
      const db = app.globalData.c1.database()
      db.collection('BOOKING').doc(that.data.bookingid).get({
        success: res => {
          console.log(res)
          that.setData({
            adddate: res.data.AddDate,
            content: res.data.BookingContent,
            date: res.data.BookingDate,
            time: res.data.BookingTime,
            contacts: res.data.Contacts,
            phone: res.data.Phone,
            address: res.data.Address,
            status: res.data.BookingStatus,
          })
        },
      })
    } else {
      this.setData({
        content: "业务沟通"
      })
    }
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
  onTabItemTap: () => startToTrack(),
  onShow: function () {
    startToTrack()
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
    startByBack()
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