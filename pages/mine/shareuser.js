const utils = require("../../utils/utils");
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    promotelevel: "",
    // 全部直接推荐人数
    directuser: [],
    // 直接推荐用户数组
    // 30天直接推荐人数
    direct30user: [],
    directvaliduser: [],
    
    indirectvaliduser:[],
    // 直接推荐价值
    indirectuser: [],
    indirect30user: [],
    dotbadge: "true",
    // 轮播头图
    image: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      promotelevel: app.globalData.Guserdata.TradeInfo.PromoteLevel,
    })
    // 查询直接推广用户与间接推广用户
        this.setData({
          directuser:await utils._directuser(app.globalData.Guserid),
        })
        var directvalidfliter = [];
        for (var i = 0; i < this.data.directuser.length; i++) {
          if (this.data.directuser[i].UserInfo.UserPhone != "" && this.data.directuser[i].UserInfo.UserPhone != undefined) {
            directvalidfliter.push(this.data.directuser[i]);
          }
        }
        this.setData({
          directvaliduser: directvalidfliter,
        })

        //查询一年有效用户
        var direct1yearfliter = [];
        for (var i = 0; i < this.data.directvaliduser.length; i++) {
          if (this.data.directvaliduser[i].SysAddDate > (new Date().getTime() - 365 * 86400000)) {
            direct1yearfliter.push(this.data.directvaliduser[i]);
          }
        }
        app.globalData.Gdirect1yearvaliduser = direct1yearfliter.length
        console.log("3  一年直接推广有效用户人数", app.globalData.Gdirect1yearvaliduser);
   

    //查询间接用户及30天内间接用户，放在分享数量页面onload
       this.setData({
          indirectuser: await utils._indirectuser(app.globalData.Guserid),
        })
        // *直接查询结果
        console.log("间接用户人数", res.data.length);
        var indirectvalidfliter = [];
        for (var i = 0; i < this.data.indirectuser.length; i++) {
          if (this.data.indirectuser[i].UserPhone != "" && this.data.indirectuser[i].UserPhone != undefined) {
            indirectvalidfliter.push(this.data.indirectuser[i]);
          }
        }
        this.setData({
          indirectvaliduser: indirectvalidfliter,
        })
        // 筛选30天内有效间接注册人数
        var indirect30fliter = [];
        for (var i = 0; i < this.data.indirectvaliduser.length; i++) {
          if (res.data[i].SysAddDate > (new Date().getTime() - 30 * 86400000)) {
            indirect30fliter.push(this.data.indirectvaliduser[i]);
          }
        }
        this.setData({
          indirect30user: indirect30fliter
        })
        console.log("3  30天内分享的间接用户人数", indirect30fliter.length);


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