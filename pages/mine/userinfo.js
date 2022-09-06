const app = getApp()
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "获取验证码",
    currentTime: 60,
    disabled: false,
    s_phonecode: "",
    u_phonecode: "",
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    invitercompanyname: "",
    inviterusername: "",
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    username: "",
    userphone: "",
    useroldphone: "",
    result: "未发送",
    balance: "",
    usertype: "",
    adddate: "",
    updatedate: ""
  },
  changeTabs(e) {
    console.log(e.detail)
    if (e.detail.activeKey == "three") {
      this.setData({
        btnhidden: true
      })
    } else {
      this.setData({
        btnhidden: false
      })
    }
  },
  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvCompanyId(e) {
    this.setData({
      companyid: e.detail.value
    })
  },
  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvCompanyScale(e) {
    this.setData({
      companyscale: e.detail.value
    })
  },
  bvUserName(e) {
    this.setData({
      username: e.detail.value
    })
  },
  bvUserPhone(e) {
    this.setData({
      userphone: e.detail.value
    })
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
          disabled: false
        })
      }
    }, 1000)
  },
  bvSendCode() {
    let _this = this;
    this._SendCodeBtn()
    this.setData({
      disabled: true
    })
    wx.cloud.callFunction({
      name: 'sendsms',
      data: {
        mobile: _this.data.userphone,
        nationcode: '86'
      },
      success: res => {
        let code = res.result.res.body.params[0];
        let result = res.errMsg;
        if (result == "cloud.callFunction:ok") {
          _this.setData({
            result: "发送成功",
            s_phonecode: code
          })
        } else {
          _this.setData({
            result: "发送失败"
          })
        }
      },
      fail: err => {
        console.error('[云函数] [sendsms] 调用失败', err)
      }
    })
  },
  bvPhoneCode(e) {
    this.setData({
      u_phonecode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray
    })
    // 从本地存储中读取
    wx.getStorage({
      key: 'LInviter',
      success: res => {
        this.setData({
          invitercompanyname: res.data.CompanyName,
          inviterusername: res.data.UserName,
        })
      }
    })
    wx.getStorage({
      key: 'LUserInfo',
      success: res => {
        this.setData({
          companyname: res.data.CompanyName,
          companyid: res.data.CompanyId,
          businessscope: res.data.BusinessScope,
          companyscale: res.data.CompanyScale,
          username: res.data.UserName,
          userphone: res.data.UserPhone,
          useroldphone: res.data.UserPhone,
          usertype: res.data.UserType,
          balance: res.data.Balance,
          adddate: res.data.AddDate,
          updatedate: res.data.UpdateDate
        })
      }
    })
  },
  // 刷新信息
  RefreshData() {
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: app.globalData.Gopenid
    }).get({
      success: res => {
        wx.setStorageSync('LUserInfo', res.data[0]);
        this.setData({
          companyname: res.data[0].CompanyName,
          companyid: res.data[0].CompanyId,
          businessscope: res.data[0].BusinessScope,
          companyscale: res.data[0].CompanyScale,
          username: res.data[0].UserName,
          useroldphone: res.data[0].UserPhone,
          userphone: res.data[0].UserPhone,
          usertype: res.data[0].UserType,
          balance: res.data[0].Balance,
          adddate: res.data[0].AddDate,
          updatedate: res.data[0].UpdateDate,
        })
      }
    })
  },
  //修改数据操作
  UpdateData() {
    if (this.data.s_phonecode == this.data.u_phonecode && this.data.u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
      db.collection('USER').where({
        _openid: this.data.openid
      }).update({
        data: {
          CompanyName: this.data.companyname,
          CompanyId: this.data.companyid,
          CompanyScale: this.data.companyscale,
          BusinessScope: this.data.businessscope,
          UserName: this.data.username,
          UserPhone: this.data.userphone,
          UpdateDate: new Date().toLocaleDateString()
        },
        success(res) {
          wx.showToast({
            title: '更新信息成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })

        },
        fail(res) {
          wx.showToast({
            title: '更新信息失败',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
      // 根据用户是否已验证手机号，提供首次验证积分
      if (this.data.useroldphone == "") {
        console.log('加积分')
        const db = wx.cloud.database()
        db.collection("POINTS").add({
          data: {
            PersonalId: app.globalData.Gopenid,
            PersonalPoints: 50,
            ProductName: "会员手机认证",
            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleDateString(),
            PointsStatus: "checked",
          }, success(res) {
            wx.showToast({
              title: '积分更新信息成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })

          },
        })
        db.collection('USER').where({
          _openid: this.data.openid
        }).update({
          data: {
            Balance: 50,
          },
          success(res) {
            wx.showToast({
              title: '已获得50积分',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res) {

          }
        })
      }
    } else {
      wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 2000
      })

    }
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