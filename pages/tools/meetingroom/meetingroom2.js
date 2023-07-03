const app = getApp()
const defaultAvatarUrl = 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/0.png?sign=cd6db771ef94030b49c3335b6ba8a2cc&t=1667888022'
const utils = require("../../../utils/utils")
Page({
  data: {
    inviterid: "",
    starttime: "",
    avatarUrl: defaultAvatarUrl,
    nickName: "",
    chatRoomEnvId:"xsbmain-9gvsp7vo651fd1a9",
    chatheight: 0,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'MeetingRoom2',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '快捷会议室二',
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
  onLoad:async function (options) {
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
    if (options.userid) {
      // 如果是通过分享链接进入
      this.data.params = options
      this.data.remark = "通过创企服用户分享资讯进入"
      this.data.tempinviterid = options.userid
      // 通过分享进入，执行用户登录操作
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
      this.setData({
        openid: app.globalData.Gopenid
      })
      // 接收参数方法一结束
      if (Date.parse(new Date()) - this.data.starttime < "3600000") {

      } else {
        await utils._ErrorToast("链接已失效")
        wx.redirectTo({
          url: '../meetingroom/meetingroom',
        })
      }
    }else{
      this.setData({
        openid: app.globalData.Gopenid
      })
    }
  },
  onShareAppMessage() {
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '邀请您加入快捷会议室，此邀请60分钟内有效',
      path: '/pages/tools/meetingroom/meetingroom2?type=express&userid=' + app.globalData.Guserid + '&starttime=' + this.data.starttime,
      imageUrl: '', //封面
    }
  },

})