const app = getApp()
var utils = require("../../utils/utils")
Page({

  data: {
    eventid: "",
    inviterPL: "",
    indirectinviterPL: "",
    // 轮播参数
    image: [],
    // 传入的参数
    pageParam: "",
    //新增数据变量
    // 编号
    productid: "",
    // 商品名称
    productname: "",
    // 办理地点
    issuedplace: "",
    discountorderid: "",
    orderid: "",
    discountid: "",
    discountname: "",
    discountlevel: "",
    discounthidden: true,
    singlediscounthidden: true,
    // 订单费用标准（根据客户身份赋值）
    orderprice: "",
    // 订单费用计算标准（根据客户身份赋值）
    orderpricecount: 0,
    count: 1,
    // 净服务费，自动计算
    servicesfee: 0,
    // 积分折减前总办理费用，自动计算
    temptotalfee: 0,
    tempmaxpoints: 0, //可用积分上限
    maxpoints: 0, //本次可用积分上限
    tempprofit: 0,
    profit: 0, //可分配收益
    // 可用积分
    balance: 0,
    // 本次使用积分
    consumepoints: 0,
    // 总办理费用，自动计算 
    totalfee: 0,
    // 消费积分计算
    inviterpoints: 0,
    indirectinviterpoints: 0,
    silverpoints: 0,
    goldpoints: 0,
    platinumpoints: 0,
    sublock: false,
    ordersublock: false,
    paymentsublock: false,
    submitted: false,
    btnhidden: true
  },

  onShow: function () {

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

  bvCount(e) {
    this.setData({
      count: e.detail.count,
      temptotalfee: this.data.orderpricecount * e.detail.count,
    })
    this._totalfee()
    this._maxpointscount()
  },
  bvConsumePoints(e) {
    this.setData({
      consumepoints: e.detail.count,
    })
    this._totalfee()
  },

  _totalfee() {
    // 计算总费用
    this.setData({
      totalfee: this.data.temptotalfee - (this.data.consumepoints / app.globalData.Gsetting.PointsMagnification),
    })
    console.log("总费用", this.data.totalfee)
    this._pointscount()
  },
  _maxpointscount() {
    this.setData({
      tempmaxpoints: this.data.tempprofit * this.data.count * app.globalData.Gsetting.PointsMagnification
    })
    console.log("此商品本次可用积分上限", this.data.tempmaxpoints)
    if (this.data.balance >= this.data.tempmaxpoints) {
      this.setData({
        maxpoints: this.data.tempmaxpoints
      })
    } else {
      this.setData({
        maxpoints: this.data.balance
      })
    }
    console.log("用户本次可使用积分上限", this.data.maxpoints)
  },
  _pointscount() {
    this.setData({
      profit: this.data.tempprofit * this.data.count - this.data.consumepoints / app.globalData.Gsetting.PointsMagnification
    })
    console.log("可分配毛利润", this.data.profit)
    this.setData({
      silverpoints: Math.floor(this.data.profit * 0.3) * app.globalData.Gsetting.PointsMagnification,
      goldpoints: Math.floor(this.data.profit * 0.6) * app.globalData.Gsetting.PointsMagnification,
      platinumpoints: Math.floor(this.data.profit * 0.6) * app.globalData.Gsetting.PointsMagnification
    })
    console.log("silverpoints", this.data.silverpoints)
    console.log("goldpoints", this.data.goldpoints)
    console.log("platinumpoints", this.data.platinumpoints)
    // 根据推荐人PL确认对应税分，铂金、黄金、白银有积分，其他没有积分
    if (this.data.inviterPL == "platinum") {
      this.setData({
        inviterpoints: this.data.platinumpoints
      })
    } else if (this.data.inviterPL == "gold") {
      this.setData({
        inviterpoints: this.data.goldpoints
      })
    } else if (this.data.inviterPL == "silver") {
      this.setData({
        inviterpoints: this.data.silverpoints
      })
    } else {
      this.setData({
        inviterpoints: 0
      })
    }
    console.log("inviterpoints", this.data.inviterpoints)
    if (this.data.indirectinviterPL == "platinum") {
      // 间接推荐人为铂金时才有积分奖励，数值等于白银积分，其他情况没有积分
      this.setData({
        indirectinviterpoints: this.data.silverpoints
      })
    } else {
      this.setData({
        indirectinviterpoints: 0
      })
    }
    console.log("indirectinviterpoints", this.data.indirectinviterpoints)
  },

  onLoad: async function (options) {
    // 通过两次调用PLcheck查询推荐人和间接推荐人当前的PL
    this.setData({
      image: app.globalData.Gimagearray,
    })

    let pl1 = await utils._PLcheck(app.globalData.Ginviterid)
    console.log(pl1)

    let pl2 = await utils._PLcheck(app.globalData.Gindirectinviterid)
    console.log(pl2)
    this.setData({
      inviterPL: pl1,
      indirectinviterPL: pl2
    })
    console.log(this.data.inviterPL, this.data.indirectinviterPL)

    //页面初始化 options为页面跳转所带来的参数
    console.log(options)
    let that = this;
    this.setData({
      pageParam: options,
      productid: options.productid,
      balance: app.globalData.Guserdata.TradeInfo.PromoteBalance,
    })
    console.log(this.data.pageParam)
    await utils._discountcheck()

    // 筛选指定记录
    var fliter = [];
    // var _this = this
    for (var i = 0; i < app.globalData.Gproduct.length; i++) {
      if (app.globalData.Gproduct[i]._id == this.data.productid) {
        fliter.push(app.globalData.Gproduct[i]);
      }
    }
    console.log(fliter);
    if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL1') {
      this.setData({
        orderpricecount: fliter[0].Price1Count,
        orderprice: fliter[0].Price1,
        temptotalfee: fliter[0].Price1Count,
        tempprofit: 0
      })
      console.log(this.data.orderprice)
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL2') {
      this.setData({
        orderpricecount: fliter[0].Price2Count,
        orderprice: fliter[0].Price2,
        temptotalfee: fliter[0].Price2Count,
        tempprofit: fliter[0].Price2Count - fliter[0].Price1Count
      })
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL3') {
      this.setData({
        orderpricecount: fliter[0].Price3Count,
        orderprice: fliter[0].Price3,
        temptotalfee: fliter[0].Price3Count,
        tempprofit: fliter[0].Price3Count - fliter[0].Price1Count
      })
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL4') {
      this.setData({
        orderpricecount: fliter[0].Price4Count,
        orderprice: fliter[0].Price4,
        temptotalfee: fliter[0].Price4Count,
        tempprofit: fliter[0].Price4Count - fliter[0].Price1Count
      })
    }
    console.log("总费用", this.data.orderprice)
    // 计算总费用
    this.setData({
      productname: fliter[0].ProductName,
    })
    console.log("客户计算价格", this.data.orderpricecount)
    this._totalfee()
    this._maxpointscount()
  },

  //跳转注册资料页面
  onClick: function () {
    wx.navigateTo({
      url: 'https://sm758rc5kj.jiandaoyun.com/f/5c221c18326ce11b6be21cca',
    })
  },
  bvSubmit() {
    this.setData({
      orderid: this._getGoodsRandomNumber(),
    })

    this._orderadd()
    this._paymentadd()
    this._pointsadd()
  },

  // 异步新增数据方法
  _orderadd() {
    let that = this
    // 判断是否重复提交
    if (this.data.ordersublock) {
      that._hidden()
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("ORDER").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          OrderPrice: this.data.orderprice,
          OrderPriceCount: this.data.orderpricecount,
          UserId: app.globalData.Guserid,
          //费用
          Count: this.data.count,
          TempTotalFee: this.data.temptotalfee,
          // Balance:this.data.balance,
          ConsumePoints: this.data.consumepoints,
          TotalFee: this.data.totalfee,

          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          OrderStatus: "unchecked",
        },
        success: res => {
          that.setData({
            ordersublock: true // 修改上传状态并返回前端
          })
          that._hidden()
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }

      })
    }
  },
  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          UserId: app.globalData.Guserid,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
        },
        success: res => {
          that.setData({
            paymentsublock: true
          })
          that._hidden()
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
  },
  _pointsadd() {

    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("POINTS").add({
        data: {
          PointsType: "trade",
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          UserId: app.globalData.Guserid,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          // 直接推荐人
          InviterId: app.globalData.Ginviterid,
          InviterPL: this.data.inviterPL,
          InviterPoints: this.data.inviterpoints,
          // 间接推荐人
          IndirectInviterId: app.globalData.Gindirectinviterid,
          IndirectInviterPL: this.data.indirectinviterPL,
          IndirectInviterPoints: this.data.indirectinviterpoints,
          // 本人消耗的积分
          ConsumeId: app.globalData.Guserid,
          ConsumePoints: this.data.consumepoints,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          PointsStatus: "unchecked",
        },
        success: res => {
          that.setData({
            paymentsublock: true
          })
          that._hidden()
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
  },
  _hidden() {
    if (this.data.ordersublock == true && this.data.paymentsublock == true) {
      this.setData({
        submitted: true
      })
      utils._SuccessToast("订单提交成功")
    }
  },
  bvPay() {
    wx.navigateTo({
      // 转到付款页面时，需要传递的参数orderid、productid、productname、totalfee、database
      url: '../order/pay?orderid=' + this.data.orderid + '&productid=' + this.data.productid + '&productname=' + this.data.productname + '&totalfee=' + this.data.totalfee + '&database=ORDER'
    })
  }
})