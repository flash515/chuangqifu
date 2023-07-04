const app = getApp()
const defaultAvatarUrl = 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/0.png?sign=cd6db771ef94030b49c3335b6ba8a2cc&t=1667888022'
const utils = require("../../../utils/utils")
Page({
  data: {
    params: "",
    remark: "通过创企服用户快捷会议邀请进入",
    tempinviterid: "",
    avatarUrl: defaultAvatarUrl,
    nickName: "",
    chatRoomEnvId:"xsbmain-9gvsp7vo651fd1a9",
    chatheight: 0,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'MeetingRoom3',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '快捷会议室三',
    containerStyle: "",
    openid: "",
  },
  formsumit(e) {
    console.log(e)
    if (e.detail.value.nickname == "") {
      utils._ErrorToast("请点击获取昵称")
    } else {
      this.setData({
        nickName: e.detail.value.nickname
      })
    }
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  onLoad: async function (options) {

    console.log(options)
    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const {
            top,
            bottom
          } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })

          this.setData({
            chatheight: res.windowHeight * 750 / res.windowWidth - 180
          })
          console.log("containerStyle", this.data.containerStyle)
          console.log("chatheight", this.data.chatheight)
        }
      },
    })
    this.setData({
      openid: app.globalData.Gopenid
    })
    if (options.userid) {
      // 如果是通过分享链接进入
      wx.showLoading({
        title: '加载中',
      })
      this.data.params = options
      this.data.tempinviterid = options.userid
      // 通过分享进入，执行用户登录操作
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
      wx.hideLoading()
      if (new Date().getTime() - options.starttime > 600000) {
        wx.redirectTo({
          url: '../meetingroom/meetingroom',
        })
      }
    }
  },

  onShareAppMessage(res) {
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '邀请您加入快捷会议室，此邀请10分钟内有效',
      path: '/pages/tools/meetingroom/meetingroom3?userid=' + app.globalData.Guserid + '&starttime=' + new Date().getTime(),
      imageUrl: app.globalData.Gsetting.MeetingRoomImage, //封面
    }
  },

})