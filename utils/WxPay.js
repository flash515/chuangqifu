const app = getApp()
const utils = require("../utils/utils")
function bvBuy(e) {
  if (e.currentTarget.dataset.startdate == "" || e.currentTarget.dataset.startdate == undefined) {
    // 未选定日期时弹窗
    utils._ErrorToast("请选择生效日期")
  } else {
    if (this.data.ordersublock == false && this.data.paymentsublock == false) {
      this.setData({
        discountlevel: e.currentTarget.dataset.level,
        discountid: e.currentTarget.dataset.id,
        discountname: e.currentTarget.dataset.name,
        discountstartdate: e.currentTarget.dataset.startdate,
        discountenddate: e.currentTarget.dataset.enddate,
        discounttotalfee: e.currentTarget.dataset.price,
        discounttype:e.currentTarget.dataset.type,
        // 生成订单号
        orderid:this._getGoodsRandomNumber(),
      })
      this._orderadd()
      this._paymentadd()
    }else {
      utils._ErrorToast("请勿重复提交")
    }
    }
}
function _orderadd(){
  let that = this
  if (this.data.ordersublock) {
    that._hidden()
  } else {
    const db = wx.cloud.database()
    // 新增数据
    db.collection("DISCOUNTORDER").add({
      data: {
        OrderId:this.data.orderid,
        DiscountLevel: this.data.discountlevel,
        DiscountId: this.data.discountid,
        DiscountName: this.data.discountname,
        DiscountType: this.data.discounttype,
        DLStartDate: this.data.discountstartdate,
        DLEndDate: this.data.discountenddate,
        TotalFee: this.data.discounttotalfee,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
        PaymentStatus:"unchecked",
        OrderStatus:"unchecked",
        Available:false
      },
      success: res => {
        that.setData({
          ordersublock: true
        })
        that._hidden()
      },
      fail: res => {
        utils._ErrorToast("提交失败请重试")
      }
    })
  }
}
function _paymentadd() {
  let that = this
  if (this.data.paymentsublock) {
    that._hidden()
  } else {
    const db = wx.cloud.database()
    db.collection("PAYMENT").add({
      data: {
        OrderId:this.data.orderid,
        ProductId: this.data.discountid,
        ProductName: this.data.discountname,
        TotalFee: this.data.discounttotalfee,
        AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
        PaymentStatus: "unchecked",
        Database:"DISCOUNTORDER"
      },
      success: res => {
        console.log("paymentadd成功")
        that.setData({
          paymentsublock: true,
        })
        that._hidden()
      },
      fail: res => {
        utils._ErrorToast("提交失败请重试")
      }
    })
  }
}

// 随机生成支付订单号,订单号不能重复
function _getGoodsRandomNumber() {
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
}
  // 点击支付按钮,发起支付
  function bvWXPay(event) {
    const goodsnum = this.data.paymentid;
    const subMchId = '1612084242'; // 子商户号,微信支付商户号,必填
    const body = this.data.ordername;
    const PayVal = this.data.orderfee * 100;
    this._callWXPay(body, goodsnum, subMchId, PayVal);
  }
  // 请求WXPay云函数,调用支付能力
  function _callWXPay(body, goodsnum, subMchId, payVal) {
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
  }
  function _orderupdate() {
    const db = wx.cloud.database()
    db.collection('DISCOUNTORDER').where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
        OrderStatus: "checked",
        Available:true
      },
      success: res => {
        console.log("商品订单付款成功")
      }
    })
  }
  function _paymentupdate() {
    const db = wx.cloud.database()
    db.collection('PAYMENT').where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
      },
      success: res => {
        console.log("支付订单付款成功")
      },
    })
  }
  function _userupdate(){
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ['TradeInfo.DiscountLevel']: this.data.orderlevel,
        ['TradeInfo.DLStartDate']:this.data.orderstartdate,
        ['TradeInfo.DLEndDate']:this.data.orderenddate,
        ['TradeInfo.DLUpdateTime']:new Date().toLocaleString('chinese',{ hour12: false }),
      },
      success: res => {
        console.log("用户信息更新成功")
      },
    })
  }
  module.exports = {
  _getGoodsRandomNumber:_getGoodsRandomNumber,
  _orderupdate:_orderupdate,
  _orderupdate:  _orderupdate,
  _paymentupdate:  _paymentupdate,
  _userupdate:  _userupdate,
  }