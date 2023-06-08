const app = getApp()
const defaultAvatarUrl = 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/0.png?sign=cd6db771ef94030b49c3335b6ba8a2cc&t=1667888022'
const utils = require("../../../utils/utils")
Page({
  data: {
    inviterid: "",
    starttime: "",
    avatarUrl: defaultAvatarUrl,
    nickName: "",
    chatheight: 0,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'MeetingRoom1',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '快捷会议室一',
    containerStyle: "",
    getOpenID: null,
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
  onLoad: function (options) {

    console.log(options)
    this.data.inviterid = options.userid;
    app.globalData.Ginviterid = options.userid;
    this.data.starttime = options.starttime;
    console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
    console.log(Date.parse(new Date()) - this.data.starttime);
    // 接收参数方法一结束

    if (Date.parse(new Date()) - this.data.starttime < "3600000") {
      // 查询推荐人
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: this.data.inviterid
      }).get({
        success: res => {
          app.globalData.Ginviter=res.data[0].UserInfo
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
            const {
              top,
              bottom
            } = res.safeArea
            this.setData({
              containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
            })

            this.setData({
              chatheight: res.windowHeight* 750 / res.windowWidth - 180
            })
            console.log("containerStyle", this.data.containerStyle)
            console.log("chatheight", this.data.chatheight)
          }
        },
      })
    } else {
      wx.redirectTo({
        url: '../meetingroom/meetingroom',
      })
    }
  },
  getOpenID: async function () {
    if (this.openid) {
      return this.openid
    }

    const {
      result
    } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },

  onShareAppMessage() {
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '邀请您加入快捷会议室，此邀请60分钟内有效',
      path: '/pages/tools/meetingroom/meetingroom1?type=express&userid=' + app.globalData.Guserid + '&starttime=' + this.data.starttime,
      imageUrl: '', //封面
    }
  },

})