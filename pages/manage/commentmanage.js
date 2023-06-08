const app = getApp()
const { _directuser } = require("../../utils/utils")
var utils = require("../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: []
  },
  bvCheck: function (e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.key)
    wx.cloud.callFunction({
      name: "NormalUpdate",
      data: {
        collectionName: "InfoShareComment",
        key:"_id",
        id: e.currentTarget.dataset.id,
        key1: e.currentTarget.dataset.key,
        value1: "checked"
      },
      success: res => {
        console.log(res)
        utils._SuccessToast("状态更新完成")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "InfoShareComment",
        command: "or",
        where: [{
            ["Status"]: "unchecked",
          },
          {
            ["ReplyStatus"]: "unchecked",
          }
        ],
      },
      success: res => {
        console.log(res)
        this.setData({
          comments: res.result.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})