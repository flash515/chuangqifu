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
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone: "",
    phoneremark:"",
    s_phonecode: "",
    u_phonecode: "",
    // 获取手机号用的accesstoken
    accessToken: "",
    // 手机号获取成功的参数
    getnumbersuccess: false,
    remark: "活动登记",
    userphone:"",
    statusinfo:""
  },
  onGetPhoneNumber: async function (e) {
    console.log('步骤1获取授权code', e.detail)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    let phonenumber = await utils._GetPhoneNumber(e.detail.code)
    this.setData({
      inputphone: phonenumber,
      getnumbersuccess: true
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
    if(this.data.getnumbersuccess==true){
      this.setData({
        loginshow: false,
      })
      this.data.phoneremark="微信绑定手机号码"
      utils._NewMember(this.data.inputphone,this.data.phoneremark)
      this.setData({
        userphone:this.data.inputphone,
        statusinfo:"登记成功"
      })
      app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
    }else{
    if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {
      this.setData({
        loginshow: false,
      })
      this.data.phoneremark="短信验证手机号码"
      utils._NewMember(this.data.inputphone,this.data.phoneremark)
      this.setData({
        userphone:this.data.inputphone,
        statusinfo:"登记成功"
      })
      app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
    } else {
      utils._ErrorToast("验证码错误")
    }
  }
    console.log(app.globalData.Guserdata)
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
      params: options,
    })
    // 通过分享进入，执行用户登录操作
    await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    if (app.globalData.Guserdata.UserInfo.UserPhone != "") {
      this.setData({
        loginshow: false,
        userphone:app.globalData.Guserdata.UserInfo.UserPhone,
        statusinfo:"已是会员"
      })
    }
    wx.hideLoading()
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