const app = getApp()
const utils = require("../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payalready: false,
    booklock: false,
    address: "",
    phone: "",
    contacts: "",
    data: "",
    time: "",
    orderid: "",
    productid: "",
    productname: "",
    totalfee: 0,
    database: "",
    consumepoints: 0,
    inviterpoints: 0,
    indirectinviterpoints: 0,
    tempinviterbalance: 0,
    tempindirectinviterbalance: 0,
    inviterbalance: 0,
    indirectinviterbalance: 0,
    openSettingBtnHidden: true,
    // 轮播头图
    image: [],
  },
  // 点击支付按钮,发起支付
  bvWXPay(event) {
    const goodsnum = this.data.orderid;
    const subMchId = '1612084242'; // 子商户号,微信支付商户号,必填
    const body = this.data.productname;
    const PayVal = this.data.totalfee * 100;
    this._callWXPay(body, goodsnum, subMchId, PayVal);
  },
  // 请求questionPay云函数,调用支付能力
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
            that.setData({
              payalready: true
            })
            that._orderupdate();
            that._pointsupdate();
            that._discountupdate();
            that._balanceupdate();
            // 调用云函数发短信给管理员
            var tempmobile = [18954744612]
            wx.cloud.callFunction({
              name: 'sendsms',
              data: {
                templateId: "1569097",
                nocode: true,
                mobile: tempmobile
              },
              success: res => {
                console.log(res)
              },
              fail: res => {
                console.log(res)
              },
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
  // 测试支付成功的函数
  // bvTest(){
  //   this._balanceupdate()
  // },

  _orderupdate() {
    const db = wx.cloud.database()
    db.collection(this.data.database).where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
        OrderStatus: "checked",
        Available: true,
      },
      success: res => {
        console.log("商品订单更新成功")
      }
    })
  },
  _pointsupdate() {
    const db = wx.cloud.database()
    db.collection('POINTS').where({
      OrderId: this.data.orderid
    }).update({
      data: {
        PaymentStatus: "checked",
        PointsStatus: "checked",
      },
      success: res => {
        console.log("积分状态更新成功")
      },
    })
  },
  _discountupdate() {
    console.log("discountupdate已执行")
    if (this.data.productid == "DL3_Single") {
      const db = wx.cloud.database()
      db.collection("DISCOUNTORDER").where({
        OrderId: this.data.orderid
      }).update({
        data: {
          Available: false
        }
      })
    }
  },
  _balanceupdate() {
    let that = this
    if (this.data.database == "ORDER") {
      const db = wx.cloud.database()
      let p1 = new Promise((resolve, reject) => {
        db.collection('POINTS').where({
          OrderId: this.data.orderid
        }).get({
          success: res => {
            console.log(res.data[0].InviterPoints)
            this.setData({
              consumepoints: res.data[0].ConsumePoints,
              inviterpoints: res.data[0].InviterPoints,
              indirectinviterpoints: res.data[0].IndirectInviterPoints,
            })
            resolve(this.data.inviterpoints, this.data.indirectinviterpoints);
            console.log(this.data.indirectinviterpoints)
          }
        })
      });
      let p2 = new Promise((resolve, reject) => {
        db.collection('USER').where({
          UserId: app.globalData.Ginviterid
        }).get({
          success: res => {
            console.log(res)
            this.setData({
              tempinviterbalance: res.data[0].TradeInfo.Balance,
            })
            resolve(this.data.tempinviterbalance);
            console.log(this.data.tempinviterbalance)
          }
        })
      });
      let p3 = new Promise((resolve, reject) => {
        db.collection('USER').where({
          UserId: app.globalData.Gindirectinviterid
        }).get({
          success: res => {
            console.log(res)
            this.setData({
              tempindirectinviterbalance: res.data[0].Balance,
            })
            resolve(this.data.tempindirectinviterbalance);
            console.log(this.data.tempindirectinviterbalance)
          }
        })
      });
      Promise.all([p1, p2, p3]).then(res => {
        that.setData({
          inviterbalance: that.data.tempinviterbalance + that.data.inviterpoints,
          indirectinviterbalance: that.data.tempindirectinviterbalance + that.data.indirectinviterpoints,
        })
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            Balance: app.globalData.Guserdata.UserInfo.Balance - that.data.consumepoints,
          },
          success: res => {
            console.log("个人积分更新成功")
          }
        })
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'BalanceUpdate',
          // 传递给云函数的参数
          data: {
            id: app.globalData.Ginviterid,
            balance: that.data.inviterbalance,
          },
          success: res => {
            console.log(res)
            console.log("直接推荐人积分更新成功")
          },
        })
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'BalanceUpdate',
          // 传递给云函数的参数
          data: {
            id: app.globalData.Gindirectinviterid,
            balance: that.data.indirectinviterbalance,
          },
          success: res => {
            console.log(res)
            console.log("间接推荐人积分更新成功")
          },
        })
      });
    }
  },

  bvTime(e) {
    this.setData({
      time: e.detail.value,
    })
  },
  bvDate(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  bvContacts(e) {
    this.setData({
      contacts: e.detail.value,
    })
  },
  bvPhone(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  bvAddress(e) {
    this.setData({
      address: e.detail.value,
    })
  },
  bvBooking(e) {
    // 判断是否重复提交
    if (this.data.booklock) {
      // 锁定时很执行
      utils._ErrorToast("请勿重复提交")
    } else {
      if (this.data.address == "" || this.data.phone == "" || this.data.contacts == "" || this.data.date == "" || this.data.time == "") {
        utils._ErrorToast("请提供详细信息")
      } else {
        // 未锁定时执行
        // 获取数据库引用
        const db = wx.cloud.database()
        db.collection('BOOKING').add({
            data: {
              Address: this.data.address,
              Phone: this.data.phone,
              Contacts: this.data.contacts,
              BookingDate: this.data.date,
              BookingTime: this.data.time,
              BookingContent: "上门取款服务",
              BookingStatus: "unchecked",
              AddDate: new Date().toLocaleString('chinese',{ hour12: false })
            },
            success: res => {
              console.log('预约提交成功', res.data)
              utils._SuccessToast("预约提交成功")
            },
            fail: res => {
              console.log("提交失败", res)
              utils._ErrorToast("预约提交失败")
            }
          }),
          this.data.booklock = true // 修改上传状态为锁定
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 订单编号orderid、商品编号productid、商品名称productname、订单总费用totalfee、订单数据库database
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      orderid: options.orderid,
      productid: options.productid,
      productname: options.productname,
      totalfee: options.totalfee,
      database: options.database,
      image: app.globalData.Gimagearray,
    })
    wx.hideLoading()
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