const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productarray: [],
    DZarray: [],
    array4: [],
    YHarray: [],
    CSarray: [],
    TGarray: [],
    ZZarray: []
  },
  bvAddProduct(e) {
    wx.navigateTo({
      url: '../manage/productedit'
    })
  },
  bvEditProduct(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../manage/productedit?' + e.currentTarget.dataset.id
    })
  },
    //复制下载链接
    bvCopyDownLink(e) {
      var url = e.currentTarget.dataset.link; //获取data-link中的值
      // var url=this.data.url;
      wx.setClipboardData({
        data: url,
        success: function (res) {
          // self.setData({copyTip:true}),
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '该文件下载链接已复制到剪贴板，请打开手机浏览器，在手机浏览器地址栏中粘贴下载链接并下载、保存文件',
            success: function (res) {
              if (res.confirm) {
                console.log('确定')
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
  
        }
      })
    },
  onLoad: function (options) {
    // 查询本人提交的全部产品
    const db = wx.cloud.database()
    db.collection('PRODUCT').where({
      _openid:app.globalData.Gopenid
    }).get({
      success: res => {
        wx.setStorageSync('LPersonalProduct', res.data);
        //括号1开始
        this.setData({
          productarray: res.data,
        })
        console.log("本人产品数组", this.data.productarray)
        // 筛选地址服务
        var DZfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "地址服务") {
            DZfliter.push(this.data.productarray[i]);
          }
        }

        // 筛选工商代办
        var fliter4 = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "工商代办") {
            fliter4.push(this.data.productarray[i]);
          }
        }

        // 筛选银行代办
        var YHfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "银行代办") {
            YHfliter.push(this.data.productarray[i]);
          }
        }

        // 筛选财税服务
        var CSfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "财税服务") {
            CSfliter.push(this.data.productarray[i]);
          }
        }
        // 筛选企业托管
        var TGfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "企业托管") {
            TGfliter.push(this.data.productarray[i]);
          }
        }
                // 筛选资质代办
                var ZZfliter = [];
                for (var i = 0; i < this.data.productarray.length; i++) {
                  if (this.data.productarray[i].ProductType == "资质代办") {
                    ZZfliter.push(this.data.productarray[i]);
                  }
                }
        this.setData({
          DZarray: DZfliter,
          array4: fliter4,
          YHarray: YHfliter,
          CSarray: CSfliter,
          TGarray: TGfliter,
          ZZarray: ZZfliter
        })
        // 打印数组
        console.log("代开产品", this.data.DZarray)
        console.log("个体产品", this.data.YHarray)
        console.log("个独/合伙", this.data.CSarray)
        console.log("有限公司", this.data.array4)
      },
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