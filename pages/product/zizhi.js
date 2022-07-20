const app = getApp()
Page({
  data: {
    DKarray: [],
    GTarray: [],
    GDarray: [],
    GSarray: [],
    productarray: [],
    usertype: "",
    discountlevel: "",
    priceshow: "",
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
    nextMargin: 0
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    // 从本地存储中读取产品
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        console.log("打印调用本地产品列表反回结果", res)
        this.setData({
          productarray: res.data
        })
        console.log("产品数组", this.data.productarray)
        // 筛选自然人代开
        var DKfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "食品经营") {
            DKfliter.push(this.data.productarray[i]);
          }
        }
        console.log(DKfliter);
        // 筛选个体工商
        var GTfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "专利申请") {
            GTfliter.push(this.data.productarray[i]);
          }
        }
        console.log(GTfliter);
        // 筛选个独/合伙企业
        var GDfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "高新申请") {
            GDfliter.push(this.data.productarray[i]);
          }
        }
        console.log(GDfliter);
        // 筛选有限公司
        var GSfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "有限公司") {
            GSfliter.push(this.data.productarray[i]);
          }
        }
        console.log(GSfliter);
        this.setData({
          DKarray: DKfliter,
          GTarray: GTfliter,
          GDarray: GDfliter,
          GSarray: GSfliter
        })
        // 打印数组
        console.log("代开产品", this.data.DKarray)
        console.log("个体产品", this.data.GTarray)
        console.log("个独/合伙", this.data.GDarray)
        console.log("有限公司", this.data.GSarray)
      }

    })
    //括号1结束

  },

  bvProductDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../product/productdetail?' + e.currentTarget.dataset.id
    })
  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../order/neworder?' + e.currentTarget.dataset.id
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
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Gusertype,
      discountlevel: app.globalData.Gdiscountlevel,
      priceshow: app.globalData.Gpriceshow,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
    })
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