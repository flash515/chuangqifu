var app = getApp()
const track = require("../../utils/track");
Page({
  data: {
    usertype: "",
    userphone:"",
    direct30user: [],
    directuser: [],
    // 轮播头图
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    // 管理员数据
    productarray:[],
    productcheck:[],
    producqatarray:[],
    producqatcheck:[],
    orderarray:[],
    ordercheck:[],
    discountarray:[],
    discountcheck:[],
    promotearray:[],
    promotecheck:[],
    bookingarray:[],
    bookingcheck:[],
    paymentarray:[],
    paymentcheck:[],
    userarray:[],
    memberarray:[],
    inofsharearray:[],
    inofsharecheck:[],
    inofarray:[],
    inofcheck:[],
    commentarray:[],
    commentcheck:[],
    namecardarray:[],
  },

  bvSubMessage(e) {
    wx.requestSubscribeMessage({ //获取下发权限
      tmplIds: ['Ap6SsQZ-fj8SZkyVv9ZvIg8EcJ5b1jgmMQko_o4LyAw', 'H4fK4iyDUqkVVxrd7RWuDQh5DOhoChTn8phqFGlfwRU', 'tXhFEK36Dqkasd9Cmmuh5EKZ6LZycrWfgn4xqBreQz4'],
      success: (res) => {

      }
    })
  },
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      userphone:app.globalData.Guserdata.UserInfo.UserPhone
    })
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
    // 管理员执行以下操作
if(app.globalData.Guserdata.UserInfo.UserType=="admin"){
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "PAYMENT",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter1 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].PaymentStatus == 'unchecked') {
          fliter1.push(res.result.data[i])
        }
      }
      this.setData({
        paymentarray: res.result.data,
        paymentcheck:fliter1
      })
      console.log("全部用户",this.data.paymentarray)
    }
  })

  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "ORDER",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter2 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].OrderStatus == 'unchecked') {
          fliter2.push(res.result.data[i])
        }
      }
      this.setData({
        orderarray: res.result.data,
        ordercheck:fliter2
      })
      console.log("全部订单",this.data.orderarray)
    }
  })
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "DISCOUNTORDER",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter3 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].OrderStatus == 'unchecked') {
          fliter3.push(res.result.data[i])
        }
      }
      this.setData({
        discountarray: res.result.data,
        discountcheck:fliter3
      })
      console.log("全部折扣订单",this.data.discountarray)
    }
  })
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "PROMOTEORDER",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter4 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].OrderStatus == 'unchecked') {
          fliter4.push(res.result.data[i])
        }
      }
      this.setData({
        promotearray: res.result.data,
        promotecheck:fliter4
      })
      console.log("全部用户",this.data.promotearray)
    }
  })

  // 查询用户
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "USER",
      command: "",
      where: [{["UserInfo.UserType"]:"client"}],
      orderbykey:"SysAddDate",
      orderby:"desc",
    },
    success: res => {
      console.log("全部用户",  res)
      var fliter5 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].UserInfo.UserPhone != '') {
          fliter5.push(res.result.data[i])
        }
      }
      this.setData({
        userarray: res.result.data,
        memberarray:fliter5
      })
      console.log("全部用户",this.data.userarray)
    }
  })
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "BOOKING",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter6 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].BookingStatus == 'unchecked') {
          fliter6.push(res.result.data[i])
        }
      }
      this.setData({
        bookingarray: res.result.data,
        bookingcheck:fliter6
      })
      console.log("全部预约",this.data.bookingarray)
    }
  })
  // 查询资讯
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "INFOSHARE",
      command: "",
      where: [{}],
      orderbykey:"PublishDate",
      orderby:"desc",
    },
    success: res => {
      var fliter71temp = []
      var fliter72temp = []
      var fliter71 = []
      var fliter72 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].InfoType == 'Media') {
          fliter71temp.push(res.result.data[i])
        }else if(res.result.data[i].InfoType == 'Simple'){
          fliter72temp.push(res.result.data[i])
        }
      }
      for (let i = 0; i < fliter71temp.length; i++) {
        if (fliter71temp[i].InfoStatus == 'unchecked') {
          fliter71.push(fliter71temp[i])
        }
      }
      for (let i = 0; i < fliter72temp.length; i++) {
        if (fliter72temp[i].InfoStatus == 'unchecked') {
          fliter72.push(fliter72temp[i])
        }
      }
      this.setData({
        infosharearray: fliter71temp,
        infosharecheck:fliter71,
        infoarray: fliter72temp,
        infocheck:fliter72
      })
      console.log("全部资讯",this.data.infoarray)
    }
  })
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "InfoShareComment",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter8 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].Status == 'unchecked') {
          fliter8.push(res.result.data[i])
        }
      }
      this.setData({
        commentarray: res.result.data,
        commentcheck:fliter8
      })
      console.log("全部用户",this.data.commentarray)
    }
  })
  
  // 查询产品
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "PRODUCT",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter9 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].Status == '在售') {
          fliter9.push(res.result.data[i])
        }
      }
      this.setData({
        productarray: res.result.data,
        productcheck:fliter9
      })
      console.log("全部产品",this.data.productarray)
    }
  })

  // 查询产品问答
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "PRODUCTQA",
      command: "",
      where: [{}],
      orderbykey:"AddDate",
      orderby:"desc",
    },
    success: res => {
      var fliter10 = []
      for (let i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].Status == 'unchecked') {
          fliter10.push(res.result.data[i])
        }
      }
      this.setData({
        productqaarray: res.result.data,
        producqatcheck:fliter10
      })
      console.log("全部问答",this.data.productqaarray)
    }
  })



  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "NAMECARD",
      command: "",
      where: [{}],
      orderbykey:"PublishDate",
      orderby:"desc",
    },
    success: res => {
      this.setData({
        namecardarray: res.result.data,
      })
      console.log("全部用户",this.data.namecardarray)
    }
  })
}
  },
      	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => track.startToTrack(),
  onShow: function () {
    track.startToTrack()
  },
  handlerClick(e) {track.startByClick(e.currentTarget.id);},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    track.startByBack()
  },
})
