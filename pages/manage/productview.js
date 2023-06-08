const app = getApp()

Page({
  data: {
    productlist:"",
    currentTab: 0,
    index: 0,
    sortarray: [],
    productarray: [],
    category:"",
    categoryname:""
  },
  onSearch(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCT').where(_.and([{
        UserId: app.globalData.Guserid
      },
      _.or([{
          IssuedBy: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          ProductType: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          Status: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        }
      ])
    ])).get({
      success: res => {
        this.setData({
          productarray: res.data,
        })
        if (res.data.length > 1) {
          this.setData({
            recordcontral: true
          })
        }
        this.setcurrentdata()
      }
    })
  },
  bvAddProduct(e) {
    wx.navigateTo({
      url: '../manage/productedit'
    })
  },
  bvEditProduct(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../manage/productedit?id=' + e.currentTarget.dataset.id
    })
  },
  bvSortChange(e) {
    console.log(e.currentTarget.dataset.name)
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentTab: e.currentTarget.dataset.index, //按钮CSS变化
      categoryname: e.currentTarget.dataset.name,
      category:e.currentTarget.dataset.name
    })
    // this.data.categoryname = e.currentTarget.dataset.name
    // var category = e.currentTarget.dataset.name
    this._setproductarray()
  },
  _setproductarray() {
    console.log(this.data.category)
    var fliter = []
    for (let i = 0; i < app.globalData.Gproductlist.length; i++) {
      if (app.globalData.Gproductlist[i].Category1 == this.data.category) {
        fliter.push(app.globalData.Gproductlist[i])
      }
    }
    this.setData({
      productarray: fliter
    })
    console.log(this.data.productarray)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PRODUCT",
        command: "or",
        where: [{
            Status: "在售"
          },
          {
            Status: "停售"
          }
        ]
      },
      success: res => {
        this.setData({
          productlist: res.result.data,
        })
        app.globalData.Gproductlist=res.result.data
        console.log("商品数组", this.data.productlist)
        var tempsort = []
        for (let i = 0; i < app.globalData.Gsetting.ProductSort.length; i++) {
          tempsort.push(app.globalData.Gsetting.ProductSort[i].Category1Name)
        }
        this.setData({
          sortarray: tempsort,
          // SortArray是静态数组，不需要重新排序，直接以下标就可以确定首位key
          category:tempsort[0].Category1Name
        })
        console.log(this.data.sortarray)

        this._setproductarray()
      }
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