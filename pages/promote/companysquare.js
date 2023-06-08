const app = getApp();
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphone: "",
    // 显示在 Tip 区域的文字
    indexText: "",
    cards: [],
    namecard: [],
    mycard: [],
    // 轮播头图
    image: [],
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,

    // 行业分类参数
    inputShow: false,
    boxShow: false,
    businesssortarray: [],
    category1: "",
    category1name: "",
    pIndex: 0,
    category2: "",
    category2name: "",
    cIndex: 0,
    category3: "",
    category3name: "",
    aIndex: 0,
    //关键词
    keywords: "",
  },
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },

  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      loginbtnshow: e.detail.loginbtnshow,
      userphone: e.detail.userphone,
    })
  },
  onSearch(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('NAMECARD').where(
      _.or([{
          KeyWords: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          CompanyName: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          Category1: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          Category2: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          Category3: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },

      ])
    ).get({
      success: res => {
        this.setData({
          cards: res.data,
        })
      }
    })
  },
  // 展示弹框
  getbox: function () {
    this.setData({
      boxShow: true,
      inputShow: true
    })
  },
  // 隐藏弹框
  hidebox: function () {
    this.setData({
      boxShow: false,
      inputShow: false
    })
  },
  // 确认按钮
  confirm: function () {
    this.setData({
      category1: this.data.category1name,
      category2: this.data.category2name,
      category3: this.data.category3name,
      boxShow: false,
      inputShow: false,
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "NAMECARD",
        command: "and",
        where: [{
          Category1: this.data.category1
        }, {
          Category2: this.data.category2
        }, {
          Category3: this.data.category3
        }]
      },
      success: res => {
        this.setData({
          cards: res.result.data
        })
      }
    })
  },
  changeCategory1: function (e) {
    const val = e.detail.value
    this.setData({
      pIndex: val,
      cIndex: 0,
      aIndex: 0,
      category1name: this.data.businesssortarray[val].Category1Name,
      category2name: this.data.businesssortarray[val].Category2Array[0].Category2Name,
      category3name: this.data.businesssortarray[val].Category2Array[0].Category3Array[0].Category3Name,
    })
  },
  changeCategory2: function (e) {
    const val = e.detail.value
    this.setData({
      cIndex: val,
      aIndex: 0,
      category2name: this.data.businesssortarray[this.data.pIndex].Category2Array[val].Category2Name,
      category3name: this.data.businesssortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Name,

    })
  },
  changeCategory3: function (e) {
    const val = e.detail.value
    this.setData({
      aIndex: val,
      category3name: this.data.businesssortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Name,
    })
  },
  // 页面监听函数
  onPageScroll(res) {

  },
  bvNameCardSelect(e) {
    if (app.globalData.Guserdata.NameCardStatus != "Published") {
      utils._ErrorToast("先发布本人名片")
      return
    }
    console.log("cell", e.detail.cell)
    // 设定名片背景
    this.setData({
      namecard: e.detail.cell
    })
    if (app.globalData.Guserid != e.detail.cell.CreatorId) {
      // 浏览量更新
      this._viewadd(e.detail.cell.CreatorId)
      // 浏览人已发布的名片信息会发送给被浏览人

      // 本地函数查询名片信息
      const db = wx.cloud.database()
      // 登记本人名片
      db.collection('NameCardViewed').add({
        data: {
          sysAddDate:new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          NameCardCreatorId: e.detail.cell.CreatorId,
          ViewerId: app.globalData.Guserid,
          ViewerCompany: this.data.mycard.CompanyName,
          ViewerName: this.data.mycard.UserName,
          ViewerTitle: this.data.mycard.Title,
          ViewerHandPhone: this.data.mycard.Handphone,
        },
        success: res => {
          console.log("被查看信息添加了")
        }
      })

    }

  },
  _viewadd(creatorid) {
    wx.cloud.callFunction({
      name: "DataRise",
      data: {
        collectionName: "NAMECARD",
        key: "CreatorId",
        value: creatorid,
        key1: "View",
        value1: 1
      },
      success: res => {
        console.log("浏览量已更新", res)

      }
    })
  },
  // 长按号码响应函数
  bvPhoneNumTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cardinfo.handphone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const db = wx.cloud.database()
    db.collection('NameCardSetting').doc('0122a5876443793e098bd33e0045f553').get({
      success: res => {
        this.setData({
          businesssortarray: res.data.BusinessSortArray
        })
        console.log("行业类别更新成功")
      }
    })
    this.setData({
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
    })
    // 云函数查询已发布名片
    // let cards = await utils._NameCardCheck()
    // this.setData({
    //   cards: cards
    // })
    if (app.globalData.Guserdata.NameCardStatus == "Published") {
      // 本地函数查询名片信息
      const db = wx.cloud.database()
      db.collection('NAMECARD').where({
        CreatorId: app.globalData.Guserid
      }).get({
        success: res => {
          // 登记本人名片
          this.data.mycard = res.data[0]
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})