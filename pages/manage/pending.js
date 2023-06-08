// pages/manage/pending.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dkorderuncheckarray: [],
    zcorderuncheckarray: [],
    delegateissuearray: [],
    promoteruncheckarray: [],
    discountuncheckarray: [],
    bookingarray: [],
  },
  onPaymentStatusChange(e){
    if (e.detail.value == true) {
      this.setData({
        status: "在售",
        onsalechecked: true
      })
      wx.showToast({
        title: '已开启在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        status: "停售",
        onsalechecked: false
      })
      wx.showToast({
        title: '已关闭在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  onOrderStatusChange(e){

  },
  onApplyStatusChange(e){

  },
  onBookingStatusChange(e){

  },
  bvDKUpdate(e){

  },
  bvZCUpdate(e){

  },
  bvPromoterUpdate(e){

  },
  bvDiscountUpdate(e){

  },
  bvBookingUpdate(e){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DKORDER",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          OrderStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          dkorderuncheckarray: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "ZCORDER",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          OrderStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          zcorderuncheckarray: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DELEGATEISSUE",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          OrderStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          delegateissuearray: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PROMOTEORDER",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          ApplyStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          promoteruncheckarray: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DISCOUNTORDER",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          OrderStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          discountuncheckarray: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "BOOKING",
        command: "",
        where: [{
          BookingStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          bookingarray: res.result.data
        })
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