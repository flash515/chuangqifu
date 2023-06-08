const app = getApp()
const utils = require("../../utils/utils");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardinfo: [],
    cardbgarray: [], //系统背景
    cardbg: "", //名片背景
    bgview: "", //自选背景的网络路径
    tempbg: [],
    bgedit: "", //剪裁背景临时路径

    companylogo: "",
    templogo: [],
    logoedit: "", //剪裁背景临时路径

    cardimages: [], //名片其他图片资料
    tempimages: [], //名片其他图片资料的临时文件

    companyname: "",
    businessscope: "",
    username: "",
    handphone: "",
    title: "",
    wechat: "",
    email: "",
    telephone: "",
    website: "",
    address: "",
    // 图片编辑

    bgcliperbtn: false,
    logocliperbtn: false,

    bgclipershow: false,
    logoclipershow: false,
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
    updatedate: "",
    logouploadlock: true,
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

  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvKeyWords(e) {
    this.setData({
      keywords: e.detail.value
    })
  },

  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvUserName(e) {
    this.setData({
      username: e.detail.value
    })
  },
  bvHandPhone(e) {
    this.setData({
      handphone: e.detail.value
    })
  },
  bvTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bvWeChat(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  bvEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bvTelephone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  bvWebsite(e) {
    this.setData({
      website: e.detail.value
    })
  },
  bvAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },

  bvBgSelect(e) {
    // 设定名片背景
    this.setData({
      cardbg: e.detail.key
    })
    console.log("cardbg", e.detail.key)
  },

  bvChooseBg(e) {
    // 选择自有背景,使用单个文件上传，返回字符型结果,注意current是数组,tempbg也是数组
    console.log(e.detail.current)
    // this.data.tempbg=e.detail.current[0]
    this.setData({
      bgcliperbtn: true,
      tempbg: e.detail.current
    })
  },
  bvChooseLogo(e) {
    console.log(e.detail.all)
    this.setData({
      logocliperbtn: true,
      templogo: e.detail.current
    })
  },
  bvClipBg() {
    this.setData({
      bgclipershow: true,
      bgedit: this.data.tempbg[0]
    })
  },
  bvClipLogo() {
    this.setData({
      logoclipershow: true,
      logoedit: this.data.templogo[0]
    })
  },

  linclipBg(e) {
    this.setData({
      tempbg: [e.detail.url]
    })
    console.log('生成的图片临时链接为：', this.data.tempbg);
  },

  linclipLogo(e) {
    this.setData({
      templogo: [e.detail.url]
    })
    console.log('生成的图片临时链接为：', this.data.templogo);
  },

  async bvUploadBg() {
    // 文件上传时要把tempbg组织换成string
    let cloudpath1 = 'namecard/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'cardbg'
    var files1 = await utils._UploadFile(this.data.tempbg[0], cloudpath1)
    this.setData({
      // 额外使用一个bgview是为了删除图片时确保是删除bgview而不是cardbg,避免误删除系统图片
      bgview: files1,
      cardbg: files1,
    })
    console.log(this.data.cardbg)
  },
  async bvUploadLogo() {
    // 文件上传时要把tempbg组织换成string
    let cloudpath2 = 'namecard/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'logo'
    var files2 = await utils._UploadFile(this.data.templogo[0], cloudpath2)
    this.setData({
      companylogo: files2,
    })
    console.log(this.data.companylogo)
  },

  bvRemoveBg(e) {
    console.log(e.detail.current)
    this.setData({
      tempbg: [],
      bgedit: "",
    })
  },
  bvRemoveLogo(e) {
    console.log("companylogo", e.detail.current)
    this.setData({
      templogo: [],
      logoedit: ""
    })

  },

  bvDeleteBg(e) {
    wx.cloud.deleteFile({
      fileList: this.data.bgview,
      success: res => {
        console.log(res)
        this.setData({
          bgview: "",
          cardbg: "",
          bgedit: "",
          tempbg: [],
        })
      }
    })
  },
  bvDeleteLogo(e) {
    wx.cloud.deleteFile({
      fileList: this.data.companylogo,
      success: res => {
        console.log(res)
        this.setData({
          companylogo: "",
          logoedit: "",
          templogo: [],
        })
      }
    })
  },

  async bvChooseImage(e) {
    console.log(e.detail.all)
    let cloudpath3 = 'namecard/' + app.globalData.Guserdata.UserInfo.UserPhone + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'cardimages'
    var files3 = await utils._UploadFiles(e.detail.all, cloudpath3)
    this.setData({
      cardimages: files3,
    })
  },

  bvRemoveImage(e) {
    console.log(e.detail.index)
    // 用一个指令即创建了fileList用于下一步删除，也改变了cardimages数组
    var fileList = this.data.cardimages.splice(e.detail.index, 1)
    this.setData({
      cardimages: this.data.cardimages
    })
    console.log("cardimages", this.data.cardimages)
    console.log(fileList)
    wx.cloud.deleteFile({
      fileList,
      success: res => {
        console.log("res", res)
      }
    })

  },

  //发布到企业广场
  async bvPublish(e) {
    let that = this
    if (this.data.username == '') {
      utils._ErrorToast("请填写姓名")
      return
    }
    if (this.data.handphone == '' && this.data.telephone == '') {
      utils._ErrorToast("缺少手机或电话")
      return
    }
    if (this.data.category1 == '' || this.data.category2 == '' || this.data.category3 == '') {
      utils._ErrorToast("缺少行业分类")
      return
    }
    if (this.data.keywords == '') {
      utils._ErrorToast("缺少搜索关键词")
      return
    }
    if (app.globalData.Guserdata.NameCardStatus == undefined) {
      // 首次发布新增记录
      const db = wx.cloud.database()
      db.collection('NAMECARD').add({
        data: {
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          CardBg: this.data.cardbg,
          CompanyLogo: this.data.companylogo,
          CardImages: this.data.cardimages,
          UserName: this.data.username,
          Title: this.data.title,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          Handphone: this.data.handphone,
          CompanyName: this.data.companyname,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          KeyWords: this.data.keywords,
          Category1: this.data.category1,
          Category2: this.data.category2,
          Category3: this.data.category3,
          View: 0,
          CreatorId: app.globalData.Guserid
        },
        success: res => {
          this.data.publishstatus = true
          db.collection('USER').where({
            UserId: app.globalData.Guserid
          }).update({
            data: {
              ["NameCardStatus"]: "Published",
            },
            success: res => {
              utils._SuccessToast("名片发布成功")
              wx.redirectTo({
                url: "../promote/namecard?creatorid=" + app.globalData.Guserid
              })
            },
          })

        },
      })
    } else {
      // 再次发布是更新
      const db = wx.cloud.database()
      db.collection('NAMECARD').where({
        CreatorId: app.globalData.Guserid
      }).update({
        data: {
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          CardBg: this.data.cardbg,
          CompanyLogo: this.data.companylogo,
          CardImages: this.data.cardimages,
          UserName: this.data.username,
          Title: this.data.title,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          Handphone: this.data.handphone,
          CompanyName: this.data.companyname,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          KeyWords: this.data.keywords,
          Category1: this.data.category1,
          Category2: this.data.category2,
          Category3: this.data.category3,
        },
        success: res => {
          utils._SuccessToast("名片发布成功")
          wx.redirectTo({
            url: "../promote/namecard?creatorid=" + app.globalData.Guserid
          })
        },
      })
    }
  },

  //保存名片信息
  async bvPreView(e) {
    console.log("保存执行了")
    this.data.cardinfo = {
      ["CardBg"]: this.data.cardbg,
      ["CompanyLogo"]: this.data.companylogo,
      ["CardImages"]: this.data.cardimages,
      ["UserName"]: this.data.username,
      ["Title"]: this.data.title,
      ["WeChat"]: this.data.wechat,
      ["Email"]: this.data.email,
      ["Telephone"]: this.data.telephone,
      ["Website"]: this.data.website,
      ["Handphone"]: this.data.handphone,
      ["CompanyName"]: this.data.companyname,
      ["Address"]: this.data.address,
      ["BusinessScope"]: this.data.businessscope,
      ["KeyWords"]: this.data.keywords,
      ["Category1"]: this.data.category1,
      ["Category2"]: this.data.category2,
      ["Category3"]: this.data.category3,
      ["UpdateDate"]: new Date().toLocaleString('chinese', {
        hour12: false
      })
    }
    wx.setStorageSync('namecard', this.data.cardinfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('NameCardSetting').doc('0122a5876443793e098bd33e0045f553').get({
      success: res => {
        this.setData({
          cardbgarray: res.data.NameCardBg,
          businesssortarray: res.data.BusinessSortArray
        })
        console.log("行业类别更新成功")
      }
    })
    if (app.globalData.Guserdata.NameCardStatus == "Published") {
      console.log("查询执行了")
      const db = wx.cloud.database()
      db.collection('NAMECARD').where({
        CreatorId: app.globalData.Guserid
      }).get({
        success: res => {
          console.log("res",res)
          this.setData({
            cardbg: res.data[0].CardBg,
            tempbg: [res.data[0].CardBg],
            companylogo: res.data[0].CompanyLogo,
            templogo:[res.data[0].CompanyLogo],
            cardimages: res.data[0].CardImages,
            tempimages:res.data[0].CardImages,
            companyname: res.data[0].CompanyName,
            username: res.data[0].UserName,
            handphone: res.data[0].Handphone,
            title: res.data[0].Title,
            wechat: res.data[0].WeChat,
            email: res.data[0].Email,
            website: res.data[0].Website,
            telephone: res.data[0].Telephone,
            businessscope: res.data[0].BusinessScope,
            address: res.data[0].Address,
            updatedate: res.data[0].UpdateDate,
            category1: res.data[0].Category1,
            category2: res.data[0].Category2,
            category3: res.data[0].Category3,
            keywords: res.data[0].KeyWords,
          })
          console.log("查询到名片")
        },

      })
    } else {
      console.log("缓存执行了")

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

})