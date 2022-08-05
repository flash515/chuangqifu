
const app = getApp()
Page({
  data: {
    inviterid:"",
    starttime:"",
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'MeetingRoom1',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '创企服快捷会议室一',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function(options) {
      this.data.inviterid = options.userid;
      app.globalData.Ginviterid = options.userid;
      this.data.starttime=options.starttime;
      console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
      console.log(Date.parse(new Date()) - this.data.starttime);
      // 接收参数方法一结束

          // 通过传递来的参数查询推荐人信息
    db.collection('USER').where({
      _openid: this.data.inviterid
    }).get({
      success: res => {
        wx.setStorageSync('LInviter', res.data[0]);
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName,
          indirectinviterid: res.data[0].InviterOpenId
        })
        app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
        app.globalData.Ginviterpromoterlevel = res.data[0].PromoterLevel;
      }
    })

      wx.getUserProfile({
        desc: '请微信登录后使用',
      })({
        success: res => {
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            userInfo: res.userInfo
          })
        }
      })
if(this.data.starttime=="1659668828000"){
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({
            desc: '请微信登录后使用',
          })({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
    // 通过云函数获取用户本人的小程序ID
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.Gopenid = res.result.openid
        console.log("全局参数Gopenid=:", app.globalData.Gopenid)
        this.setData({
          // onGetUserInfo: this.onGetUserInfo,
          getOpenID: res.result.openid,
        })
      }
      })
    this.setData({
      // onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })
    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
}else{
  wx.showToast({
    icon: 'error',
    title: '此邀请已过期',
  })
}
  },
  // 自定义组件中定义的方法
  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }

    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },
  // 自定义组件中定义的方法
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onShareAppMessage() {
    return {
      title: app.globalData.GnickName + '邀请您进入创企服快捷会议室一，此邀请2小时内有效',
      path: '/pages/tools/meetingroom/meetingroom1?userid=' + app.globalData.Gopenid+'&starttime='+Date.parse(new Date()),
      imageUrl: 'cloud://cloud1-2gn7aud7a22c693c.636c-cloud1-2gn7aud7a22c693c-1312824882/setting/image/shareroom.png', //封面
        }
  },
})
