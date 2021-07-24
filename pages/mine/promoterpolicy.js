const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adddate: "",
    startdate: "",
    startdate1: "",
    startdate2: "",
    startdate3: "",
    plstartdate: "",
    promoterlevel: "",
    promotername: "",
    totalfee: "",
    paymentid: "",
    productname: "",
    applysublock: false,
    paymentsublock: false,
    applyhidden: false,
    paymenthidden: true,
    btn1hidden: true,
    btn2hidden: true,
    btn3hidden: true,
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
  },
  bvStartDate1(e) {
    this.setData({
      startdate1: e.detail.value,
    })
  },
  bvStartDate2(e) {
    this.setData({
      startdate2: e.detail.value,
    })
  },
  bvStartDate3(e) {
    this.setData({
      startdate3: e.detail.value,
    })
  },
  bvApply(e) {
    let that = this
    this.data.promoterlevel = e.currentTarget.dataset.level
    this.data.promotername = e.currentTarget.dataset.name
    this.data.plstartdate = e.currentTarget.dataset.startdate
    this.data.totalfee = e.currentTarget.dataset.price
    this.data.productname = e.currentTarget.dataset.name
    this.data.paymentid = this._getGoodsRandomNumber();
    if (this.data.plstartdate == "" || this.data.plstartdate == undefined) {
      wx.showToast({
        title: '请选择生效日期',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      if (this.data.applysublock) {} else {
        const db = wx.cloud.database()
        // 新增数据
        db.collection("PROMOTERORDER").add({
          data: {
            PromoterLevel: this.data.promoterlevel,
            PromoterName: this.data.promotername,
            PLStartDate: this.data.plstartdate,
            TotalFee: this.data.totalfee,
            AddDate: new Date().toLocaleDateString(),
            SysAddDate: new Date().getTime(),
            PaymentId: this.data.paymentid,
            PaymentStatus: "unchecked",
            OrderStatus: "unchecked",
          },
          success(res) {
            console.log("promoter成功")
            that.setData({
              applysublock: true
            })
            that._paymentadd()
          },
          fail(res) {
            wx.showToast({
              title: '提交失败请重试',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        })
      }
    }
  },

  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {} else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          ProductId: this.data.promoterlevel,
          ProductName: this.data.promotername,
          TotalFee: this.data.totalfee,
          AddDate: new Date().toLocaleDateString(),
          PaymentId: this.data.paymentid,
          PaymentStatus: "unchecked",
          Database:"PROMOTERORDER"
        },
        success(res) {
          console.log("payment成功")
          that.setData({
            paymentsublock: true,
          })
          that._hidden()
        },
        fail(res) {
          wx.showToast({
            title: '提交失败请重试',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
    }
  },
  _hidden() {
    if (this.data.applysublock == true && this.data.paymentsublock == true) {
      this.setData({
        paymenthidden: false,
        applyhidden: true,
      })
    }
  },
  // 点击支付按钮,发起支付
  bvWXPay(event) {
    const goodsnum = this.data.paymentid;
    const subMchId = '1612084242'; // 子商户号,微信支付商户号,必填
    const body = this.data.promotername;
    const PayVal = this.data.totalfee * 100;
    this._callWXPay(body, goodsnum, subMchId, PayVal);
  },
  // 请求WXPay云函数,调用支付能力
  _callWXPay(body, goodsnum, subMchId, payVal) {
    let that = this
    wx.cloud.callFunction({
        name: 'WXPay',
        data: {
          // 需要将data里面的参数传给WXPay云函数
          body,
          goodsnum, // 商品订单号不能重复
          subMchId, // 子商户号,微信支付商户号,必填
          payVal, // 这里必须整数,不能是小数,而且类型是number,否则就会报错
        },
      })
      .then((res) => {
        console.log(res);
        const payment = res.result.payment;
        console.log(payment); // 里面包含appId,nonceStr,package,paySign,signType,timeStamp这些支付参数
        wx.requestPayment({
          // 根据获取到的参数调用支付 API 发起支付
          ...payment, // 解构参数appId,nonceStr,package,paySign,signType,timeStamp
          success: (res) => {
            console.log('支付成功', res);
            that._productupdate();
            that._paymentupdate();
            that.setData({
              paymenthidden:true
            })
          },
          fail: (err) => {
            console.error('支付失败', err);
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  _productupdate() {
    const db = wx.cloud.database()
    db.collection('PROMOTERORDER').where({
      PaymentId: this.data.paymentid
    }).update({
      data: {
        PaymentStatus: "checked",
        OrderStatus: "checked",
      },
      success(res) {
        console.log("产品订单付款成功")
      }
    })
  },
  _paymentupdate() {
    const db = wx.cloud.database()
    db.collection('PAYMENT').where({
      PaymentId: this.data.paymentid
    }).update({
      data: {
        PaymentStatus: "checked",
      },
      success(res) {
        console.log("支付订单付款成功")
      },
    })
  },
  bvOtherPay() {
    wx.navigateTo({
      url: '../order/pay?totalfee=' + this.data.totalfee + '&productname=' + this.data.promotername + '&paymentid=' + this.data.paymentid+'&database=PROMOTERORDER'
    })
  },
  // 随机生成支付订单号,订单号不能重复
  _getGoodsRandomNumber() {
    const date = new Date(); // 当前时间
    let Year = `${date.getFullYear()}`; // 获取年份
    let Month = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }`; // 获取月
    let Day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`; // 获取天
    let hour = `${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }`; // 获取小时
    let min = `${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`; // 获取分钟
    let sec = `${
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  }`; // 获取秒
    let formateDate = `${Year}${Month}${Day}${hour}${min}${sec}`; // 时间
    return `${Math.round(Math.random() * 1000)}${formateDate +
    Math.round(Math.random() * 89 + 100).toString()}`;
  },
  onLoad: function (options) {
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
        if (directvalidfliter.length >= 1 && directvalidfliter.length < 100) {
          this.setData({
            btn1hidden: false
          })
        } else if (directvalidfliter.length >= 100 && directvalidfliter.length < 300) {
          this.setData({
            btn2hidden: false
          })
        } else if (directvalidfliter.length >= 300) {
          this.setData({
            btn3hidden: false
          })
        }
      }
    })
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })
    console.log(this.data.startdate)
    // let that=this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
    }).orderBy('SysAddDate', 'desc').limit(1).get({
      success: res => {
        console.log(res.data.length)
        if (res.data.length != 0) {
          this.setData({
            adddate: res.data[0].AddDate,
            plstartdate: res.data[0].PLStartDate,
            promoterlevel: res.data[0].PromoterLevel,
            paymentstatus: res.data[0].PaymentStatus,
            orderstatus: res.data[0].OrderStatus,
            promotername: res.data[0].PromoterName,
          })
        } else {
          this.setData({
            promotername: "普客",
          })
        }
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

})