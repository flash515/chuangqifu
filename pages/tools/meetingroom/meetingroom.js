const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room1key: "",
    room2key: "",
    room3key: "",
    room4key: "",
    room1password: "",
    room2password: "",
    room3password: "",
    room4password: "",
    using1: "",
    using2: "",
    using3: "",
    using4: "",

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
  Room4Password(e) {
    this.setData({
      room4password: e.detail.value
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
  Room4Key(e) {
    this.setData({
      room4key: e.detail.value
    })
  },
  RoomApply(e) {
    // 调用云函数
    if (e.target.dataset.value == "") {
      wx.showToast({
        title: '请设置密码',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      wx.cloud.callFunction({
        name: 'MeetingRoomSetting',
        data: {
          key1: e.target.dataset.id,
          value1: e.target.dataset.value,
        },
        success: res => {
          if (e.target.dataset.id == "Room1Password") {
            this.setData({
              using1: true
            })
          } else if (e.target.dataset.id == "Room2Password") {
            this.setData({
              using2: true
            })
          } else if (e.target.dataset.id == "Room3Password") {
            this.setData({
              using3: true
            })
          } else if (e.target.dataset.id == "Room4Password") {
            this.setData({
              using4: true
            })
          }
          wx.navigateTo({
            url: e.target.dataset.url,
          })
        }
      })
    }
  },
  Roomlogin(e) {
    console.log(e.target.dataset.value)
    console.log(e.target.dataset.password)
    if (e.target.dataset.value == e.target.dataset.password) {
      wx.navigateTo({
        url: e.target.dataset.url,
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }
  },
  RoomClean(e) {
    var that=this
    console.log(e.target.dataset.value)
    console.log(e.target.dataset.password)
    console.log(e.target.dataset.room)
    console.log(e.target.dataset.key)
    if (e.target.dataset.value == e.target.dataset.password) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'MeetingRoomClean',
        data: {
          collection: e.target.dataset.room
        },
        success: res => {
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: e.target.dataset.key,
              value1: "",
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })
              if (e.target.dataset.room == "MeetingRoom1") {
                this.setData({
                  using1: false,
                  room1key: "",
                  room1password:""
                })
              } else if (e.target.dataset.room == "MeetingRoom2") {
                this.setData({
                  using2: false,
                  room2key: "",
                  room2password:""
                })
              } else if (e.target.dataset.room == "MeetingRoom3") {
                this.setData({
                  using3: false,
                  room3key: "",
                  room3password:""
                })
              } else if (e.target.dataset.room == "MeetingRoom4") {
                this.setData({
                  using4: false,
                  room4key: "",
                  room4password:""
                })
              }
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray
    })
    const db = wx.cloud.database()
    db.collection('setting').where({
      currentstatus: "effect"
    }).get({
      success: res => {
        if (res.data[0].Room1Password == "") {
          this.setData({
            using1: false,
          })
        } else {
          this.setData({
            using1: true,
            room1password: res.data.Room1Password
          })
        }
        if (res.data[0].Room2Password == "") {
          this.setData({
            using2: false,
          })
        } else {
          this.setData({
            using2: true,
            room2password: res.data.Room2Password
          })
        }
        if (res.data[0].Room3Password == "") {
          this.setData({
            using3: false,
          })
        } else {
          this.setData({
            using3: true,
            room3password: res.data.Room3Password
          })
        }
        if (res.data[0].Room4Password == "") {
          this.setData({
            using4: false,
          })
        } else {
          this.setData({
            using4: true,
            room4password: res.data.Room4Password
          })
        }
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