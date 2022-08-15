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
    balance:0,
// 本次使用积分
consumepoints:0,
    // 总办理费用，自动计算 
    totalfee: 0,
    // 推荐人积分计算
    commissiontype:"",
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
    this._totalfee()
  },
  bvDiscountCheck(){
    //查询是否有购买折扣记录
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
          //如果有购买记录则执行
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              //如果有在有效期内的折扣，则给tempfliter赋值
              tempfliter.push(res.data[i]);
            }
            else{
              //如果没有在有效期内的折扣，则直接给参数赋值
              this.setData({
                discountlevel:"DL4",
                discounthidden:true,
              })
              console.log(this.data.discountlevel)
            }
          if(tempfliter.length !=0  && tempfliter.length != undefined){
            //tempfliter不为空时（有效的折扣），给参数赋值
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
    }
      else{
        this.setData({
          discountlevel:"DL4",
          discounthidden:true,
        })
        console.log(this.data.discountlevel)
      }
      console.log(this.data.discountlevel)
      this.bvOrderPrice(this.data.discountlevel)
    }
    })

  },
  _orderprice() {
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
        if (app.globalData.Gdiscountlevel == 'DL1') {
          this.setData({
            orderpricecount: fliter[0].Price1Count,
            orderprice: fliter[0].Price1,
            temptotalfee: fliter[0].Price1Count,
            totalfee: fliter[0].Price1Count-(this.data.consumepoints/app.globalData.Gpointsmagnification),
          })
          console.log(this.data.orderprice)
        }
        else if (app.globalData.Gdiscountlevel == 'DL2') {
          this.setData({
            orderpricecount: fliter[0].Price2Count,
            orderprice: fliter[0].Price2,
            temptotalfee: fliter[0].Price2Count,
            totalfee: fliter[0].Price2Count-(this.data.consumepoints/app.globalData.Gpointsmagnification),
          })
        }
        else if (app.globalData.Gdiscountlevel == 'DL3') {
          this.setData({
            orderpricecount: fliter[0].Price3Count,
            orderprice: fliter[0].Price3,
            temptotalfee: fliter[0].Price3Count,
            totalfee: fliter[0].Price3Count-(this.data.consumepoints/app.globalData.Gpointsmagnification),
          })
        }
        else if (app.globalData.Gdiscountlevel == 'DL4') {
          this.setData({
            orderpricecount: fliter[0].Price4Count,
            orderprice: fliter[0].Price4,
            temptotalfee: fliter[0].Price4Count,
            totalfee: fliter[0].Price4Count-(this.data.consumepoints/app.globalData.Gpointsmagnification),
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
    // 计算总费用
  },

bvCount(e) {
  this.setData({
    count:e.detail.count,
    temptotalfee: this.data.orderpricecount*e.detail.count,
  })
  this._totalfee()
  this._pointscount()
},
bvConsumePoints(e) {
  this.setData({
    consumepoints:e.detail.count,
  })
  this._totalfee()
  this._pointscount()
},
_totalfee(){
  this.setData({
    totalfee: this.data.temptotalfee-(this.data.consumepoints/app.globalData.Gpointsmagnification),
  })
},
// 每笔订单计算直接上级和间接上级的积分
_pointscount(){
  if (app.globalData.Ginviterpromoterlevel=="normal"){
    this.setData({
inviterpoints:0
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="sliver"){
    this.setData({
inviterpoints:this.data.totalfee*0.1*app.globalData.Gpointsmagnification
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="gold"){
    this.setData({
inviterpoints:this.data.totalfee*0.2*app.globalData.Gpointsmagnification
    })
  }
  else if(app.globalData.Ginviterpromoterlevel=="platium"){
    this.setData({
inviterpoints:this.data.totalfee*0.2*app.globalData.Gpointsmagnification
    })
  }
  if (app.globalData.Gindirectinviterpromoterlevel=="platium"){
    this.setData({
      indirectinviterpoints:this.data.totalfee*0.1*app.globalData.Gpointsmagnification
    })
  }
  else{
    this.setData({
      indirectinviterpoints:0
    })
  }
},
_balancecheck(){
  let p1=new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          PersonalId: app.globalData.Gopenid,
          PointsStatus:'checked',
        }]
      },
      success: res => {
        console.log(res)
        let points1=0
        for(let i =0;i<res.result.data.length;i++){
          points1 += res.result.data[i].PersonalPoints
      }
      this.setData({
        personalhistory: res.result.data,
        personalpoints:points1
      })
      console.log("异步执行",this.data.personalpoints)
      resolve(this.data.personalpoints);
    },
    fail: err => {
      resolve(this.data.personalpoints);
    }
  })
  console.log("1执行了",this.data.personalpoints)
  });
  
  let p2=new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          InviterId: app.globalData.Gopenid,
          PointsStatus:'checked',
        }]
      },
      success: res => {
        console.log(res)
        let points2=0
        for(let i =0;i<res.result.data.length;i++){
          points2 += res.result.data[i].InviterPoints
      }
      this.setData({
            inviterhistory: res.result.data,
            inviterpoints:points2
          })
          console.log("异步执行",this.data.inviterpoints)
          resolve(this.data.inviterpoints);
      },
      fail: err => {
        resolve(this.data.inviterpoints);
      }
    })
    console.log(this.data.inviterpoints)
    console.log("2执行了")
  });
  let p3=new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          IndirectInviterId: app.globalData.Gopenid,
          PointsStatus:'checked',
        }]
      },
      success: res => {
        console.log(res)
        let points3=0
        for(let i =0;i<res.result.data.length;i++){
          points3 += res.result.data[i].IndirectInviterPoints
      }
          this.setData({
            indirectinviterhistory: res.result.data,
            indirectinviterpoints:points3
          })
          console.log("异步执行",this.data.indirectinviterpoints)
          resolve(this.data.indirectinviterpoints);
      },
      fail: err => {
        // this.setData({
        //   indirectinviterpoints:0
        // })
        resolve(this.data.indirectinviterpoints);
      }
  
    })
    console.log(this.data.indirectinviterpoints)
    console.log("3执行了")
  });
  let p4=new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          ConsumeId: app.globalData.Gopenid,
          PointsStatus:'checked',
        }]
      },
      success: res => {
        console.log(res)
        let points4=0
        for(let i =0;i<res.result.data.length;i++){
          points4 += res.result.data[i].ConsumePoints
      }
          this.setData({
            consumehistory: res.result.data,
            consumepoints:points4
          })
          console.log("异步执行",this.data.consumepoints)
          resolve(this.data.consumepoints);
      },
      fail: err => {
        resolve(this.data.consumepoints);
      }
    })
    console.log(this.data.consumepoints)
    console.log("4执行了")
  });
  Promise.all([p1,p2,p3,p4]).then(res=>{
    this.setData({
      balance:this.data.personalpoints+this.data.inviterpoints+this.data.indirectinviterpoints-this.data.consumepoints,
    }),
    console.log("balance执行了")
  });
  
  
},
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数

    this.setData({
      pageParam: options,
      productid: options.productid,
      productname: options.productname,
      issuedplace: options.issuedplace,
      consumepoints:app.globalData.Gbalance,
    })
    this._orderprice()
    this.bvDiscountCheck()
    this._balancecheck()
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
          ConsumePoints:this.data.consumepoints,
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
          InviterPoints:this.data.inviterpoints,
          IndirectInviterId:app.globalData.Gindirectinviterid,
          IndirectInviterPoints:this.data.indirectinviterpoints,
          ConsumeId:app.globalData.Gopenid,
          ConsumePoints:this.data.consumepoints,
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