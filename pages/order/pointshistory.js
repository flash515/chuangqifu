const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    balance: 0,
    orderhistory: [],
    personalpoints:[],
    inviterpoints:[],
    indirectinviterpoints:[],
    consumepoints:[],
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
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: "登录创企服以查看更多信息",
      success: res => {
        console.log("获得的用户微信信息", res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        app.globalData.GavatarUrl=res.userInfo.avatarUrl
        app.globalData.GnickName=res.userInfo.nickName
        // 获取数据库引用
        const db = wx.cloud.database()
        // 更新数据
        db.collection('USER').where({
          _openid: app.globalData.Gopenid
        }).update({
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            language: res.userInfo.language,
            nickName: res.userInfo.nickName,
            province: res.userInfo.province
          },
        })
        // 以上更新数据结束
        wx.showToast({
          icon:'success',
          title: '登录成功',
        })
        return;
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          icon: 'error',
          title: '您拒绝了请求',
        })
        return;
      }
    })

  },
  bvRefresh(e) {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: e.currentTarget.dataset.name,
        command: "and",
        where: [{
          IndirectInviterId: 'omLS75T9_sWFA7pBwdg0uL6AUtcI',
          PointsStatus:'checked',
        }]
      },
      success: res => {
          this.setData({
            pointshistory: res.result.data
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的订单,数据库已做权限设置，用户只能查询本人订单
    db.collection('POINTS').get({
      success: res => {
        console.log(res);
        wx.setStorageSync('LPointslist', res.data);
        this.setData({
          // 列表渲染
          pointshistory: res.data
        })
        var personalfliter = [];
        var inviterfliter = [];
        var indirectinviterfliter = [];
        var consumefliter = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].PersonalId == app.globalData.Gopenid && res.data[i].PointsStatus=="checked"){
            personalfliter.push(res.data[i]);
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].InviterId == app.globalData.Gopenid && res.data[i].PointsStatus=="checked") {
            inviterfliter.push(res.data[i]);
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].IndirectInviterId == app.globalData.Gopenid && res.data[i].PointsStatus=="checked") {
            indirectinviterfliter.push(res.data[i]);
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ConsumeId == app.globalData.Gopenid && res.data[i].PointsStatus=="checked") {
            consumefliter.push(res.data[i]);
          }
        }
        this.setData({
          personalpoints: personalfliter,
          inviterpoints:inviterfliter,
          indirectinviterpoints:indirectinviterfliter,
          consumepoints:consumefliter,
          balance:app.globalData.Gbalance
        })
        console.log(this.data.pointshistory);
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
    this.setData({
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
      image: app.globalData.Gimagearray
    })
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