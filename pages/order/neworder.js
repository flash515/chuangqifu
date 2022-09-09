const app = getApp()
Page({

  data: {
    avatarUrl: "",
    nickName: "",
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
    // 传入的参数
    pageParam: "",
    //新增数据变量
    // 产品编号
    productid: "",
    // 产品名称
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
    // 可用积分
    balance: 0,
    // 本次使用积分
    consumepoints: 0,
    // 总办理费用，自动计算 
    totalfee: 0,
    // 推荐人积分计算
    commissiontype: "",
    // 直接推荐人，自动计算
    inviterpoints: 0,
    // 间接推荐人积分，自动计算
    indirectinviterpoints: 0,
    commission1total: 0,
    // 间接推荐人，自动计算
    commission2total: 0,
    sublock: false,
    ordersublock: false,
    paymentsublock: false,
    submitted: false,
    btnhidden: true
  },

  onShow: function () {
    this.setData({
      image: app.globalData.Gimagearray,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
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

  bvCount(e) {
    this.setData({
      count: e.detail.count,
      temptotalfee: this.data.orderpricecount * e.detail.count,
    })
    this._totalfee()
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
      totalfee: this.data.temptotalfee - (this.data.consumepoints / app.globalData.Gpointsmagnification),
    })
    // 每笔订单计算推荐人和间接推荐人的积分
    console.log("pointscount执行了")
    if (app.globalData.Ginviterpromoterlevel == "normal" || app.globalData.Ginviterpromoterlevel == "member") {
      this.setData({
        inviterpoints: 0
      })
      console.log("normal执行了")
    }
    else if (app.globalData.Ginviterpromoterlevel == "sliver") {
      this.setData({
        inviterpoints: Math.trunc(this.data.totalfee * 0.1 * app.globalData.Gpointsmagnification)
      })
      console.log("sliver执行了")
    }
    else if (app.globalData.Ginviterpromoterlevel == "gold") {
      this.setData({
        inviterpoints: Math.trunc(this.data.totalfee * 0.2 * app.globalData.Gpointsmagnification)
      })
      console.log("gold执行了")
      console.log(this.data.totalfee)
      console.log(this.data.inviterpoints)
    }
    else if (app.globalData.Ginviterpromoterlevel == "platinum") {
      this.setData({
        inviterpoints: Math.trunc(this.data.totalfee * 0.2 * app.globalData.Gpointsmagnification)
      })
      console.log("inviterpromoterlevel执行了")
    }
    if (app.globalData.Gindirectinviterpromoterlevel == "platinum") {
      this.setData({
        indirectinviterpoints: Math.trunc(this.data.totalfee * 0.1 * app.globalData.Gpointsmagnification)
      })
      console.log("indirectinviterpromoterlevel执行了")
    }
    else {
      this.setData({
        indirectinviterpoints: 0
      })
    }
  },
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    let that = this;
    this.setData({
      pageParam: options,
      productid: options.productid,
      productname: options.productname,
      issuedplace: options.issuedplace,
      balance: app.globalData.Gbalance,
      consumepoints: app.globalData.Gbalance,
    })
    // 通过两个promise嵌套，顺序执行获得计算结果
    let P = new Promise((resolve, reject) => {

      let P1 = new Promise((resolve, reject) => {
        //查询是否有购买折扣记录，index页面已实时查询过，但不排除本次登录有购买折扣的情况，所以需要再次实时查询
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('DISCOUNTORDER').where({
          _openid: app.globalData.Gopenid,
          PaymentStatus: "checked",
          OrderStatus: "checked",
          Available: true,
        }).orderBy('OrderId', 'desc').get({
          success: res => {
            console.log(res)
            if (res.data.length != 0) {
              //如果有购买记录则执行，进一步筛选当前有效的折扣订单

              var tempfliter = []
              for (var i = 0; i < res.data.length; i++) {
                if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
                  //如果有在有效期内的折扣，则给tempfliter赋值
                  tempfliter.push(res.data[i]);
                }
              }
              console.log(this.data.tempfliter)

              if (tempfliter.length != 0 && tempfliter.length != undefined) {
                //tempfliter不为空时（有效的折扣），给参数赋值
                console.log(tempfliter)
                this.setData({
                  discountorderid: tempfliter[0]._id,
                  discountid: tempfliter[0].DiscountId,
                  discounthidden: false,
                  discountname: tempfliter[0].DiscountName,
                  discountlevel: tempfliter[0].DiscountLevel,
                  adddate: tempfliter[0].AddDate,
                  dlstartdate: tempfliter[0].DLStartDate,
                  dlenddate: tempfliter[0].DLEndDate,

                })
              }
              else {
                //如果没有在有效期内的折扣，则直接给参数赋值
                this.setData({
                  discountlevel: "DL4",
                  discounthidden: true,
                })
                console.log(this.data.discountlevel)
              }
            }
            else {
              // 如果没有折扣卡购买记录，直接赋值
              this.setData({
                discountlevel: "DL4",
                discounthidden: true,
              })
            }
            console.log(this.data.discountlevel)
            resolve(this.data.discountlevel);
          }
        })
      });
      P1.then(res => {
        // 从本地存储中读取客户价格
        wx.getStorage({
          key: 'LProductList',
          success: res => {
            console.log("产品数组", res.data)
            // 筛选指定记录
            var fliter = [];
            // var _this = this
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].ProductId == this.data.productid) {
                fliter.push(res.data[i]);
              }
            }
            console.log(fliter);
            if (app.globalData.Gdiscountlevel == 'DL1') {
              this.setData({
                orderpricecount: fliter[0].Price1Count,
                orderprice: fliter[0].Price1,
                temptotalfee: fliter[0].Price1Count,
              })
              console.log(this.data.orderprice)
            }
            else if (app.globalData.Gdiscountlevel == 'DL2') {
              this.setData({
                orderpricecount: fliter[0].Price2Count,
                orderprice: fliter[0].Price2,
                temptotalfee: fliter[0].Price2Count,
              })
            }
            else if (app.globalData.Gdiscountlevel == 'DL3') {
              this.setData({
                orderpricecount: fliter[0].Price3Count,
                orderprice: fliter[0].Price3,
                temptotalfee: fliter[0].Price3Count,
              })
            }
            else if (app.globalData.Gdiscountlevel == 'DL4') {
              this.setData({
                orderpricecount: fliter[0].Price4Count,
                orderprice: fliter[0].Price4,
                temptotalfee: fliter[0].Price4Count,
              })
            }
            // 计算总费用
            this.setData({
              totalfee: this.data.temptotalfee - (this.data.consumepoints / app.globalData.Gpointsmagnification),
            })
            resolve(this.data.totalfee);
            console.log("客户计算价格", this.data.orderpricecount)
            console.log("总费用", this.data.totalfee)
          },
        })
      });
    });
    P.then(res => {
      // 每笔订单计算推荐人和间接推荐人的积分
      console.log("pointscount执行了")
      if (app.globalData.Ginviterpromoterlevel == "normal" || app.globalData.Ginviterpromoterlevel == "member") {
        this.setData({
          inviterpoints: 0
        })
        console.log("normal执行了")
      }
      else if (app.globalData.Ginviterpromoterlevel == "sliver") {
        this.setData({
          inviterpoints: Math.trunc(this.data.totalfee * 0.1 * app.globalData.Gpointsmagnification)
        })
        console.log("sliver执行了")
      }
      else if (app.globalData.Ginviterpromoterlevel == "gold") {
        this.setData({
          inviterpoints: Math.trunc(this.data.totalfee * 0.2 * app.globalData.Gpointsmagnification)
        })
        console.log("gold执行了")
        console.log(this.data.totalfee)
        console.log(this.data.inviterpoints)
      }
      else if (app.globalData.Ginviterpromoterlevel == "platinum") {
        this.setData({
          inviterpoints: Math.trunc(this.data.totalfee * 0.2 * app.globalData.Gpointsmagnification)
        })
        console.log("inviterpromoterlevel执行了")
      }
      if (app.globalData.Gindirectinviterpromoterlevel == "platinum") {
        this.setData({
          indirectinviterpoints: Math.trunc(this.data.totalfee * 0.1 * app.globalData.Gpointsmagnification)
        })
        console.log("indirectinviterpromoterlevel执行了")
      }
      else {
        this.setData({
          indirectinviterpoints: 0
        })
      }
    });
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
          IssuedPlace: this.data.issuedplace,
          OrderPrice: this.data.orderprice,
          OrderPriceCount: this.data.orderpricecount,

          //费用
          Count: this.data.count,
          TempTotalFee: this.data.temptotalfee,
          // Balance:this.data.balance,
          ConsumePoints: this.data.consumepoints,
          TotalFee: this.data.totalfee,
          // Commission1Total: this.data.commission1total,
          // Commission2Total: this.data.commission2total,

          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleDateString(),
          PaymentStatus: "unchecked",
          OrderStatus: "unchecked",
        },
        success(res) {
          that.setData({
            ordersublock: true // 修改上传状态并返回前端
          })
          that._hidden()
        },
        fail(res) {
          wx.showToast({
            title: '提交失败请重试',
            icon: 'fail',
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
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          IssuedPlace: this.data.issuedplace,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleDateString(),
          PaymentStatus: "unchecked",
        },
        success(res) {
          that.setData({
            paymentsublock: true
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
  _pointsadd() {
    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("POINTS").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          IssuedPlace: this.data.issuedplace,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          // 直接推荐人
          InviterId: app.globalData.Ginviterid,
          InviterPoints: this.data.inviterpoints,
          // 间接推荐人
          IndirectInviterId: app.globalData.Gindirectinviterid,
          IndirectInviterPoints: this.data.indirectinviterpoints,
          ConsumeId: app.globalData.Gopenid,
          ConsumePoints: this.data.consumepoints,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleDateString(),
          PaymentStatus: "unchecked",
          PointsStatus: "unchecked",
        },
        success(res) {
          that.setData({
            paymentsublock: true
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
        submitted: true
      })
      wx.showToast({
        title: '订单提交成功',
        icon: 'success',
        duration: 2000, //持续的时间
      })
    }
  },
  bvPay() {
    wx.navigateTo({
      // 转到付款页面时，需要传递的参数orderid、productid、productname、totalfee、database
      url: '../order/pay?orderid=' + this.data.orderid + '&productid=' + this.data.productid + '&productname=' + this.data.productname + '&totalfee=' + this.data.totalfee + '&database=ORDER'
    })
  }
})