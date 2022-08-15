const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    balance: 0,
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

let p1=new Promise((resolve,reject)=>{
  wx.cloud.callFunction({
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
      console.log(res)
      let points1=0
      for(let i =0;i<res.result.data.length;i++){
        points1 += res.result.data[i].PersonalPoints
    }
    this.setData({
      personalhistory: res.result.data,
      personalpoints:points1
    })
    console.log("异步执行",this.data.personalpoints)
    resolve(this.data.personalpoints);
  },
  fail: err => {
    resolve(this.data.personalpoints);
  }
})
console.log("1执行了",this.data.personalpoints)
});

let p2=new Promise((resolve,reject)=>{
  wx.cloud.callFunction({
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
      console.log(res)
      let points2=0
      for(let i =0;i<res.result.data.length;i++){
        points2 += res.result.data[i].InviterPoints
    }
    this.setData({
          inviterhistory: res.result.data,
          inviterpoints:points2
        })
        console.log("异步执行",this.data.inviterpoints)
        resolve(this.data.inviterpoints);
    },
    fail: err => {
      resolve(this.data.inviterpoints);
    }
  })
  console.log(this.data.inviterpoints)
  console.log("2执行了")
});
let p3=new Promise((resolve,reject)=>{
  wx.cloud.callFunction({
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
      console.log(res)
      let points3=0
      for(let i =0;i<res.result.data.length;i++){
        points3 += res.result.data[i].IndirectInviterPoints
    }
        this.setData({
          indirectinviterhistory: res.result.data,
          indirectinviterpoints:points3
        })
        console.log("异步执行",this.data.indirectinviterpoints)
        resolve(this.data.indirectinviterpoints);
    },
    fail: err => {
      // this.setData({
      //   indirectinviterpoints:0
      // })
      resolve(this.data.indirectinviterpoints);
    }

  })
  console.log(this.data.indirectinviterpoints)
  console.log("3执行了")
});
let p4=new Promise((resolve,reject)=>{
  wx.cloud.callFunction({
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
      console.log(res)
      let points4=0
      for(let i =0;i<res.result.data.length;i++){
        points4 += res.result.data[i].ConsumePoints
    }
        this.setData({
          consumehistory: res.result.data,
          consumepoints:points4
        })
        console.log("异步执行",this.data.consumepoints)
        resolve(this.data.consumepoints);
    },
    fail: err => {
      resolve(this.data.consumepoints);
    }
  })
  console.log(this.data.consumepoints)
  console.log("4执行了")
});
Promise.all([p1,p2,p3,p4]).then(res=>{
  this.setData({
    balance:this.data.personalpoints+this.data.inviterpoints+this.data.indirectinviterpoints-this.data.consumepoints,
  }),
  console.log("balance执行了")
});


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