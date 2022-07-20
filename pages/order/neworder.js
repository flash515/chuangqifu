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
    // 总办理费用，自动计算
    totalfee: 0,
    // 直接推荐人，自动计算
    charge1: 0,
    // 间接推荐人，自动计算
    charge2: 0,
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
            totalfee: fliter[0].Price1Count,
            orderprice: fliter[0].Price1
          })
        }
        else if (this.data.discountlevel == 'DL2') {
          this.setData({
            totalfee: fliter[0].Price2Count,
            orderprice: fliter[0].Price2
          })
        }
        else if (this.data.discountlevel == 'DL3') {
          this.setData({
            totalfee: fliter[0].Price3Count,
            orderprice: fliter[0].Price3
          })
        }
        else if (this.data.discountlevel == 'DL4') {
          this.setData({
            totalfee: fliter[0].Price4Count,
            orderprice: fliter[0].Price4
          })
        }
        console.log("客户价格", this.data.orderprice)
        console.log("客户计算价格", this.data.totalfee)
      },
    })
  },
bvCount(e) {
  this.setData({
    totalfee: this.data.orderprice*this.data.count
  })
  console.log("客户计算价格", this.data.totalfee)
},
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数

    this.setData({
      pageParam: options,
      productid: options.productid,
      productname: options.productname,
      issuedplace: options.issuedplace,
    })

    // 读取本地暂存数据

    wx.getStorage({
      key: 'LTemp' + options.productid,
      success: res => {
        console.log("LTemp", res.data)
        if (!res.data) {} else {
          this.setData({
            imageuploadlock: res.data.imageuploadlock,
            //投资人
            investorname: res.data.investorname,
            investorphone: res.data.investorphone,
            investoraddress: res.data.investoraddress,
            investoremail: res.data.investoremail,
            //注册信息
            businessname: res.data.businessname,
            alternatename: res.data.alternatename,
            businessscope: res.data.businessscope,
            investment: res.data.investment,
            //附件
            attachmentview: res.data.attachmentview,
            attachmentimage: res.data.attachmentimage,
            // 收件地址
            addressee: res.data.addressee,
            address: res.data.address,
            addresseephone: res.data.addresseephone,
            //费用
            fee: res.data.fee,
            totalfee: res.data.totalfee,
            charge1: res.data.charge1,
            charge2: res.data.charge2,
          })
        }
      }
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
          Fee: this.data.fee,
          TotalFee: this.data.totalfee,
          Charge1: this.data.charge1,
          Charge2: this.data.charge2,

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