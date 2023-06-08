const {
  dateLater
} = require("../../utils/getDates.js")
const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adddate:"",
    startdate: "",
    //用于展示当前优惠折扣的变量
    dlname:"",
    dlstartdate:"",
    dlenddate:"",
    // 当前页面订单中的变量
    orderid: "",
    discountid: "",
    discountlevel: "",
    discountname:"",
    discountstartdate:"",
    discountenddate:"",
    discounttotalfee:"",
    discounttype:"",

    orderhidden:true,
    ordersublock: false,
    paymenthidden:false,
    paymentsublock: false,

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

  },
  bvDL3_360(e) {
    this.setData({
      dl3_360startdate: e.detail.value,
      dl3_360enddate: dateLater(e.detail.value, 360).year + '-' + dateLater(e.detail.value, 360).newdates
    })
  },
  bvDL3_180(e) {
    this.setData({
      dl3_180startdate: e.detail.value,
      dl3_180enddate: dateLater(e.detail.value, 180).year + '-' + dateLater(e.detail.value, 180).newdates
    })
  },
  bvDL3_90(e) {
    this.setData({
      dl3_90startdate: e.detail.value,
      dl3_90enddate: dateLater(e.detail.value, 90).year + '-' + dateLater(e.detail.value, 90).newdates
    })
  },
  bvDL3_30(e) {
    this.setData({
      dl3_30startdate: e.detail.value,
      dl3_30enddate: dateLater(e.detail.value, 30).year + '-' + dateLater(e.detail.value, 30).newdates
    })
  },
  bvBuy(e) {
    if (e.currentTarget.dataset.startdate == "" || e.currentTarget.dataset.startdate == undefined) {
      // 未选定日期时弹窗
      wx.showToast({
        title: '请选择生效日期',
        icon: 'error',
        duration: 2000 //持续的时间
      })
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
        wx.showToast({
          title: '请勿重复提交',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
      }
  },
  _orderadd(){
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
        success(res) {
          that.setData({
            ordersublock: true
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
        success(res) {
          console.log("paymentadd成功")
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
    if (this.data.ordersublock == true && this.data.paymentsublock == true) {
      this.setData({
        orderhidden: false,
      })
    }
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
    // 点击支付按钮,发起支付
    bvWXPay(event) {
      const goodsnum = this.data.paymentid;
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
    _orderupdate() {
      const db = wx.cloud.database()
      db.collection('DISCOUNTORDER').where({
        OrderId: this.data.orderid
      }).update({
        data: {
          PaymentStatus: "checked",
          OrderStatus: "checked",
          Available:true
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
    _userupdate(){
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
        success(res) {
          console.log("用户信息更新成功")
        },
      })
    },
    bvOtherPay() {
      wx.navigateTo({
        url: '../order/pay?orderid=' +this.data.orderid+'&productid=' + this.data.discountid+'&productname=' + this.data.discountname + '&totalfee=' + this.data.discounttotalfee +  '&database=DISCOUNTORDER'
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })
    // 查询当前的价格折扣卡
    console.log(this.data.startdate)
    // let that=this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
      UserId: app.globalData.Guserid,
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
              adddate: tempfliter[0].AddDate,
              dlstartdate: tempfliter[0].DLStartDate,
              dlenddate: tempfliter[0].DLEndDate,
              paymentstatus: tempfliter[0].PaymentStatus,
              orderstatus: tempfliter[0].OrderStatus,
            })
            if (tempfliter[0].DiscountLevel == "DL1") {
              this.setData({
                dlname: "员工折扣价"
              })
            } else if (tempfliter[0].DiscountLevel == "DL2") {
              this.setData({
                dlname: "渠道折扣价"
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
    	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => startToTrack(),
  onShow: function () {
    startToTrack()
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
    startByBack()
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