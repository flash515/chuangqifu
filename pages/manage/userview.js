const app = getApp()
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userarray: [],
  },
  onLoad: function (options) {
    // 查询本人提交的全部商品
    let that=this
    utils.CloudInit(function (c1) {
    c1.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "",
        where: [{["UserInfo.UserType"]:"client"}],
        orderbykey:"SysAddDate",
        orderby:"desc",
      },
      success: res => {
        console.log("全部用户",  res)
        //括号1开始
        that.setData({
          userarray: res.result.data,
        })
        console.log("全部用户",that.data.userarray)
      }
    })
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