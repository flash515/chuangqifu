const app = getApp()
var utils = require("../../utils/utils")
Page({
  data: {
    x: 0,
    // 传值参数
    recordid: "",
    pageParam: "",
    // 商品参数
    productarray: [], //通过查询功能得到的商品数组
    productdetail: [],
    array: [],


    // 商品分类参数
    inputShow: false,
    boxShow: false,
    sortarray: [],
    category1: "",
    category1name: "",
    pIndex: 0,
    category2: "",
    category2name: "",
    cIndex: 0,
    category3: "",
    category3name: "",
    aIndex: 0,

    adddate: "",
    productname: "",
    outline: "",
    startdate: "",
    enddate: "",
    description: "",
    max: 3,
    servicearea: [],
    handleplace: ["广东省", "深圳市"],
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
    productview: [], //用于展示数据库中的商品介绍图片
    productimage: [], //数据库中的商品介绍图片
    productview: [], //用于展示数据库中的商品附件图片
    attachmentfile: [],
    tempFilePaths: [],
    onsalechecked: false,
    sublock: false,
    productimageuploadlock: false,
    fileuploadlock: false,
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

  },
  changeCategory1: function (e) {
    const val = e.detail.value
    this.setData({
      pIndex: val,
      cIndex: 0,
      aIndex: 0,
      category1name: this.data.sortarray[val].Category1Name,
      category2name: this.data.sortarray[val].Category2Array[0].Category2Name,
      category3name: this.data.sortarray[val].Category2Array[0].Category3Array[0].Category3Name,
    })
  },
  changeCategory2: function (e) {
    const val = e.detail.value
    this.setData({
      cIndex: val,
      aIndex: 0,
      category2name: this.data.sortarray[this.data.pIndex].Category2Array[val].Category2Name,
      category3name: this.data.sortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Name,

    })
  },
  changeCategory3: function (e) {
    const val = e.detail.value
    this.setData({
      aIndex: val,
      category3name: this.data.sortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Name,
    })
  },

  onsaleChange(e) {
    if (e.detail.value == true) {
      this.setData({
        status: "在售",
        onsalechecked: true
      })
      utils._SuccessToast("已开启在售开关")
    } else {
      this.setData({
        status: "停售",
        onsalechecked: false
      })
      utils._SuccessToast("已关闭在售开关")
    }
  },

  // 通过事件绑定用户手机值
  bvProductName(e) {
    this.setData({
      productname: e.detail.value,
    })

  },

  bvOutline(e) {
    this.setData({
      outline: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvStartDate(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvEndDate(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  bvDescription(e) {
    this.setData({
      description: e.detail.value
    })
  },

  bvServiceArea(e) { //设置当前checkbox的值
    console.log('checkbox发生change事件，携带value值为：', e.detail)
    this.setData({
      servicearea: e.detail.value
    })
  },
  bvHandlePlace: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      handleplace: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
    console.log('picker发送选择改变，携带值为', this.data.handleplace)
  },
  bvIssuedBy(e) {
    this.setData({
      issuedby: e.detail.value
    })
  },
  bvSituation(e) {
    this.setData({
      situation: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvProcessingTime(e) {
    this.setData({
      processingtime: e.detail.value
    })
  },
  bvDocList(e) {
    this.setData({
      doclist: e.detail.value
    })
  },
  bvForbid(e) {
    this.setData({
      forbid: e.detail.value
    })
  },
  bvProvider(e) {
    this.setData({
      provider: e.detail.value
    })
  },
  bvProviderPrice(e) {
    this.setData({
      providerprice: e.detail.value
    })
  },
  bvProviderCountPrice(e) {
    this.setData({
      providercountprice: e.detail.value
    })
  },
  bvPrice1(e) {
    this.setData({
      price1: e.detail.value
    })
  },
  bvPrice1Count(e) {
    this.setData({
      price1count: e.detail.value
    })
  },
  bvPrice2(e) {
    this.setData({
      price2: e.detail.value
    })
  },
  bvPrice2Count(e) {
    this.setData({
      price2count: e.detail.value
    })
  },
  bvPrice3(e) {
    this.setData({
      price3: e.detail.value
    })
  },
  bvPrice3Count(e) {
    this.setData({
      price3count: e.detail.value
    })
  },
  bvPrice4(e) {
    this.setData({
      price4: e.detail.value
    })
  },
  bvPrice4Count(e) {
    this.setData({
      price4count: e.detail.value
    })
  },
  bvReward(e) {
    this.setData({
      reward: e.detail.value
    })
  },
  bvRewardTime(e) {
    this.setData({
      rewardtime: e.detail.value
    })
  },
  bvChangeScore(e) {
    this.setData({
      score: e.detail.value
    })
  },
  bvChangeStatus(e) {
    this.setData({
      status: e.detail.value
    })
  },

  bvChooseProductImage(e) {
    this.setData({
      productview: e.detail.all,
      productimageuploadlock: false
    })
  },
  bvRemoveProductImage(e) {
    this.setData({
      productview: e.detail.all,
      productimageuploadlock: false
    })
  },
  bvUploadProductImage(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.productname == "" || this.data.productname == null) {
      utils._ErrorToast("商品名称不能为空")
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        utils._ErrorToast("请勿重复提交")
      } else {
        if (this.data.productview.length == 0) {
          this.data.productimage = []
        } else {
          for (let i = 0; i < this.data.productview.length; i++) {
            const filePath = this.data.productview[i]
            const cloudPath = 'product/' + this.data.productname + '/' + this.data.productname + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.productimage = this.data.productimage.concat(res.fileID)
              }
            })
          }
          this.setData({
            imageuploadlock: true // 修改上传状态为锁定
          })
        }

        console.log("productimage", that.data.productimage)
        // 异步上传，打印attachment时尚未返回数据
      }
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
  bvDeleteFile(e) {
    console.log(this.data.attachmentfile)
    wx.cloud.deleteFile({
      //微信云储存中的文件唯一身份fileID，最多可删除50条
      fileList: [e.currentTarget.dataset.link],
      success: (res => {
        console.log(res)
        // 注意这里数组删除方法的细节，splice删除完以后还要setDate重新赋值才可以
        this.data.attachmentfile.splice([e.currentTarget.dataset.name], 1)
        this.setData({
          attachmentfile: this.data.attachmentfile
        })
        console.log("修改后this.data.attachmentfile", this.data.attachmentfile)
      }),
      fail: (err => {
        console.log(err)
      })
    })
    console.log(this.data.attachmentfile)
  },
  bvUploadFile(e) {
    // 判断individualname是否空值
    if (this.data.productname == "" || this.data.productname == null) {
      utils._ErrorToast("商品名称不能空")
    } else {
      // 判断是否重复提交
      if (this.data.fileuploadlock) {
        // 锁定时很执行
        utils._ErrorToast("请勿重复提交")

      } else {
        for (let i = 0; i < this.data.tempFilePaths.length; i++) {
          const filePath = this.data.tempFilePaths[i].path
          const cloudPath = 'product/' + this.data.productname + '/' + this.data.tempFilePaths[i].name
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              let str = String(this.data.tempFilePaths[i].name) //字符串，想要的是以下划线截取前后的字符
              let s = str.lastIndexOf('.') //找到最后一次出现点号的位置
              let filename = str.substring(0, s) //取点号前的字符
              console.log("filename", filename)
              var obj = new Object();
              obj = {
                [filename]: res.fileID
              }
              // 构建数组并合并起来
              this.data.attachmentfile.push(obj)
              utils._SuccessToast("上传成功")
              this.data.fileuploadlock = true // 修改上传状态为锁定
            },
            complete: res => {
              console.log(res)
            }
          })
        }


        console.log("attachmentfile", this.data.attachmentfile)
        // 异步上传，打印attachment时尚未返回数据
      }
    }

  },
  bvChooseFile(e) {
    wx.chooseMessageFile({
      count: 4,
      type: 'file',
      success: res => {
        console.log("res.tempFiles", res.tempFiles)
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          tempFilePaths: res.tempFiles
        })
      }
    })
  },

  // 异步新增数据方法
  addData() {
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      utils._ErrorToast("请勿重复提交")
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("PRODUCT").add({
          data: {
            AddDate: new Date().toLocaleString('chinese', {
              hour12: false
            }),
            Status: this.data.status,
            ProductName: this.data.productname,
            Outline: this.data.outline,
            StartDate: this.data.startdate,
            EndDate: this.data.enddate,
            Description: this.data.description,
            Category1: this.data.category1,
            Category2: this.data.category2,
            Category3: this.data.category3,
            ServiceArea: this.data.servicearea,
            HandlePlace: this.data.handleplace,
            IssuedBy: this.data.issuedby,
            Situation: this.data.situation,
            Forbid: this.data.forbid,
            DocList: this.data.doclist,
            ProcessingTime: this.data.processingtime,
            Reward: this.data.reward,
            RewardTime: this.data.rewardtime,
            Provider: this.data.provider,
            ProviderPrice: this.data.providerprice,
            ProviderCountPrice: this.data.providercountprice,
            Price1: this.data.price1,
            Price1Count: Number(this.data.price1count),
            Price2: this.data.price2,
            Price2Count: Number(this.data.price2count),
            Price3: this.data.price3,
            Price3Count: Number(this.data.price3count),
            Price4: this.data.price4,
            Price4Count: Number(this.data.price4count),
            Score: Number(this.data.score),
            ProductImage: this.data.productimage,
            AttachmentFile: this.data.attachmentfile,
          },
          success: res => {
            console.log('新增数据成功', res)
            utils._SuccessToast("新增数据成功")
          },
          fail: res => {
            console.log("新增数据失败", res)
            utils._ErrorToast("新增数据失败")
          }
        }),
        // 以上新增数据结束
        this.data.sublock = true // 修改上传状态为锁定
    }
  },
  // 更新数据
  updateData() {
    // 获取数据库引用
    const db = wx.cloud.database()
    // 新增数据
    db.collection("PRODUCT").doc(this.data.recordid).update({
      data: {
        Status: this.data.status,
        ProductName: this.data.productname,
        Outline: this.data.outline,
        StartDate: this.data.startdate,
        EndDate: this.data.enddate,
        Description: this.data.description,
        Category1: this.data.category1,
        Category2: this.data.category2,
        Category3: this.data.category3,
        ServiceArea: this.data.servicearea,
        HandlePlace: this.data.handleplace,
        IssuedBy: this.data.issuedby,
        Situation: this.data.situation,
        Forbid: this.data.forbid,
        DocList: this.data.doclist,
        ProcessingTime: this.data.processingtime,
        Reward: this.data.reward,
        RewardTime: this.data.rewardtime,
        Provider: this.data.provider,
        ProviderPrice: this.data.providerprice,
        ProviderCountPrice: this.data.providercountprice,
        Price1: this.data.price1,
        Price1Count: this.data.price1count,
        Price2: this.data.price2,
        Price2Count: this.data.price2count,
        Price3: this.data.price3,
        Price3Count: this.data.price3count,
        Price4: this.data.price4,
        Price4Count: this.data.price4count,
        ProductImage: this.data.productimage,
        AttachmentFile: this.data.attachmentfile,
        Score: this.data.score,
        UpdateDate: new Date().toLocaleString('chinese', {
          hour12: false
        })
      },
      success: res => {
        console.log('更新数据成功', res)
        utils._SuccessToast("更新数据成功")
        // 更新成功后再次云函数查询商品并存入本地
        wx.cloud.callFunction({
          name: "NormalQuery",
          data: {
            collectionName: "PRODUCT",
            command: "and",
            where: [{
                Status: "停售"
              },
              {
                Status: "在售"
              }
            ]
          },
          success: res => {
            wx.setStorageSync('LProductList', res.result.data)
            console.log(res)
          }
        })
      },
      fail: res => {
        console.log("更新数据失败", res)
        utils._ErrorToast("更新数据失败")
      }
    })
    // 以上更新数据结束
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    console.log(options)
    this.setData({
      recordid: options.id,
      sortarray: app.globalData.Gsetting.ProductSort,
    })

    if (options.id != undefined && options.id != "") {
      // 筛选指定记录,此处数据范围是之前根据admin身份获取的全部产品数据，供应伙伴页面应缩小范围为本人提交产品
      var fliter = [];
      // var _this = this
      for (var i = 0; i < app.globalData.Gproductlist.length; i++) {
        if (app.globalData.Gproductlist[i]._id == this.data.recordid) {
          fliter.push(app.globalData.Gproductlist[i]);
        }
      }
      console.log(fliter);
      this.setData({
        recordid: fliter[0]._id,
        adddate: fliter[0].AddDate,
        status: fliter[0].Status,
        productname: fliter[0].ProductName,
        outline: fliter[0].Outline,
        startdate: fliter[0].StartDate,
        enddate: fliter[0].EndDate,
        description: fliter[0].Description,
        category1: fliter[0].Category1,
        category2: fliter[0].Category2,
        category3: fliter[0].Category3,
        servicearea: fliter[0].ServiceArea,
        handleplace: fliter[0].HandlePlace,
        issuedby: fliter[0].IssuedBy,
        situation: fliter[0].Situation,
        forbid: fliter[0].Forbid,
        doclist: fliter[0].DocList,
        processingtime: fliter[0].ProcessingTime,
        reward: fliter[0].Reward,
        rewardtime: fliter[0].RewardTime,
        provider: fliter[0].Provider,
        providerprice: fliter[0].ProviderPrice,
        providercountprice: fliter[0].ProviderCountPrice,
        price1: fliter[0].Price1,
        price1count: fliter[0].Price1Count,
        price2: fliter[0].Price2,
        price2count: fliter[0].Price2Count,
        price3: fliter[0].Price3,
        price3count: fliter[0].Price3Count,
        price4: fliter[0].Price4,
        price4count: fliter[0].Price4Count,
        score: fliter[0].Score,
        updatedate: fliter[0].UpdateDate,
        productview: fliter[0].ProductImage,
        productimage:fliter[0].ProductImage,
        attachmentfile: fliter[0].AttachmentFile,
        user: fliter[0]._openid,
      })
    }
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