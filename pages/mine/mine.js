var app = getApp()
Page({
  data: {
    usertype: "",
    balance: 0,
    direct30user: [],
    directuser: [],
    //用于展示当前优惠折扣的变量
    dlname: "",
    dladddate: "",
    dlstartdate: "",
    dlenddate: "",
    // 展示优惠级别的变量
    promotername: "",
    pladddate: "",
    plstartdate: "",
    plenddate: "",

    // 轮播头图
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

  bvGoToShareValue() {
    if (app.globalData.Gpromoterlevel == "normal") {
      wx.showModal({
        title: '提示',
        content: '您尚未取得推广大使资格，是否转到资格购买页面？',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
            wx.navigateTo({
              url: '../mine/promoterorder',
            })
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../mine/sharevalue',
      })
    }
  },
  bvSubMessage(e) {
    wx.requestSubscribeMessage({ //获取下发权限
      tmplIds: ['iy3UdrGZA0baP3tG-vhbC033PAYeBfrXjLFjtfbr0yE', 'Z1znM-MaX0eQKsXJNJxuu4oetRGDnTXM4AiO6AR0Rww'],
      success: (res) => {

      }
    })
  },
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Gusertype,
      balance: app.globalData.Gbalance,
    })
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
    //查询直接用户及30天内直接用户
    wx.getStorage({
      key: 'LDirectUser',
      success: res => {
        this.setData({
          directuser: res.data,
        })
        var directvalidfliter = [];
        for (var i = 0; i < this.data.directuser.length; i++) {
          if (this.data.directuser[i].avatarUrl != "" && this.data.directuser[i].avatarUrl != undefined) {
            directvalidfliter.push(this.data.directuser[i]);
          }
        }
        this.setData({
          directvaliduser: directvalidfliter,
        })
      }
    }),
    // 查询优惠等级
    this._dlcheck()
    // 查询推广级别
    this._plcheck()
  },
  _dlcheck() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
      Available: true
    }).orderBy('OrderId', 'desc').get({
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              tempfliter.push(res.data[i]);
            }
          }
          if (tempfliter.length != 0 && tempfliter.length != undefined) {
            console.log(tempfliter)
            this.setData({
              dladddate: tempfliter[0].AddDate,
              dlstartdate: tempfliter[0].DLStartDate,
              dlenddate: tempfliter[0].DLEndDate,
              paymentstatus: tempfliter[0].PaymentStatus,
              orderstatus: tempfliter[0].OrderStatus,
            })
            if (tempfliter[0].DiscountLevel == "DL1") {
              this.setData({
                dlname: "特惠折扣价"
              })
            } else if (tempfliter[0].DiscountLevel == "DL2") {
              this.setData({
                dlname: "巨惠折扣价"
              })
            } else if (tempfliter[0].DiscountLevel == "DL3") {
              this.setData({
                dlname: "折扣价"
              })
            } else if (tempfliter[0].DiscountLevel == "DL4") {
              this.setData({
                dlname: "原价"
              })
            }
          } else {
            //卡券已过期
            this.setData({
              dlname: "原价"
            })
          }
        } else {
          //没有卡券
          this.setData({
            dlname: "原价",
          })
        }
      }
    })

  },
  // 查询推广等级
  _plcheck() {
    let that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
    }).orderBy('OrderId', 'desc').limit(1).get({
      success: res => {
        console.log(res.data.length)
        if (res.data.length != 0) {
          this.setData({
            pladddate: res.data[0].AddDate,
            plstartdate: res.data[0].PLStartDate,
            plenddate: res.data[0].PLEndDate,
            promoterlevel: res.data[0].PromoterLevel,
            paymentstatus: res.data[0].PaymentStatus,
            orderstatus: res.data[0].OrderStatus,
            promotername: res.data[0].PromoterName,
          })
        } else {
          this.setData({
            promotername: "会员",
          })
          console.log("会员执行了")
        }
        // 进一步查询是否符合新条件
        this._condition()
      },
      fail: res => {
        wx.showToast({
          title: '查询失败请刷新',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    })
  },
  onShow: function () {

  },
})