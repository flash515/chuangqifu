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
    discountorderid:"",
    discountid:"",
    discountname:"",
    discountlevel:"",
    discounthidden:true,
    singlediscounthidden:true,
    // 订单费用标准（根据客户身份赋值）
    orderprice: "",
    // 订单费用计算标准（根据客户身份赋值）
    orderpricecount: 0,
    count:1,
    // 净服务费，自动计算
    servicesfee: 0,
    // 积分折减前总办理费用，自动计算
    temptotalfee: 0,
// 可用积分
    balance:6000,
// 本次使用积分
    points:0,
    // 总办理费用，自动计算 
    totalfee: 0,
    // 推荐人积分计算
    commissiontype:"",
    // 直接推荐人，自动计算
    inviterpoints: 0,
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
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: "登录创企服以查看更多信息",
      success: res => {
        console.log("获得的用户微信信息", res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        app.globalData.GavatarUrl = res.userInfo.avatarUrl
        app.globalData.GnickName = res.userInfo.nickName
        // 获取数据库引用
        const db = wx.cloud.database()
        // 更新数据
        db.collection('USER').where({
          _openid: app.globalData.Gopenid
        }).update({
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            language: res.userInfo.language,
            nickName: res.userInfo.nickName,
            province: res.userInfo.province
          },
        })
        // 以上更新数据结束
        wx.showToast({
          icon: 'success',
          title: '登录成功',
        })
        return;
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          icon: 'error',
          title: '您拒绝了请求',
        })
        return;
      }
    })
  },

  onShow: function () {
    this.setData({
      image: app.globalData.Gimagearray,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
    })
  },
  bvDiscountCheck(){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
        _openid: app.globalData.Gopenid,
        PaymentStatus:"checked",
        OrderStatus:"checked",
        Available:true,
      }).orderBy('PaymentId','desc').get({
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              tempfliter.push(res.data[i]);
            }
          }
          if(tempfliter.length !=0  && tempfliter.length != undefined){
          console.log(tempfliter)
          this.setData({
            discountorderid:tempfliter[0]._id,
            discountid:tempfliter[0].DiscountId,
            discounthidden:false,
            discountname:tempfliter[0].DiscountName,
            discountlevel:tempfliter[0].DiscountLevel,
            adddate:tempfliter[0].AddDate,
            dlstartdate: tempfliter[0].DLStartDate,
            dlenddate: tempfliter[0].DLEndDate,

          })
        }
      }
      else{
        this.setData({
          discountlevel:"DL4",
          discounthidden:true,
        })
      }
      console.log(this.data.discountlevel)
      this.bvOrderPrice(this.data.discountlevel)
    }
    })

  },
  bvOrderPrice() {
    // 从本地存储中读取客户价格
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        console.log("产品数组", res.data)
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ProductId == this.data.pageParam.productid) {
            fliter.push(res.data[i]);
          }
        }
        console.log(fliter);
        if (this.data.discountlevel == 'DL1') {
          this.setData({
            orderpricecount: fliter[0].Price1Count,
            orderprice: fliter[0].Price1,
            temptotalfee: fliter[0].Price1Count
          })
        }
        else if (this.data.discountlevel == 'DL2') {
          this.setData({
            orderpricecount: fliter[0].Price2Count,
            orderprice: fliter[0].Price2,
            temptotalfee: fliter[0].Price2Count
          })
        }
        else if (this.data.discountlevel == 'DL3') {
          this.setData({
            orderpricecount: fliter[0].Price3Count,
            orderprice: fliter[0].Price3,
            temptotalfee: fliter[0].Price43ount
          })
        }
        else if (this.data.discountlevel == 'DL4') {
          this.setData({
            orderpricecount: fliter[0].Price4Count,
            orderprice: fliter[0].Price4,
            temptotalfee: fliter[0].Price4Count
          })
        }
        this.setData({
          commissiontype: fliter[0].CommissionType,
          commission1: fliter[0].Commission1,
          commission1count: fliter[0].Commission1Count,
          commission2: fliter[0].Commission2,
          commission2count: fliter[0].Commission2Count
        })
        console.log("客户价格", this.data.orderprice)
        console.log("客户计算价格", this.data.orderpricecount)
      },
    })
  },
bvCount(e) {
  this.setData({
    count:e.detail.count,
    temptotalfee: this.data.orderpricecount*e.detail.count,
    commission1total: this.data.commission1count*e.detail.count,
    commission2total: this.data.commission2count*e.detail.count,
    totalfee: this.data.temptotalfee-(this.data.points/10)
  })
  this._commissioncount()
  console.log("客户计算价格", this.data.count)
},
bvPoints(e) {
  this.setData({
    points:e.detail.count,
    totalfee: this.data.temptotalfee-(e.detail.count/10),
    commission1total: this.data.commission1count*e.detail.count,
    commission2total: this.data.commission2count*e.detail.count
  })
  this._pointscount()
  console.log("客户计算价格", this.data.count)
},
_pointscount(){
  if (app.globalData.Ginviterpromoterlevel=="normal"){
    this.setData({
inviterpoints:0
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="sliver"){
    this.setData({
inviterpoints:this.data.totalfee*0.1*10
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="gold"){
    this.setData({
inviterpoints:this.data.totalfee*0.2*10
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="platium"){
    this.setData({
inviterpoints:this.data.totalfee*0.2*10
    })
  }
  if (app.globalData.Gindirectinviterpromoterlevel=="platium"){
    this.setData({
      indirectinviterpoints:this.data.totalfee*0.1*10
    })
  }
  else{
    this.setData({
      indirectinviterpoints:0
    })
  }
},
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数

    this.setData({
      pageParam: options,
      productid: options.productid,
      productname: options.productname,
      issuedplace: options.issuedplace,
      points:this.data.balance
    })
    this.bvDiscountCheck()
  },

  //跳转注册资料页面
  onClick: function () {
    wx.navigateTo({
      url: 'https://sm758rc5kj.jiandaoyun.com/f/5c221c18326ce11b6be21cca',
    })
  },
  addData() {
    this._orderadd()
    this._pointsadd()
    this._paymentadd()
    this._discountupdate()
  },
  _discountupdate(){
    console.log("discountupdate已执行")
if(this.data.discountid=="DL3_Single"){
  const db = wx.cloud.database()
  db.collection("DISCOUNTORDER").where({
_id:this.data.discountorderid
  }).update({
data:{
  Available:false
}
  })
}
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
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          IssuedPlace: this.data.issuedplace,
          OrderPriceCount: this.data.orderpricecount,
          OrderPrice: this.data.orderprice,
          //费用
          Count:this.data.count,
          TempTotalFee:this.data.temptotalfee,
          Balance:this.data.balance,
          Points:this.data.points,
          TotalFee: this.data.totalfee,
          Commission1Total: this.data.commission1total,
          Commission2Total: this.data.commission2total,

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
          wx.removeStorage({
            key: 'LTemp' + that.data.productid,
            success(res) {
              console.log("删除缓存", res)
            }
          })
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
  _paymentadd(){
    let that=this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          IssuedPlace: this.data.issuedplace,
          Count:this.data.count,
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
  _pointsadd(){
    let that=this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("POINTS").add({
        data: {
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          IssuedPlace: this.data.issuedplace,
          Count:this.data.count,
          TotalFee: this.data.totalfee,
          InviterId:app.globalData.Ginviterid,
          IndirectInviterId:app.globalData.Gindirectinviterid,
          InviterPoints:this.data.inviterpoints,
          IndirectInviterPoints:this.data.indirectinviterpoints,
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
  _hidden(){
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
      url: '../order/pay?totalfee=' + this.data.totalfee+'&onlinehidden=true'
    })
  }
})