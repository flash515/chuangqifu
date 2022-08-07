const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Setting:[],
    room1key: "",
    room2key: "",
    room3key: "",
    room4key: "",
    room1clean: "",
    room2clean: "",
    room3clean: "",
    room4clean: "",
    room1password: "",
    room2password: "",
    room3password: "",
    room4password: "",
    room1status: "",
    room2status: "",
    room3status: "",
    room4status: "",
    room1time: "",
    room2time: "",
    room3time: "",
    room4time: "",

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
      room1password:e.detail.value
    })
  },
  Room2Password(e) {
    this.setData({
      room2password:e.detail.value
    })
  },
  Room3Password(e) {
    this.setData({
      room3password:e.detail.value
    })
  },
  Room4Password(e) {
    this.setData({
      room4password:e.detail.value
    })
  },
  Room1Key(e) {
    this.setData({
      room1key:e.detail.value
    })

  },
  Room2Key(e) {
    this.setData({
      room2key:e.detail.value
    })

  },
  Room3Key(e) {
    this.setData({
      room3key:e.detail.value
    })

  },
  Room4Key(e) {
    this.setData({
      room4key:e.detail.value
    })

  },
  Room1Clean(e) {
    this.setData({
      room1clean:e.detail.value
    })

  },
  Room2Clean(e) {
    this.setData({
      room2clean:e.detail.value
    })

  },
  Room3Clean(e) {
    this.setData({
      room3clean:e.detail.value
    })

  },
  Room4Clean(e) {
    this.setData({
      room4clean:e.detail.value
    })

  },
  RoomApply(e) {
    // 调用云函数
    if (e.target.dataset.value1 == "") {
      wx.showToast({
        title: '请设置密码',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
          if (e.target.dataset.key1 == "Room1Password") {
            this.setData({
              room1status: true,
              room1time:Date.parse(new Date()),
            })
            console.log(this.data.room1time)
            this.data.Setting.Room1Password=this.data.room1password
            this.data.Setting.Room1Status=this.data.room1status
            this.data.Setting.Room1Time=this.data.room1time
            this._storgeupdate()
            // this._settingupdate()
          } else if (e.target.dataset.key1 == "Room2Password") {
            this.setData({
              room2status: true,
              room2time:Date.parse(new Date()),
            })
            console.log(this.data.room2time)
            this.data.Setting.Room2Password=this.data.room2password
            this.data.Setting.Room2Status=this.data.room2status
            this.data.Setting.Room2Time=this.data.room2time
            this._storgeupdate()
          } else if (e.target.dataset.key1 == "Room3Password") {
            this.setData({
              room3status: true,
              room3time:Date.parse(new Date()),
            })
            console.log(this.data.room3time)
            this.data.Setting.Room3Password=this.data.room3password
            this.data.Setting.Room3Status=this.data.room3status
            this.data.Setting.Room3Time=this.data.room3time
            this._storgeupdate()
          } else if (e.target.dataset.key1 == "Room4Password") {
            this.setData({
              room4status: true,
              room4time:Date.parse(new Date()),
            })
            console.log(this.data.room4time)
            this.data.Setting.Room4Password=this.data.room4password
            this.data.Setting.Room4Status=this.data.room4status
            this.data.Setting.Room4Time=this.data.room4time
            this._storgeupdate()
          }
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: e.target.dataset.key1,
              value1: e.target.dataset.value1,
              key2: e.target.dataset.key2,
              value2: e.target.dataset.value2,
              key3: e.target.dataset.key3,
              value3: e.target.dataset.value3,
            },
            success: res => {
              console.log("执行了")
            }
          })
        }
  },
  _storgeupdate(){
    wx.setStorageSync("LSetting",this.data.Setting)
    console.log("执行了")
  },
  Roomlogin(e) {
    console.log(e.target.dataset.value)
    console.log(e.target.dataset.password)
    if (e.target.dataset.value == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }else{
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
  }
  },
  RoomClean(e) {
    var that=this
    if (e.target.dataset.value == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }else{
    if (e.target.dataset.value == e.target.dataset.password) {
      if (e.target.dataset.room == "MeetingRoom1") {
        this.setData({
          room1password:"",
          room1key:"",
          room1time:"",
          room1clean:"",
          room1status: false,
        })
        this.data.Setting.Room1Password=this.data.room1password
        this.data.Setting.Room1Time=this.data.room1time
        this.data.Setting.Room1Status=this.data.room1status
        this._storgeupdate()
      }else if(e.target.dataset.room == "MeetingRoom2"){
        this.setData({
          room2password:"",
          room2key:"",
          room2time:"",
          room2clean:"",
          room2status: false,
        })
        this.data.Setting.Room2Password=this.data.room2password
        this.data.Setting.Room2Time=this.data.room2time
        this.data.Setting.Room2Status=this.data.room2status
        this._storgeupdate()
      }else if(e.target.dataset.room == "MeetingRoom3"){
        this.setData({
          room3password:"",
          room3key:"",
          room3time:"",
          room3clean:"",
          room3status: false,
        })
        this.data.Setting.Room3Password=this.data.room3password
        this.data.Setting.Room3Time=this.data.room3time
        this.data.Setting.Room3Status=this.data.room3status
        this._storgeupdate()
      }else if(e.target.dataset.room == "MeetingRoom4"){
        this.setData({
          room4password:"",
          room4key:"",
          room4time:"",
          room4clean:"",
          room4status: false,
        })
        this.data.Setting.Room4Password=this.data.room4password
        this.data.Setting.Room4Time=this.data.room4time
        this.data.Setting.Room4Status=this.data.room4status
        this._storgeupdate()
      }
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
              key1: e.target.dataset.key1,
              value1: "",
              key2: e.target.dataset.key2,
              value2: "",
              key3: e.target.dataset.key3,
              value3: false,
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })

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
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      Setting:wx.getStorageSync("LSetting"),
    })
    this.setData({
      room1password:this.data.Setting.Room1Password,
      room1time:this.data.Setting.Room1Time,
      room1status:this.data.Setting.Room1Status,
      room2password:this.data.Setting.Room2Password,
      room2time:this.data.Setting.Room2Time,
      room2status:this.data.Setting.Room2Status,
      room3password:this.data.Setting.Room3Password,
      room3time:this.data.Setting.Room3Time,
      room3status:this.data.Setting.Room3Status,
      room4password:this.data.Setting.Room4Password,
      room4time:this.data.Setting.Room4Time,
      room4status:this.data.Setting.Room4Status,
    })
    console.log(this.data.Setting)
    console.log(this.data.Setting.Room1Password)
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