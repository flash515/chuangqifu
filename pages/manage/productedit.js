const app = getApp()
Page({
  data: {
    x:0,
    // 传值参数
    recordid: "",
    pageParam: "",
    // 产品参数
    procudtarray: [], //通过查询功能得到的产品数组
    procudtdetail: [],
    array: [],
    items: [
      {value: 'System', name: '系统默认比例', checked: 'true'},
      {value: 'Custom', name: '自设比例'},
    ],
    // 多列选择器
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '无脊柱动物'
        },
        {
          id: 1,
          name: '脊柱动物'
        }
      ], [
        {
          id: 0,
          name: '扁性动物'
        },
        {
          id: 1,
          name: '线形动物'
        },
        {
          id: 2,
          name: '环节动物'
        },
        {
          id: 3,
          name: '软体动物'
        },
        {
          id: 3,
          name: '节肢动物'
        }
      ], [
        {
          id: 0,
          name: '猪肉绦虫'
        },
        {
          id: 1,
          name: '吸血虫'
        }
      ]
    ],
    multiIndex: [0, 0, 0],
    // 表单参数
    adddate: "",
    productid: "",
    category1: "",
    category2: "",
    category3: "",
    producttype: "",
    productname: "",
    outline: "",
    startdate: "",
    enddate: "",
    description: "",
    issuedplace: "",
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
    commissiontype:"system",
    commission1:"",
    commission2:"",
    providercountprice: 0,
    price1count: 0,
    price2count: 0,
    price3count: 0,
    price4count: 0,
    commission1count:0,
    commission2count:0,
    reward: "",
    rewardtime: "",
    startdate: "",
    enddate: "",
    updatedate: "",
    status: "",
    score: 0,
    attachmentview: [], //用于展示数据库中的图片
    attachmentimage: [], //数据库中的图片
    attachmentfile: {},
    tempFilePaths: [],
    onsalechecked: false,
    sublock: false,
    fileuploadlock: false,
    imageuploadlock: false,
    recordcontral:false
  },
  //查询本人创建且符合模糊条件的记录
  onSearch(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCT').where(_.and([{
        _openid: app.globalData.Gopenid
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
if(res.data.length>1){
  this.setData({
    recordcontral:true
  })
}
        this.setcurrentdata()
      }
    })
  },
  onPreviousClick() {
    if(this.data.x==0){
      wx.showToast({
        title: '已经是第一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }else{
      this.data.x=this.data.x-1
      this.setcurrentdata()
    }
  },
  onNextClick() {
    if(this.data.x==this.data.productarray.length-1){
      wx.showToast({
        title: '已经是最后一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }else{
      this.data.x=this.data.x+1
      this.setcurrentdata()
    }
  },
  setcurrentdata() {
    this.setData({
      recordid: this.data.productarray[this.data.x]._id,
      adddate: this.data.productarray[this.data.x].AddDate,
      status: this.data.productarray[this.data.x].Status,
      productid: this.data.productarray[this.data.x].ProductId,
      category1: this.data.productarray[this.data.x].Category1,
      category2: this.data.productarray[this.data.x].Category2,
      category3: this.data.productarray[this.data.x].Category3,
      producttype: this.data.productarray[this.data.x].ProductType,
      productname: this.data.productarray[this.data.x].ProductName,
      outline: this.data.productarray[this.data.x].Outline,
      startdate: this.data.productarray[this.data.x].StartDate,
      enddate: this.data.productarray[this.data.x].EndDate,
      description: this.data.productarray[this.data.x].Description,
      issuedplace: this.data.productarray[this.data.x].IssuedPlace,
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
      commissiontype: this.data.productarray[this.data.x].CommissionType,
      commission1: this.data.productarray[this.data.x].Commission1,
      commission1count: this.data.productarray[this.data.x].Commission1Count,
      commission2: this.data.productarray[this.data.x].Commission2,
      commission2count: this.data.productarray[this.data.x].Commission2Count,
      score: this.data.productarray[this.data.x].Score,
      updatedate: this.data.productarray[this.data.x].UpdateDate,
      attachmentimage: this.data.productarray[this.data.x].AttachmentImage,
      attachmentfilee: this.data.productarray[this.data.x].AttachmentFile,
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
  bvRadioChanged(e) {
    this.setData({
      commissiontype: e.detail.key
    })
  },
  onsaleChange(e) {
    if (e.detail.value == true) {
      this.setData({
        status: "在售",
        onsalechecked: true
      })
      wx.showToast({
        title: '已开启在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        status: "停售",
        onsalechecked: false
      })
      wx.showToast({
        title: '已关闭在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  bvProductId(e) {
    this.setData({
      productid: e.detail.value
    })
  },
  // 通过事件绑定用户手机值
  bvProductName(e) {
    this.setData({
      productname: e.detail.value
    })
  },
  bvCategory1(e) {
    this.setData({
      category1: e.detail.value
    })
  },
  bvCategory2(e) {
    this.setData({
      category2: e.detail.value
    })
  },
  bvCategory3(e) {
    this.setData({
      category3: e.detail.value
    })
  },
  bvProductType(e) {
    this.setData({
      producttype: e.detail.value
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
  bvIssuedPlace(e) {
    this.setData({
      issuedplace: e.detail.value
    })
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
  bvCommission1(e) {
    this.setData({
      commission1: e.detail.value
    })
  },
  bvCommission1Count(e) {
    this.setData({
      commission1count: e.detail.value
    })
  },
  bvCommission2(e) {
    this.setData({
      commission2: e.detail.value
    })
  },
  bvCommission2Count(e) {
    this.setData({
      commission2count: e.detail.value
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
  onChangeTap(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvRemoveImage(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvUploadImage(e) {
    let that = this
    // 判断产品id是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写开票人姓名后再尝试上传资料",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.attachmentview.length == 0) {
          this.data.attachmentimage = []
        } else {
          for (let i = 0; i < this.data.attachmentview.length; i++) {
            const filePath = this.data.attachmentview[i]
            const cloudPath = 'product/' + this.data.productid + '/' + this.data.productid + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.attachmentimage = this.data.attachmentimage.concat(res.fileID)
              }
            })
          }

        }
        this.data.imageuploadlock = true // 修改上传状态为锁定
        console.log("attachmentimage", that.data.attachmentimage)
        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvUploadFile(e) {
    // 判断individualname是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写产品编号后再尝试上传资料",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.fileuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        for (let i = 0; i < this.data.tempFilePaths.length; i++) {
          const filePath = this.data.tempFilePaths[i].path
          const cloudPath = 'product/' + this.data.productid + '/' + this.data.tempFilePaths[i].name
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
              this.data.attachmentfile = Object.assign(this.data.attachmentfile, obj)
              wx.showToast({
                title: this.data.tempFilePaths[i].name + '上传成功',
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          })
        }

        this.data.fileuploadlock = true // 修改上传状态为锁定
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
        console.log("res.tempFiles", res)
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
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("PRODUCT").add({
          data: {
            AddDate: new Date().toLocaleDateString(),
            Status: this.data.status,
            ProductId: this.data.productid,
            Category1: this.data.category1,
            Category2: this.data.category2,
            Category3: this.data.category3,
            ProductType: this.data.producttype,
            ProductName: this.data.productname,
            Outline: this.data.outline,
            StartDate: this.data.startdate,
            EndDate: this.data.enddate,
            Description: this.data.description,
            IssuedPlace: this.data.issuedplace,
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
            CommissionType: this.data.commissiontype,
            Commission1: this.data.commission1,
            Commission1Count: Number(this.data.commission1count),
            Commission2: this.data.commission2,
            Commission2Count: Number(this.data.commission2count),
            Score: Number(this.data.score),
            AttachmentImage: this.data.attachmentimage,
            AttachmentFile: this.data.attachmentfile,
          },
          success(res) {
            console.log('新增数据成功', res.data)
            wx.showToast({
              title: '新增数据成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail(res) {
            console.log("新增数据失败", res)
            wx.showToast({
              title: '新增数据失败',
              icon: 'fail',
              duration: 2000 //持续的时间
            })
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
        ProductId: this.data.productid,
        Category1: this.data.category1,
        Category2: this.data.category2,
        Category3: this.data.category3,
        ProductType: this.data.producttype,
        ProductName: this.data.productname,
        Outline: this.data.outline,
        StartDate: this.data.startdate,
        EndDate: this.data.enddate,
        Description: this.data.description,
        IssuedPlace: this.data.issuedplace,
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
        CommissionType: this.data.commissiontype,
        Commission1: this.data.commission1,
        Commission1Count: Number(this.data.commission1count),
        Commission2: this.data.commission2,
        Commission2Count: Number(this.data.commission2count),
        AttachmentImage: this.data.attachmentimage,
        AttachmentFile: this.data.attachmentfile,
        Score: this.data.score,
        UpdateDate: new Date().toLocaleDateString()
      },
      success(res) {
        console.log('更新数据成功', res)
        wx.showToast({
          title: '更新数据成功',
          icon: 'success',
          duration: 2000 //持续的时间
        })
        // 更新成功后重新查询本人的产品并存入本地
        db.collection('PRODUCT').where({
          _openid: app.globalData.Gopenid
        }).get({
          success: res => {
            wx.setStorageSync('LPersonalProduct', res.data)
            console.log(res)
          }
        })
      },
      fail(res) {
        console.log("更新数据失败", res)
        wx.showToast({
          title: '更新数据失败',
          icon: 'fail',
          duration: 2000 //持续的时间
        })
      }
    })
    // 以上更新数据结束
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      pageParam: options,
      recordid: options._id,
    })
    console.log("pageParam", this.data.pageParam._id);
    // 通过产品总览过来的页面适合从本地存储中读取
    wx.getStorage({
      key: 'LPersonalProduct',
      success: res => {
        this.setData({
          productarray: res.data
        })
        console.log("产品数组", this.data.productarray)
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i]._id == this.data.pageParam._id) {
            fliter.push(this.data.productarray[i]);
          }
        }
        console.log(fliter);
        this.setData({
          productdetail: fliter,
          adddate: fliter[0].AddDate,
          status: fliter[0].Status,
          productid: fliter[0].ProductId,
          category1: fliter[0].Category1,
          category2: fliter[0].Category2,
          category3: fliter[0].Category3,
          producttype: fliter[0].ProductType,
          productname: fliter[0].ProductName,
          outline: fliter[0].Outline,
          startdate: fliter[0].StartDate,
          enddate: fliter[0].EndDate,
          description: fliter[0].Description,
          issuedplace: fliter[0].IssuedPlace,
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
          commissiontype: fliter[0].CommissionType,
          commission1: fliter[0].Commission1,
          commission1count: fliter[0].Commission1Count,
          commission2: fliter[0].Commission2,
          commission2count: fliter[0].Commission2Count,
          score: fliter[0].Score,
          updatedate: fliter[0].UpdateDate,
          attachmentimage: fliter[0].AttachmentImage,
          attachmentfile: fliter[0].AttachmentFile,
        })
        if (fliter[0].Status == "在售") {
          this.setData({
            onsalechecked: true
          })
        } else {
          this.setData({
            onsalechecked: false
          })
        }
        for (let i = 0; i < fliter[0].AttachmentImage.length; i++) {
          wx.getImageInfo({
            //把图片地址转换为本地地址
            src: fliter[0].AttachmentImage[i],
            success: (res) => {
              this.setData({
                attachmentview: this.data.attachmentview.concat(res.path)
              })
              console.log("attachmentview", this.data.attachmentview)
            }
          })
        }

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