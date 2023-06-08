const app = getApp()

import {
  pinyin
} from 'pinyin-pro';
Page({
  data: {
    usertype: "admin",
    x: 0,
    // 传值参数
    recordid: "",
    pageParam: "",
    // 商品参数
    productlist: [], //全部商品数组
    productarray: [], //通过模糊查询得到的商品数组
    productdetail: [],
    array: [],
    // 商品分类参数
    inputShow: false,
    boxShow: false,
    sortarray: [],
    category1: "",
    pIndex: 0,
    category2: "",
    cIndex: 0,
    category3: "",
    aIndex: 0,
    code1: "",
    code2: "",
    code3: "",
    code4: "00",
    namecode: "",
    serialcode: "000",
    // 表单参数
    showvalue1: true,
    showvalue2: true,
    showvalue3: true,
    showvalue4: true,
    showvalue5: true,
    showvalue6: true,
    showvalue7: true,
    showvalue8: true,
    showvalue9: true,
    showvalue10: true,
    showvalue11: true,
    showvalue12: true,
    showvalue13: true,
    showvalue14: true,
    showvalue15: true,
    showvalue16: true,
    showvalue17: true,
    showvalue18: true,
    showvalue19: true,
    showvalue20: true,
    showvalue21: true,
    showvalue22: true,
    showvalue23: true,
    showvalue24: true,
    showvalue25: true,
    showvalue26: true,
    showvalue27: true,
    showvalue28: true,
    showvalue29: true,
    showvalue30: true,
    showvalue31: true,
    showvalue32: true,
    showvalue33: true,
    showvalue34: true,
    adddate: "",
    productid: "",
    producttype: "",
    productname: "",
    outline: "",
    startdate: "",
    enddate: "",
    description: "",
    max: 3,
    servicearea: [],
    handleplace: ["广东省", "深圳市", "福田区"],
    issuedby: "",
    situation: "",
    forbid: "",
    doclist: "",
    processingtime: "",
    provider: "",
    providerprice: "",
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    providercountprice: 0,
    price1count: 0,
    price2count: 0,
    price3count: 0,
    price4count: 0,
    reward: "",
    rewardtime: "",
    startdate: "",
    enddate: "",
    updatedate: "",
    status: "",
    score: 0,
    username: "",
    attachmentview: [], //用于展示数据库中的图片
    attachmentimage: [], //数据库中的图片
    attachmentfile: {},
    tempFilePaths: [],
    onsalechecked: false,
    sublock: false,
    fileuploadlock: false,
    imageuploadlock: false,
    recordcontral: false,
    items: [{
        value: '全国',
        checked: true,
        disabled: false
      },
      {
        value: '广东省',
        checked: false,
        disabled: false
      },
      {
        value: '北京市',
        checked: false,
        disabled: false
      },
      {
        value: '天津市',
        checked: false,
        disabled: false
      },
      {
        value: '上海市',
        checked: false,
        disabled: false
      },
      {
        value: '重庆市',
        checked: false,
        disabled: false
      },
      {
        value: '河北省',
        checked: false,
        disabled: false
      },
      {
        value: '山西省',
        checked: false,
        disabled: false
      },
      {
        value: '辽宁省',
        checked: false,
        disabled: false
      },
      {
        value: '吉林省',
        checked: false,
        disabled: false
      },
      {
        value: '黑龙江省',
        checked: false,
        disabled: false
      },
      {
        value: '江苏省',
        checked: false,
        disabled: false
      },
      {
        value: '浙江省',
        checked: false,
        disabled: false
      },
      {
        value: '安徽省',
        checked: false,
        disabled: false
      },
      {
        value: '福建省',
        checked: false,
        disabled: false
      },
      {
        value: '江西省',
        checked: false,
        disabled: false
      },
      {
        value: '山东省',
        checked: false,
        disabled: false
      },
      {
        value: '河南省',
        checked: false,
        disabled: false
      },
      {
        value: '湖北省',
        checked: false,
        disabled: false
      },
      {
        value: '湖南省',
        checked: false,
        disabled: false
      },
      {
        value: '海南省',
        checked: false,
        disabled: false
      },
      {
        value: '四川省',
        checked: false,
        disabled: false
      },
      {
        value: '贵州省',
        checked: false,
        disabled: false
      },
      {
        value: '云南省',
        checked: false,
        disabled: false
      },
      {
        value: '陕西省',
        checked: false,
        disabled: false
      },
      {
        value: '甘肃省',
        checked: false,
        disabled: false
      },
      {
        value: '青海省',
        checked: false,
        disabled: false
      },
      {
        value: '内蒙古自治区',
        checked: false,
        disabled: false
      },
      {
        value: '西藏自治区',
        checked: false,
        disabled: false
      },
      {
        value: '宁夏回族自治区',
        checked: false,
        disabled: false
      },
      {
        value: '新疆维吾尔自治区',
        checked: false,
        disabled: false
      },
      {
        value: '广西壮族自治区',
        checked: false,
        disabled: false
      },
      {
        value: '香港特别行政区',
        checked: false,
        disabled: false
      },
      {
        value: '澳门特别行政区',
        checked: false,
        disabled: false
      },
      {
        value: '台湾省',
        checked: false,
        disabled: false
      },
    ]
  },
  bvRefresh() {
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
          productarray: res.result.data
        })
        app.globalData.Gproductlist=res.result.data
        wx.setStorageSync('LProductList', res.result.data)
        console.log("商品数组", res.result.data)
        console.log("商品数组", this.data.productlist)
        this.setcurrentdata()
      }
    })

  },
  // 展示弹框
  getbox: function () {
    this.setData({
      boxShow: true
    })
  },
  // 隐藏弹框
  hidebox: function () {
    this.setData({
      boxShow: false
    })
  },
  // 确认按钮
  confirm: function () {
    this.setData({
      boxShow: false,
      inputShow: true,
    })
  },
  changeCategory1: function (e) {
    const val = e.detail.value
    this.setData({
      pIndex: val,
      cIndex: 0,
      aIndex: 0,
      category1: this.data.sortarray[val].Category1Name,
      category2: this.data.sortarray[val].Category2Array[0].Category2Name,
      category3: this.data.sortarray[val].Category2Array[0].Category3Array[0].Category3Name,
      code1: this.data.sortarray[val].Category1Code,
      code2: this.data.sortarray[val].Category2Array[0].Category2Code,
      code3: this.data.sortarray[val].Category2Array[0].Category3Array[0].Category3Code,
    })
    this.productCode()
  },
  changeCategory2: function (e) {
    const val = e.detail.value
    this.setData({
      cIndex: val,
      aIndex: 0,
      category2: this.data.sortarray[this.data.pIndex].Category2Array[val].Category2Name,
      category3: this.data.sortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Name,
      code2: this.data.sortarray[this.data.pIndex].Category2Array[val].Category2Code,
      code3: this.data.sortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Code,
    })
    this.productCode()
  },
  changeCategory3: function (e) {
    const val = e.detail.value
    this.setData({
      aIndex: val,
      category3: this.data.sortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Name,
      code3: this.data.sortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Code,
    })
    this.productCode()
  },

  productCode() {
    this.setData({
      productcode: [this.data.namecode] + "-" + [this.data.code1] + [this.data.code2] + [this.data.code3] + [this.data.code4]
    })
    this.serialCode()
  },
  serialCode() {
    var temp = []
    for (var i = 0; i < this.data.productarray.length; i++) {
      if (this.data.productcode == this.data.productarray[i].ProductId.slice(0, -4)) {
        temp.push(this.data.productarray[i])
      }
    }
    console.log(temp)
    if (temp.length != 0) {
      this.setData({
        serialcode: ("0000" + [temp.length + 1]).substr(-3)
      })
    } else {
      this.setData({
        serialcode: "001"
      })
    }
    this.productId()
  },
  productId() {
    this.setData({
      productid: [this.data.namecode] + "-" + [this.data.code1] + [this.data.code2] + [this.data.code3] + [this.data.code4] + "-" + [this.data.serialcode]
    })
  },
  //查询本人创建且符合模糊条件的记录
  onSearch(e) {
    this.setData({
      x: 0,
      productarray: []
    })
    var temparray = [];
    for (var i = 0; i < this.data.productlist.length; i++) {
      if (

        // this.data.productlist[i].HandlePlace.indexOf(e.detail.value) !== -1 ||
        // this.data.productlist[i].Category1.indexOf(e.detail.value) !== -1 ||
        // this.data.productlist[i].Category2.indexOf(e.detail.value) !== -1 ||
        // this.data.productlist[i].Category3.indexOf(e.detail.value) !== -1 ||
        this.data.productlist[i].ProductName.indexOf(e.detail.value) !== -1
      ) {
        temparray.push(this.data.productlist[i])
      }
    }
    this.setData({
      productarray: temparray,
    })
    console.log(this.data.productarray)
    const db = wx.cloud.database()
    const _=db.command
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        Search: _.push(e.detail.value)
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
    this.setcurrentdata()
  },
  onEdit(e) {
    wx.navigateTo({
      url: '../test/productedit?' + e.currentTarget.dataset.id
    })
  },
  onPreviousClick() {
    if (this.data.x == 0) {
      wx.showToast({
        title: '已经是第一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        x: this.data.x - 1
      })
      // this.data.x = this.data.x - 1
      this.setcurrentdata()
    }
  },
  onNextClick() {
    if (this.data.x == this.data.productarray.length - 1) {
      wx.showToast({
        title: '已经是最后一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        x: this.data.x + 1
      })
      // this.data.x = this.data.x + 1
      this.setcurrentdata()
    }
  },
  setcurrentdata() {
    if (this.data.productarray.length > 1) {
      this.setData({
        recordcontral: true
      })
    }
    this.setData({
      recordid: this.data.productarray[this.data.x]._id,
      adddate: this.data.productarray[this.data.x].AddDate,
      status: this.data.productarray[this.data.x].Status,
      productid: this.data.productarray[this.data.x].ProductId,
      producttype: this.data.productarray[this.data.x].ProductType,
      productname: this.data.productarray[this.data.x].ProductName,
      outline: this.data.productarray[this.data.x].Outline,
      startdate: this.data.productarray[this.data.x].StartDate,
      enddate: this.data.productarray[this.data.x].EndDate,
      description: this.data.productarray[this.data.x].Description,
      category1: this.data.productarray[this.data.x].Category1,
      category2: this.data.productarray[this.data.x].Category2,
      category3: this.data.productarray[this.data.x].Category3,
      servicearea: this.data.productarray[this.data.x].ServiceArea,
      handleplace: this.data.productarray[this.data.x].HandlePlace,
      issuedby: this.data.productarray[this.data.x].IssuedBy,
      situation: this.data.productarray[this.data.x].Situation,
      forbid: this.data.productarray[this.data.x].Forbid,
      doclist: this.data.productarray[this.data.x].DocList,
      processingtime: this.data.productarray[this.data.x].ProcessingTime,
      reward: this.data.productarray[this.data.x].Reward,
      rewardtime: this.data.productarray[this.data.x].RewardTime,
      provider: this.data.productarray[this.data.x].Provider,
      providerprice: this.data.productarray[this.data.x].ProviderPrice,
      providercountprice: this.data.productarray[this.data.x].ProviderCountPrice,
      price1: this.data.productarray[this.data.x].Price1,
      price1count: this.data.productarray[this.data.x].Price1Count,
      price2: this.data.productarray[this.data.x].Price2,
      price2count: this.data.productarray[this.data.x].Price2Count,
      price3: this.data.productarray[this.data.x].Price3,
      price3count: this.data.productarray[this.data.x].Price3Count,
      price4: this.data.productarray[this.data.x].Price4,
      price4count: this.data.productarray[this.data.x].Price4Count,
      score: this.data.productarray[this.data.x].Score,
      updatedate: this.data.productarray[this.data.x].UpdateDate,
      attachmentview: this.data.productarray[this.data.x].AttachmentImage,
      attachmentfile: this.data.productarray[this.data.x].AttachmentFile,
      username: this.data.productarray[this.data.x].UserId,
    })
    if (this.data.productarray[this.data.x].Status == "在售") {
      this.setData({
        onsalechecked: true
      })
    } else {
      this.setData({
        onsalechecked: false
      })
    }
  },
  ToastOn() {
    wx.showToast({
      title: '已开启展示开关',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },
  ToastOff() {
    wx.showToast({
      title: '已关闭展示开关',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },
  SVChange(e) {
    console.log(e.currentTarget.dataset.id)
    if (e.detail.value == true) {
      this.ToastOn()
    } else {
      this.ToastOff()
    }
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        showvalue1: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        showvalue2: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 3) {
      this.setData({
        showvalue3: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 4) {
      this.setData({
        showvalue4: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 5) {
      this.setData({
        showvalue5: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 6) {
      this.setData({
        showvalue6: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 7) {
      this.setData({
        showvalue7: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 8) {
      this.setData({
        showvalue8: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 9) {
      this.setData({
        showvalue9: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 10) {
      this.setData({
        showvalue10: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 11) {
      this.setData({
        showvalue11: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 12) {
      this.setData({
        showvalue12: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 13) {
      this.setData({
        showvalue13: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 14) {
      this.setData({
        showvalue14: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 15) {
      this.setData({
        showvalue15: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 16) {
      this.setData({
        showvalue16: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 17) {
      this.setData({
        showvalue17: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 18) {
      this.setData({
        showvalue18: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 19) {
      this.setData({
        showvalue19: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 20) {
      this.setData({
        showvalue20: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 21) {
      this.setData({
        showvalue21: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 22) {
      this.setData({
        showvalue22: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 23) {
      this.setData({
        showvalue23: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 24) {
      this.setData({
        showvalue24: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 25) {
      this.setData({
        showvalue25: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 26) {
      this.setData({
        showvalue26: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 27) {
      this.setData({
        showvalue27: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 28) {
      this.setData({
        showvalue28: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 29) {
      this.setData({
        showvalue29: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 30) {
      this.setData({
        showvalue30: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 31) {
      this.setData({
        showvalue31: e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 32) {
      this.setData({
        showvalue32: e.detail.value
      })
    }

  },


  bvDownloadFile(e) {
    console.log(e.currentTarget.dataset.link)
    // get temp file URL
    wx.cloud.downloadFile({
      fileID: e.currentTarget.dataset.link,
      success: res => {
        // get temp file path
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true, // 重点是这一步，即打开手机端预览文件时右上角三个点，点击可以保存到本地或者分享给好友
          success: res2 => {
            console.log('打开文件成功', res2)
          },
          fail: fres => {
            console.log('打开文件失败', res2)
          },
        })

      },
      fail: err => {
        console.log(err)
      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      productid: options.productid,
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      sortarray: app.globalData.Gsortarray,
      // category1: app.globalData.Gsortarray[0].Category1Name,
      // category2: app.globalData.Gsortarray[0].Category2Array[0].Category2Name,
      // category3: app.globalData.Gsortarray[0].Category2Array[0].Category3Array[0].Category3Name,
    })
    // 先获取在售商品
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        this.setData({
          productarray: res.data
        })
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
  onShareAppMessage: function (res) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const url = `/${currentPage.route}`
    console.log(url)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '邀请您体验：',
      path: "/pages/index/index?" + "userid=" + app.globalData.Guserid + "&page=" + url + "&productid=" + this.data.productid,
      imageUrl: '', //封面
      // imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/sharepic.png?sign=550a147f349dddb2a06196826020450d&t=1659681079', 
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  }
})