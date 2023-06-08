var utils = require("../../utils/utils")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempinviterid: "",
    params: "",

    // 登录框相关变量
    loginshow: true,
    getnumbersuccess: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone: "",
    s_phonecode: "",
    u_phonecode: "",

    remark: "积分红包",
    transferpacketid: "",
    transferpoints: 0,
    packetnumber: 0,
    doneepoints: 0,
    remainpoints: 0,
    remainpacket: 0,
    temppoints: 0,
    temppacket: 0
  },
  onGetPhoneNumber: async function (e) {
    console.log('步骤1获取授权code', e.detail)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let phonenumber = await utils._GetPhoneNumber(e.detail.code)
      this.setData({
        inputphone: phonenumber,
        getnumbersuccess:true
      })
    }
  },

  bvInputPhone(e) {
    this.data.inputphone = e.detail.value
  },

  bvPhoneCode(e) {
    this.data.u_phonecode = e.detail.value
  },
  bvSendCode: async function () {
    if (this.data.inputphone == '') {
      utils._ErrorToast("请输入手机号码")
    } else {
      if (this.data.disabledstatus == false) {
        this.setData({
          disabledstatus: true
        })
        this._SendCodeBtn()
        this.data.s_phonecode = await utils._sendcode(this.data.inputphone)
        console.log("验证码", this.data.s_phonecode)
      } else {
        utils._ErrorToast("已发送，请等待")
      }
    }
  },

  _SendCodeBtn() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabledstatus: false
        })
      }
    }, 1000)
  },

  bvLogin: async function (e) {
    // 如果通过授权得到手机号，跳过验证码验证环节
    if (this.data.getnumbersuccess == true) {
      this.setData({
        loginshow: false,
        userphone: this.data.inputphone,
      });
      utils._NewMember(this.data.inputphone)
      utils._RegistPointsAdd()
      utils._SendNewUserSMS()
      app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
    } else {
      if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {
        this.setData({
          loginshow: false,
        })
        utils._NewMember(this.data.inputphone)
        utils._RegistPointsAdd()
        utils._SendNewUserSMS()
        app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
      } else {
        utils._ErrorToast("验证码错误")
      }
    }
    console.log(app.globalData.Guserdata)
  },

  _pointsupdate() {
    this.data.temppoints = this.data.remainpoints - this.data.doneepoints
    this.data.temppacket = this.data.remainpacket - 1
    console.log(this.data.temppoints, this.data.temppacket)
    const db = wx.cloud.database()
    db.collection("POINTS").where({
      TransferPacketId: this.data.transferpacketid
    }).update({
      data: {
        RemainPoints: this.data.temppoints,
        RemainPacket: this.data.temppacket,

      },
      success: res => {
        utils._SuccessToast("积分已领取入账")
      },
      fail: res => {

      }
    })

  },
  bvAccept() {
    const db = wx.cloud.database()
    db.collection("POINTS").add({
      data: {
        PointsType: "transfer",
        ProductName: "推广积分转让",
        // 使用的消费积分
        PacketId: this.data.transferpacketid,
        DoneeId: app.globalData.Guserid,
        DoneePoints: this.data.doneepoints,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        PointsStatus: "checked",
      },
      success: res => {
        utils._SuccessToast("积分已领取入账")
        this._pointsupdate()
        //云函数更新礼包余额
      },
      fail: res => {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tempinviterid: options.userid,
      transferpacketid: options.transferpacketid,
      params: options,
    })
    // 通过分享进入，执行用户登录操作
    await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    console.log(app.globalData.Guserdata.UserInfo.UserPhone)
    if (app.globalData.Guserdata.UserInfo.UserPhone != "") {
      this.setData({
        loginshow: false
      })
    }
    // 查询积分礼包
    let packet = await utils._packetcheck(this.data.transferpacketid)
    this.setData({
      remainpoints: packet[0],
      remainpacket: packet[1]
    })
    wx.hideLoading()
    console.log(this.data.remainpoints, this.data.remainpacket)
    if (packet[1] == 0) {
      utils._ErrorToast("积分礼包已领完")
    } else if (packet[1] == 1) {
      this.setData({
        doneepoints: packet[0],
      })
    } else {
      this.setData({
        doneepoints: parseInt(Math.random() * packet[0])
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})