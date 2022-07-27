// pages/order/orderhistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderhistory:[],
    discounthistory:[],
    promoterhistory:[],
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

  bvToPay(e) {
    wx.navigateTo({
      url: '../order/pay?totalfee=' + e.currentTarget.dataset.totalfee + '&productname=' + e.currentTarget.dataset.productname + '&paymentid=' + e.currentTarget.dataset.paymentid+'&database='+e.currentTarget.dataset.database
    })
  },
  bvRefresh(e){
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
if(e.currentTarget.dataset.name=="ORDER"){
          this.setData({
            orderhistory: res.result.data
          })
        }
        else if(e.currentTarget.dataset.name=="DISCOUNTORDER"){
          this.setData({
            discounthistory: res.result.data
          })
        }
        else if(e.currentTarget.dataset.name=="PROMOTERORDER"){
          this.setData({
            promoterhistory: res.result.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DISCOUNTORDER",
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        this.setData({
          discounthistory: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "ORDER",
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        this.setData({
          orderhistory: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PROMOTERORDER",
        command: "and",
        where: [{
          _openid: app.globalData.Gopenid
        }]
      },
      success: res => {
        this.setData({
          promoterhistory: res.result.data
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