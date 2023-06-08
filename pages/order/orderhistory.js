// pages/order/orderhistory.js
const app = getApp()
const utils= require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,

    orderhistory:[],
    discounthistory:[],
    promoterhistory:[],
    // 轮播参数
    image: [],
  },
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },
  onLogin(e){
    this.setData({
      loginshow:e.detail.loginshow,
      loginbtnshow:e.detail.loginbtnshow,
      userphone:e.detail.userphone,
    })
  },

  
  bvOrdertDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../order/orderdetail?id=' + e.currentTarget.dataset.id
    })
  },
  bvToPay(e) {
    wx.navigateTo({
      url: '../order/pay?orderid=' + e.currentTarget.dataset.orderid + '&productid=' + e.currentTarget.dataset.productid+ '&productname=' + e.currentTarget.dataset.productname + '&totalfee=' + e.currentTarget.dataset.totalfee+'&database='+e.currentTarget.dataset.database
    })
  },
  bvRefresh(e){
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: e.currentTarget.dataset.name,
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
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
        else if(e.currentTarget.dataset.name=="PROMOTEORDER"){
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
    if(app.globalData.Guserdata.UserInfo.UserPhone!=''){
      //loginbtnshow已赋值
    }else{
      this.setData({
        loginbtnshow: true
      })
    }
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DISCOUNTORDER",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
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
          UserId: app.globalData.Guserid
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
        collectionName: "PROMOTEORDER",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
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
})