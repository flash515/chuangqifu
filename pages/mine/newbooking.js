const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
const track = require("../../utils/track");
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
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
      wx.showToast({
        title: '请勿重复提交',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      db.collection('BOOKING').add({
          data: {
            Address: this.data.address,
            Phone: this.data.phone,
            Contacts: this.data.contacts,
            BookingDate: this.data.date,
            BookingTime: this.data.time,
            BookingContent: this.data.content,
            BookingStatus: "unchecked",
            AddDate: new Date().toLocaleString('chinese',{ hour12: false })
          },
          success: res => {
            console.log('预约提交成功', res.data)
            wx.showToast({
              title: '预约提交成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail: res => {
            console.log("提交失败", res)
            wx.showToast({
              title: '预约提交失败',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.booklock = true // 修改上传状态为锁定
    }
  },
  bvUpdateData(){
    const db = wx.cloud.database()
    db.collection('BOOKING').doc(this.data.pageParam.id).update({
        data: {
          BookingContent: this.data.content,
          Address: this.data.address,
          Phone: this.data.phone,
          Contacts: this.data.contacts,
          BookingDate: this.data.date,
          BookingTime: this.data.time,
          BookingStatus: "unchecked",
          UpdateDate: new Date().toLocaleString('chinese',{ hour12: false })
        },
        success: res => {
          console.log('预约更新成功', res.data)
          wx.showToast({
            title: '预约更新成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
        fail: res => {
          console.log("更新失败", res)
          wx.showToast({
            title: '预约更新失败',
            icon: 'error',
            duration: 2000 //持续的时间
          })
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
      pageParam: options,
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })
    console.log(this.data.pageParam.id.length)
    if (this.data.pageParam.id.length != 0 && this.data.pageParam.id.length != null) {
      const db = wx.cloud.database()
      db.collection('BOOKING').doc(this.data.pageParam.id).get({
        success: res => {
          console.log(res)
          this.setData({
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
        content: "业务沟通拜访"
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