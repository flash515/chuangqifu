// components/loginmask/loginmask.js
const app = getApp()
const utils = require("../../utils/utils");
Component({
  //properties为接收父组件传过来的参数
  properties: {

  },
  data: {
    // 登录框相关变量
    getnumbersuccess: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone: "",
    phoneremark: "",
    s_phonecode: "",
    u_phonecode: "",
  },
  methods: {
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
      var interval = setInterval(function () {
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

    bvPhoneCode(e) {
      this.data.u_phonecode = e.detail.value
    },

    bvLogin: async function (e) {
      if (this.data.inputphone == "998189" && this.data.u_phonecode == "981899") {
        // 使用测试账号登录
        this.triggerEvent('myevent', {
          loginshow: false,
          loginbtnshow: false,
          userphone: this.data.inputphone,
        });
        utils._NewMember(this.data.inputphone, this.data.phoneremark)
        app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
      } else {
        // 如果通过授权得到手机号，跳过验证码验证环节
        if (this.data.getnumbersuccess == true) {
          this.triggerEvent('myevent', {
            loginshow: false,
            loginbtnshow: false,
            userphone: this.data.inputphone,
          });
          this.data.phoneremark = "微信绑定手机号码"
          utils._NewMember(this.data.inputphone, this.data.phoneremark)
          utils._RegistPointsAdd()
          utils._SendNewUserSMS()
          app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
        } else {
          if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {

            this.triggerEvent('myevent', {
              loginshow: false,
              loginbtnshow: false,
              userphone: this.data.inputphone,
            });
            this.data.phoneremark = "短信验证手机号码"
            utils._NewMember(this.data.inputphone, this.data.phoneremark)
            utils._RegistPointsAdd()
            utils._SendNewUserSMS()
            app.globalData.Guserdata.UserInfo.UserPhone = this.data.inputphone
          } else {
            utils._ErrorToast("验证码错误")
          }
        }
        console.log(app.globalData.Guserdata)
      }
    },
    onHideMaskTap: function () {
      this.triggerEvent('myevent', {
        loginshow: false,
      });
    },
  }
})