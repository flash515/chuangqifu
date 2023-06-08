var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    promoterlevel:"",
    directorder: [],
    direct30order: [],
    direct30value: 0,
    directvalue: 0,
    indirect30value: 0,
    indirectvalue: 0,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image:app.globalData.Gimagearray,
      promoterlevel:app.globalData.Guserdata.UserInfo.PromoterLevel
    })
        // 直接分享价值查询
    // 从本地存储中读取
    wx.getStorage({
      key: 'LDirectUser',
    }).then(res => {
      console.log("读取", res.data)
      wx.cloud.callFunction({
        name: 'ShareValueQuery',
        data: {
          userarray: res.data
        },
      }).then(res => {
        var temparray = []
        for (let i = 0; i < res.result.length; i++) {
          temparray = temparray.concat(res.result[i].data)
        }
        var fliter = []
        for (var i = 0; i < temparray.length; i++) {
          if (temparray[i].SysAddDate > (new Date().getTime() - 30 * 86400000)) {
            fliter.push(temparray[i]);
          }
        }
        this.setData({
          directorder: temparray,
          direct30order: fliter,
        })
        console.log("直接订单", temparray)
        console.log("直接30订单", fliter)
        // 直接订单总额
        let fee = 0
        for (let i = 0; i < temparray.length; i++) {
          fee = fee + parseInt(temparray[i].TotalFee)
        }
        this.setData({
          directvalue: fee
        })
        console.log("直接价值查询", fee)
        // 直接30订单总额
        let fee30 = 0
        for (let i = 0; i < fliter.length; i++) {
          fee30 = fee30 + parseInt(fliter[i].TotalFee)
        }
        this.setData({
          direct30value: fee30
        })
        console.log("30天直接价值查询", fee30)
        // console.log("云函数价值查询", res.result.temparray)
      })
    })
    // 间接价值查询
    // 从本地存储中读取
    wx.getStorage({
      key: 'LIndirectUser',
    }).then(res => {
      console.log("读取间接分享用户", res.data)
      wx.cloud.callFunction({
        name: 'ShareValueQuery',
        data: {
          userarray: res.data
        },
      }).then(res => {
        // 间接订单
        var temparray = []
        for (let i = 0; i < res.result.length; i++) {
          temparray = temparray.concat(res.result[i].data)
        }
        // 间接30天订单
        var fliter = []
        for (var i = 0; i < temparray.length; i++) {
          if (temparray[i].SysAddDate > (new Date().getTime() - 30 * 86400000)) {
            fliter.push(temparray[i]);
          }
        }
        this.setData({
          indirectorder: temparray,
          indirect30order: fliter,
        })
        console.log("间接订单", temparray)
        console.log("间接30订单", fliter)
        // 订单总额
        let fee = 0
        for (let i = 0; i < temparray.length; i++) {
          fee = fee + parseInt(temparray[i].TotalFee)
        }
        this.setData({
          indirectvalue: fee
        })
        console.log("间接价值查询", fee)
        // 30天订单总额
        let fee30 = 0
        for (let i = 0; i < fliter.length; i++) {
          fee30 = fee30 + parseInt(fliter[i].TotalFee)
        }
        this.setData({
          indirect30value: fee30
        })
        console.log("30天间接价值查询", fee30)
        // console.log("云函数价值查询", res.result.temparray)
      })
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