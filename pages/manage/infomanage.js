const app = getApp()
var utils = require("../../utils/utils")
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    avatarurl: "",
    nickname: "",
    creatorphone: "",
    infomations: [], //已保存的资讯分享
    infoselected: false,
    infoid: "",

  },


  bvInfoShareSelect(e) {
    console.log(e.detail)
    if (e.detail.checked == true) {
      this.setData({
        infoid: e.detail.cell.InfoId,
        infocontent: e.detail.cell.InfoContent,
        infostatus: e.detail.cell.InfoStatus,
      })
    } else {
      this.setData({
        infoid: "",
        infocontent: "",
        infostatus: "unchecked",
      })
    }
  },

 async bvFail(e) {
    console.log(e)
    let that = this
      app.globalData.c1.callFunction({
        name: "NormalUpdate",
        data: {
          collectionName: "INFOSHARE",
          key: "InfoId",
          id: e.currentTarget.dataset.id,
          key1: "InfoStatus",
          value1: "failed"
        },
        success: res => {
          utils._SuccessToast("简讯审核已通过")
          // 查询本人提交的InfoShare
          that.data.infomations[e.currentTarget.dataset.index].InfoStatus = "failed"
          that.setData({
            infomations: that.data.infomations
          })
        }
      })
  },
 async bvPass(e) {
    console.log(e)
    let that = this
    app.globalData.c1.callFunction({
        name: "NormalUpdate",
        data: {
          collectionName: "INFOSHARE",
          key: "InfoId",
          id: e.currentTarget.dataset.id,
          key1: "InfoStatus",
          value1: "checked"
        },
        success: res => {
          utils._SuccessToast("简讯审核已通过")
          // 查询本人提交的InfoShare
          that.data.infomations[e.currentTarget.dataset.index].InfoStatus = "checked"
          that.setData({
            infomations: that.data.infomations
          })
        }
      })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    this.setData({
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
      creatorphone: app.globalData.Guserdata.UserInfo.UserPhone,
    })
    // 查询本人提交的InfoShare
    app.globalData.c1.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          CreatorId: app.globalData.Guserid,
          InfoType: "Simple",
          InfoStatus: "unchecked"
        }]
      },
      success: res => {
        that.setData({
          infomations: res.result.data,
        })
        console.log("全部待审资讯", that.data.infomations)
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
})