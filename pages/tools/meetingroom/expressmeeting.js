const app = getApp()
var utils = require("../../../utils/utils");
const defaultAvatarUrl = 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/0.png?sign=cd6db771ef94030b49c3335b6ba8a2cc&t=1667888022'
Page({
  data: {
    errorshow: false,
    expressroomavailable: "",
    inviterid: "",
    starttime: "",
    avatarUrl: defaultAvatarUrl,
    nickName: "",
    chatheight: 0,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'ExpressMeeting',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '快捷会议室',
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

    console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
    console.log(Date.parse(new Date()) - options.starttime);

      // 在邀请有效期内才进行下一步查询
      const db = wx.cloud.database()
      db.collection('setting').where({
        CurrentStatus: "effect"
      }).get({
        success: res => {
          this.data.expressroomavailable = res.data[0].MeetingRoom[3].ExpressRoomAvailable
          this.data.starttime = res.data[0].MeetingRoom[3].ExpressRoomTime

          if (this.data.expressroomavailable == true) {
            console.log("2");
            // 会议已结束
            this.setData({
              errorshow: true
            })
          }else{
            if (Date.parse(new Date()) - this.data.starttime > "3600000") {
              console.log("3");
              // 邀请已过期
              this.setData({
                errorshow: true
              })
            }
          }
        }
      })

    // 接收参数方法一结束

      db.collection('USER').where({
        UserId: this.data.inviterid
      }).get({
        success: res => {
          app.globalData.Ginviter = res.data[0].UserInfo
        }
      })

      this.setData({
        // onGetUserInfo: this.onGetUserInfo,
        getOpenID: this.getOpenID,
      })
// 解决IPHONE显示不正常的设置
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
              chatheight: res.windowHeight * 750 / res.windowWidth - 200
            })
            console.log("containerStyle", this.data.containerStyle)
            console.log("chatheight", this.data.chatheight)
          }
        },
      })

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

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '请加入快捷会议室，此邀请60分钟内有效',
      path: '/pages/tools/meetingroom/expressmeeting?userid=' + app.globalData.Guserid,
      imageUrl: app.globalData.Gsetting.MeetingRoomImage, //封面
    }
  },
  onShow: function () {
    wx.hideHomeButton({
      success: function () {
        console.log("hide home success");
      },
      fail: function () {
        console.log("hide home fail");
      },
      complete: function () {
        console.log("hide home complete");
      },
    });
  }

})