const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onlinehidden: false,
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
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
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
            that._balanceupdate()
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
      success(res) {
        console.log("产品订单更新成功")
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
      success(res) {
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
          _openid: app.globalData.Ginviterid
        }).get({
          success: res => {
            console.log(res)
            this.setData({
              tempinviterbalance: res.data[0].Balance,
            })
            resolve(this.data.tempinviterbalance);
            console.log(this.data.tempinviterbalance)
          }
        })
      });
      let p3 = new Promise((resolve, reject) => {
        db.collection('USER').where({
          _openid: app.globalData.Gindirectinviterid
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
          _openid: app.globalData.Gopenid
        }).update({
          data: {
            Balance: app.globalData.Gbalance - that.data.consumepoints,
          },
          success(res) {
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
  // 保存到手机
  saveImage: function (event) {
    let that = this
    wx.getImageInfo({
      src: event.currentTarget.dataset.src,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (res) => {
            wx.showToast({
              title: '支付码保存成功，请从手机相册打开并扫码支付',
              duration: 2000
            })
          },
          fail: (err) => {
            console.log(err);
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              // this.openSettingBtnHidden = false
              that.setData({
                openSettingBtnHidden: false
              })
              wx.showToast({
                title: '缺少授权，请点击授权',
                icon: 'none',
                duration: 2000
              })
              // this.$apply()
            } else if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
              // this.openSettingBtnHidden = false
              that.setData({
                openSettingBtnHidden: true
              })
              wx.showToast({
                title: '取消保存',
                icon: 'none',
                duration: 2000
              })
              // this.$apply()
            } else if (err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
              // this.openSettingBtnHidden = false
              that.setData({
                openSettingBtnHidden: false
              })
              wx.showToast({
                title: '已拒绝授权，请点击重新授权',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //图片点击事件
  enlarge: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = [
      'cloud://cloud1-2gn7aud7a22c693c.7873-cloud1-2gn7aud7a22c693c-1304477809/omLS75Xib_obyxkVAahnBffPytcA/微信收款码.png',
      'cloud://cloud1-2gn7aud7a22c693c.7873-cloud1-2gn7aud7a22c693c-1304477809/omLS75Xib_obyxkVAahnBffPytcA/支付宝收款码.jpg'
    ]
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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
      wx.showToast({
        title: '请勿重复提交',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      if (this.data.address == "" || this.data.phone == "" || this.data.contacts == "" || this.data.date == "" || this.data.time == "") {
        wx.showToast({
          title: '请提供详细信息',
          icon: 'error',
          duration: 2000 //持续的时间
        })
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
            AddDate: new Date().toLocaleDateString()
          },
          success(res) {
            console.log('预约提交成功', res.data)
            wx.showToast({
              title: '预约提交成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail(res) {
            console.log("提交失败", res)
            wx.showToast({
              title: '预约提交失败',
              icon: 'error',
              duration: 2000 //持续的时间
            })
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
    var str = new Date()
    // 订单编号orderid、产品编号productid、产品名称productname、订单总费用totalfee、订单数据库database、微信即时支付是否隐藏onlinehidden
    this.setData({
      orderid: options.orderid,
      productid: options.productid,
      productname: options.productname,
      totalfee: options.totalfee,
      database: options.database,
      onlinehidden: options.onlinehidden,
      image: app.globalData.Gimagearray,
      // startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
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