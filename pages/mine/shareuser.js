// pages/mine/userlist.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    promoterlevel: "",
    // 全部直接推荐人数
    directuser: [],
    // 直接推荐用户数组
    // 30天直接推荐人数
    direct30user: [],
    directvaliduser: [],
    // 直接推荐价值
    indirectuser: [],
    indirect30user: [],
    dotbadge: "true",
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      promoterlevel: app.globalData.Gpromoterlevel,
    })
    //查询直接用户及30天内直接用户
    wx.getStorage({
      key: 'LDirectUser',
      success: res => {
        this.setData({
          directuser: res.data,
        })
        var directvalidfliter = [];
        for (var i = 0; i < this.data.directuser.length; i++) {
          if (this.data.directuser[i].avatarUrl != "" && this.data.directuser[i].avatarUrl != undefined) {
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
        console.log("3  一年有效用户人数", app.globalData.Gdirect1yearvaliduser);
        wx.setStorageSync('LDirect1YearValidUser', direct1yearfliter);
      }
    })
    //查询间接用户及30天内间接用户，放在分享数量页面onload
    // 从本地存储中读取
    wx.getStorage({
      key: 'LIndirectUser',
      success: res => {
        this.setData({
          indirectuser: res.data,
        })
        // *直接查询结果
        console.log("间接用户人数", res.data.length);
        var indirectvalidfliter = [];
        for (var i = 0; i < this.data.indirectuser.length; i++) {
          if (this.data.indirectuser[i].avatarUrl != "" && this.data.indirectuser[i].avatarUrl != undefined) {
            indirectvalidfliter.push(this.data.indirectuser[i]);
          }
        }
        this.setData({
          indirectvaliduser: indirectvalidfliter,
        })
        // 筛选特定时间注册人数
        var indirect30fliter = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].SysAddDate > (new Date().getTime() - 30 * 86400000)) {
            indirect30fliter.push(res.data[i]);
          }
        }
        this.setData({
          indirect30user: indirect30fliter
        })
        console.log("3  30天内分享的间接用户人数", indirect30fliter.length);
        wx.setStorageSync('LIndirect30User', indirect30fliter);
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