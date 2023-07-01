const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
balance:0,
    personalhistory:[],
    inviterhistory:[],
    indirectinviterhistory:[],
    consumehistory:[],
    pointshistory: [],
    personalpoints:0,
    inviterpoints:0,
    indirectinviterpoints:0,
    consumepoints:0,
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
        
          const db = app.globalData.c1.database()
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
    let that = this
    
    app.globalData.c1.callFunction({
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
          that.setData({
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
      image: app.globalData.Gimagearray,
      balance: app.globalData.Gbalance,
    })
    let that = this
    
  app.globalData.c1.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "POINTS",
      command: "and",
      where: [{
        PersonalId: app.globalData.Gopenid,
        PointsStatus:'checked',
      }]
    },
    success: res => {
    this.setData({
      personalhistory: res.result.data,
    })
  }
})
app.globalData.c1.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      InviterId: app.globalData.Gopenid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    inviterhistory: res.result.data,
  })
}
})
app.globalData.c1.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      IndirectInviterId: app.globalData.Gopenid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    indirectinviterhistory: res.result.data,
  })
}
})
app.globalData.c1.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      ConsumeId: app.globalData.Gopenid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    consumehistory: res.result.data,
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