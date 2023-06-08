const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var {
  _PLcheck,
} = require("../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventid:"",
    adddate: "",
    startdate: "",
    startdate1: "",
    startdate2: "",
    startdate3: "",
    plstartdate: "",
    promoterlevel: "",
    plname: "",
    // paymentid: "",
    productname: "",
    phone: "",
    orderid: "",
    orderlevel: "",
    orderstartdate: "",
    orderfee: "",
    ordername: "",
    applysublock: false,
    paymentsublock: false,
    phonehidden: false,
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
  bvPhoneUpdate() {
    wx.navigateTo({
      url: '../mine/userinfo'
    })
  },
  bvApply(e) {
    if (this.data.orderstartdate == "" || this.data.orderstartdate == 'undefined') {
      // 如果没有选择生效日期则提示
      wx.showToast({
        title: '请选择生效日期',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      if (this.data.applysublock == false && this.data.paymentsublock == false) {
        // 确认不是重复提交
        this.setData({
          orderlevel: e.currentTarget.dataset.level,
          orderstartdate: e.currentTarget.dataset.startdate,
          orderfee: e.currentTarget.dataset.price,
          ordername: e.currentTarget.dataset.name,
          // 生成订单号
          orderid: this._getGoodsRandomNumber(),
        })
        // this.data.orderlevel = e.currentTarget.dataset.level
        // this.data.orderstartdate = e.currentTarget.dataset.startdate
        // this.data.orderfee = e.currentTarget.dataset.price
        // this.data.ordername = e.currentTarget.dataset.name

      }
      this._orderadd()
      this._paymentadd()
    }
  },
  _orderadd(e) {
    let that = this
    if (this.data.applysublock) {
      // 控制页面组件显示和隐藏的参数是异步赋值的，因此需要在数据库操作执行前再次检查参数，避免重复提交
      that._hidden()
    } else {
      const db = wx.cloud.database()
      // 新增数据
      db.collection("PROMOTERORDER").add({
        data: {
          OrderId: this.data.orderid,
          PromoterLevel: this.data.orderlevel,
          PLName: this.data.ordername,
          PLStartDate: this.data.orderstartdate,
          TotalFee: this.data.orderfee,
          AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
          SysAddDate: new Date().getTime(),
          PaymentStatus: "unchecked",
          OrderStatus: "unchecked",
        },
        success(res) {
          console.log("promoter成功")
          // 下面好像不应该用that,直接用this就可以的，但是用that应该也没影响
          that.setData({
            applysublock: true
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

  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {
      // 控制页面组件显示和隐藏的参数是异步赋值的，因此需要在数据库操作执行前再次检查参数，避免重复提交
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          ProductId: this.data.orderlevel,
          ProductName: this.data.ordername,
          TotalFee: this.data.orderfee,
          AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
          OrderId: this.data.orderid,
          PaymentStatus: "unchecked",
          Database: "PROMOTERORDER"
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
    const goodsnum = this.data.orderid;
    const subMchId = '1612084242'; // 子商户号,微信支付商户号,必填
    const body = this.data.ordername;
    const PayVal = this.data.orderfee * 100;
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
            that._orderupdate();
            that._paymentupdate();
            that._userupdate();
            that.setData({
              paymenthidden: true
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
  _orderupdate() {
    const db = wx.cloud.database()
    db.collection('PROMOTERORDER').where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
        OrderStatus: "checked",
      },
      success(res) {
        console.log("商品订单付款成功")
      }
    })
  },
  _paymentupdate() {
    const db = wx.cloud.database()
    db.collection('PAYMENT').where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
      },
      success(res) {
        console.log("支付订单付款成功")
      },
    })
  },
  _userupdate() {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        PromoterLevel: this.data.orderlevel,
        PLStartDate: this.data.orderstartdate,
      },
      success(res) {
        console.log("支付订单付款成功")
      },
    })
  },
  bvOtherPay() {
    // 转到其他付款页面时，需要传递的参数orderid、productid、productname、totalfee、database
    wx.navigateTo({
      url: '../order/pay?orderid=' + this.data.orderid + '&productid=' + this.data.orderlevel + '&productname=' + this.data.ordername + '&totalfee=' + this.data.orderfee + '&database=PROMOTERORDER'
    })
  },
  // 随机生成支付订单号,订单号不能重复
  _getGoodsRandomNumber() {
    const date = new Date(); // 当前时间
    let Year = `${date.getFullYear()}`; // 获取年份
    let Month = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      }`; // 获取月
    let Day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`; // 获取天
    let hour = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }`; // 获取小时
    let min = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }`; // 获取分钟
    let sec = `${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`; // 获取秒
    let formateDate = `${Year}${Month}${Day}${hour}${min}${sec}`; // 时间
    return `${Math.round(Math.random() * 1000)}${formateDate +
      Math.round(Math.random() * 89 + 100).toString()}`;
  },
  onLoad: async function (options) {

    let that = this
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      // startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
      startdate:new Date().toLocaleDateString()
    })
    console.log(this.data.startdate)


    if (app.globalData.Guserdata.UserInfo.UserPhone != "" && app.globalData.Guserdata.UserInfo.UserPhone != "undefined") {
      // 手机号有效才执行
      this.setData({
        phone: app.globalData.Guserdata.UserInfo.UserPhone,
        phonehidden: true
      })
      // 进一步查询推广等级
      this._plcheck()
    } else {
      this.setData({
        plname: "普客",
      })
    }

  },
  // 查询推广等级
  _plcheck() {
    let that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      UserId: app.globalData.Guserid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
    }).orderBy('SysAddDate', 'desc').limit(1).get({
      // 根据添加日期排序并选择最后一个记录
      success: res => {
        console.log(res.data.length)
        if (res.data.length != 0) {
          this.setData({
            plname: res.data[0].PLName,
            promoterlevel: res.data[0].PromoterLevel,
            plstartdate: res.data[0].PLStartDate,
            plenddate:res.data[0].PLEndDate,
            paymentstatus: res.data[0].PaymentStatus,
            orderstatus: res.data[0].OrderStatus,

          })
        } else {
          this.setData({
            plname: "会员",
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
  // 有效推广用户数量
  _condition() {
    console.log("condition执行了")
    wx.getStorage({
      key: 'LDirectUser',
      success: res => {
        this.setData({
          directuser: res.data,
        })
        var directvalidfliter = [];
        for (var i = 0; i < this.data.directuser.length; i++) {
          if (this.data.directuser[i].UserInfo.UserPhone != "" && this.data.directuser[i].UserInfo.UserPhone != undefined) {
            directvalidfliter.push(this.data.directuser[i]);
          }
        }
        if ((directvalidfliter.length > 10 || directvalidfliter.length == 10 ) && directvalidfliter.length < 100) {
          this._btn1check()
          console.log("btn1执行了")
        } else if ((directvalidfliter.length > 100 || directvalidfliter.length == 100 )  && directvalidfliter.length < 300) {
          this._btn2check()
        } else if (directvalidfliter.length > 300 || directvalidfliter.length == 300 ) {
          this._btn3check()
        }
      }
    })
  },
  _btn1check() {
    if (this.data.promoterlevel == "member") {
      this.setData({
        btn1hidden: false
      })
      console.log("btn1执行了")
    }
  },
  _btn2check() {
    if (this.data.promoterlevel == "silver") {
      this.setData({
        btn2hidden: false
      })
      console.log("btn2执行了")
    }
  },
  _btn3check() {
    if (this.data.promoterlevel == "gold") {
      this.setData({
        btn3hidden: false
      })
      console.log("btn3执行了")
    }
  },
})