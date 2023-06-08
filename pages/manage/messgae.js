// pages/manage/messgae.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    producttype: "",
    productname: "",
    price: "",
    remark: "",
    invittime: "",
    username: "",
    notice: "",
    sendlock:false
  },
  bvProductType(e) {
    this.setData({
      producttype: e.detail.value
    })
  },

  bvProductName(e) {
    this.setData({
      productname: e.detail.value
    })
  },
  bvPrice(e) {
    this.setData({
      price: e.detail.value
    })
  },
  bvRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  bvSaveProductMessage(e) {
    console.log(e.currentTarget.dataset.id)
    const that = this;
    // 判断是否重复提交
    if (this.data.replylock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'ProductQAUpdate',
        // 传递给云函数的参数
        data: {
          id: e.currentTarget.dataset.id,
          answer: that.data.answer,
          status: "onshow",
          updatedate: new Date().toLocaleString('chinese',{ hour12: false })
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '回复信息发送成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        },
      })

      this.data.replylock = true // 修改上传状态为锁定
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'SendReply',
        // 传递给云函数的参数
        data: {
          openid: e.currentTarget.dataset.openid,
          date6: e.currentTarget.dataset.adddate,
          thing4: e.currentTarget.dataset.question,
          thing2: this.data.answer,
          name1: "小税宝客服"
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '订阅消息发送成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        },
        fail: err => {
          console.log(err)
          // handle error
        },
      })
    }
  },
  bvSendNewProductMessage(e) {
    const that = this;
    // 判断是否重复提交
    if (this.data.sendlock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'SendNewProduct',
        // 传递给云函数的参数
        data: {
          openid: 'omLS75Xib_obyxkVAahnBffPytcA',
          thing10: this.data.producttype,
          name1: this.data.productname,
          amount2: this.data.price,
          thing8: this.data.remark,
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '订阅消息发送成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        },
        fail: err => {
          console.log(err)
          // handle error
        },
      })
      this.data.sendlock = true // 修改上传状态为锁定
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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