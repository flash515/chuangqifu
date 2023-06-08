const app = getApp()

Page({

  data: {
    // 轮播参数
    image: [],
    //新增数据变量
    orderdetail: [],
  },

  onShow: function () {

  },

  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
    })
    let pages = getCurrentPages();
    //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    if (prevPage.method) prevPage.method();
    //可直接调用页面上的方法
    console.log(prevPage.data.orderhistory)
    // 筛选指定记录
    var fliter = [];
    // var _this = this
    for (var i = 0; i < prevPage.data.orderhistory.length; i++) {
      if (prevPage.data.orderhistory[i]._id == options.id) {
        fliter.push(prevPage.data.orderhistory[i]);
      }
    }
    console.log(fliter);
    this.setData({
      orderdetail: fliter
    })
  },
})