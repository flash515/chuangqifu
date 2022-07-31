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
    orderhistory:[],
    orderdetail:[],
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
    // 直接推荐人，自动计算
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


  onLoad: function (options) {
    var that = this;
    this.setData({
      pageParam: options.id,
    })
    console.log("pageParam", this.data.pageParam.id);

    // 从本地存储中读取
    wx.getStorage({
      key: 'LOrderHistory',
      success: res => {
        this.setData({
          orderhistory: res.data
        })
        console.log("订单数组", this.data.orderhistory) //Object {errMsg: "getStorage:ok", data: "value1"}
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._id == this.data.pageParam) {
            fliter.push(res.data[i]);
          }
        }
        console.log(fliter);
        this.setData({
          orderdetail: fliter
        })
      },
    })

  },


})