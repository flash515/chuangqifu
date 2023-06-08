const app = getApp();
// 有几个..取决于当前页面的层级，层级越多..越多
var utils = require("../../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    usertype: "client",
    room1key: "",
    room2key: "",
    room3key: "",

    room1clean: "",
    room2clean: "",
    room3clean: "",

    room1password: "",
    room2password: "",
    room3password: "",
    room4password: "",
    room1available: "",
    room2available: "",
    room3available: "",

    room1time: "",
    room2time: "",
    room3time: "",

    expressroomavailable: false,
    expressroomtime: "",

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
  Room1Password(e) {
    this.setData({
      room1password: e.detail.value
    })
  },
  Room2Password(e) {
    this.setData({
      room2password: e.detail.value
    })
  },
  Room3Password(e) {
    this.setData({
      room3password: e.detail.value
    })
  },

  Room1Key(e) {
    this.setData({
      room1key: e.detail.value
    })

  },
  Room2Key(e) {
    this.setData({
      room2key: e.detail.value
    })

  },
  Room3Key(e) {
    this.setData({
      room3key: e.detail.value
    })

  },

  Room1Clean(e) {
    this.setData({
      room1clean: e.detail.value
    })

  },
  Room2Clean(e) {
    this.setData({
      room2clean: e.detail.value
    })

  },
  Room3Clean(e) {
    this.setData({
      room3clean: e.detail.value
    })

  },

  Room1Apply(e) {
    // 调用云函数
    if (this.data.room1password == "") {
      utils._ErrorToast("请设置密码")
    } else {
      this.setData({
        room1available: false,
      })
      this.data.room1time = Date.parse(new Date()),

        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "MeetingRoom.0.Room1Password",
            value1: this.data.room1password,
            key2: "MeetingRoom.0.Room1Available",
            value2: this.data.room1available,
            key3: "MeetingRoom.0.Room1Time",
            value3: this.data.room1time,
          },
          success: res => {
            console.log("执行了")
          }
        })
    }
  },
  Room2Apply(e) {
    // 调用云函数
    if (this.data.room2password == "") {
      utils._ErrorToast("请设置密码")
    } else {
      this.setData({
        room2available: false,
      })
      this.data.room2time = Date.parse(new Date()),

        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "MeetingRoom.1.Room2Password",
            value1: this.data.room2password,
            key2: "MeetingRoom.1.Room2Available",
            value2: this.data.room2available,
            key3: "MeetingRoom.1.Room2Time",
            value3: this.data.room2time,
          },
          success: res => {
            console.log("执行了")
          }
        })
    }
  },
  Room3Apply(e) {
    // 调用云函数
    if (this.data.room3password == "") {
      utils._ErrorToast("请设置密码")
    } else {
      this.setData({
        room3available: false,
      })
      this.data.room3time = Date.parse(new Date()),

        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "MeetingRoom.2.Room3Password",
            value1: this.data.room3password,
            key2: "MeetingRoom.2.Room3Available",
            value2: this.data.room3available,
            key3: "MeetingRoom.2.Room3Time",
            value3: this.data.room3time,
          },
          success: res => {
            console.log("执行了")
          }
        })
    }
  },

  bvRoom1login(e) {
    if (this.data.room1key == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room1key == this.data.room1password) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom1?starttime=' + this.data.room1time,
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvRoom2login(e) {
    if (this.data.room2key == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room2key == this.data.room2password) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom2?starttime=' + this.data.room2time,
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvRoom3login(e) {
    if (this.data.room3key == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room3key == this.data.room3password) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom3?starttime=' + this.data.room3time,
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvExpressRoomApply(e) {
    this.setData({
      expressroomavailable:false
    })
    this.data.expressroomtime = Date.parse(new Date()),
      wx.cloud.callFunction({
        name: 'MeetingRoomSetting',
        data: {
          key1: "MeetingRoom.3.ExpressRoomAvailable",
          value1: this.data.expressroomavailable,
          key2: "MeetingRoom.3.ExpressRoomTime",
          value2: this.data.expressroomtime,
        },
        success: res => {
          console.log("执行了")
        }
      })
  },
  bvExpressRoomlogin(e) {
    wx.navigateTo({
      url: '../meetingroom/expressmeeting',
    })
  },

  bvRoom1End(e) {
    var that = this
    if (this.data.room1clean == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room1clean == this.data.room1password) {



        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomClean',
          data: {
            collection: "MeetingRoom1"
          },
          success: res => {
            wx.cloud.callFunction({
              name: 'MeetingRoomSetting',
              data: {
                key1: "MeetingRoom.0.Room1Password",
                value1: "",
                key2: "MeetingRoom.0.Room1Available",
                value2: true,
                key3: "MeetingRoom.0.Room1Time",
                value3: "",
              },
              success: res => {
                utils._SuccessToast("会议室已重置")
                this.setData({
                  room1password: "",
                  room1key: "",
                  room1time: "",
                  room1clean: "",
                  room1available: true,
                })
              }
            })
          }
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvRoom2End(e) {
    var that = this
    if (this.data.room2clean == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room2clean == this.data.room2password) {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomClean',
          data: {
            collection: "MeetingRoom2"
          },
          success: res => {
            wx.cloud.callFunction({
              name: 'MeetingRoomSetting',
              data: {
                key1: "MeetingRoom.1.Room2Password",
                value1: "",
                key2: "MeetingRoom.1.Room2Available",
                value2: true,
                key3: "MeetingRoom.1.Room2Time",
                value3: "",
              },
              success: res => {
                utils._SuccessToast("会议室已重置")
                this.setData({
                  room2password: "",
                  room2key: "",
                  room2time: "",
                  room2clean: "",
                  room2available: true,
                })
              }
            })
          }
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvRoom3End(e) {
    var that = this
    if (this.data.room3clean == "") {
      utils._ErrorToast("请输入密码")
    } else {
      if (this.data.room3clean == this.data.room3password) {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomClean',
          data: {
            collection: "MeetingRoom3"
          },
          success: res => {
            wx.cloud.callFunction({
              name: 'MeetingRoomSetting',
              data: {
                key1: "MeetingRoom.2.Room3Password",
                value1: "",
                key2: "MeetingRoom.2.Room3Available",
                value2: true,
                key3: "MeetingRoom.2.Room3Time",
                value3: "",
              },
              success: res => {
                utils._SuccessToast("会议室已重置")
                this.setData({
                  room3password: "",
                  room3key: "",
                  room3time: "",
                  room3clean: "",
                  room3available: true,
                })
              }
            })
          }
        })
      } else {
        utils._ErrorToast("密码不正确")
      }
    }
  },
  bvExpressEnd() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'MeetingRoomClean',
      data: {
        collection: "ExpressMeeting"
      },
      success: res => {
        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "MeetingRoom.3.ExpressRoomAvailable",
            value1: true,
            key2: "MeetingRoom.3.ExpressRoomTime",
            value2: "",
          },
          success: res => {
            app.globalData.Gsetting.MeetingRoom[3].ExpressRoomTime=""
            app.globalData.Gsetting.MeetingRoom[3].ExpressRoomAvailable=true
            this.setData({
              expressroomtime: "",
              expressroomavailable:true,
            })
            utils._SuccessToast("会议室已重置")
            console.log(app.globalData.Gsetting)
          }
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
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      room1password: app.globalData.Gsetting.MeetingRoom[0].Room1Password,
      room1time: app.globalData.Gsetting.MeetingRoom[0].Room1Time,
      room1available: app.globalData.Gsetting.MeetingRoom[0].Room1Available,
      room2password: app.globalData.Gsetting.MeetingRoom[1].Room2Password,
      room2time: app.globalData.Gsetting.MeetingRoom[1].Room2Time,
      room2available: app.globalData.Gsetting.MeetingRoom[1].Room2Available,
      room3password: app.globalData.Gsetting.MeetingRoom[2].Room3Password,
      room3time: app.globalData.Gsetting.MeetingRoom[2].Room3Time,
      room3available: app.globalData.Gsetting.MeetingRoom[2].Room3Available,
      expressroomtime: app.globalData.Gsetting.MeetingRoom[3].ExpressRoomTime,
      expressroomavailable: app.globalData.Gsetting.MeetingRoom[3].ExpressRoomAvailable,
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
  onShareAppMessage: function (res) {

  },

})