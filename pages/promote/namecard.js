const app = getApp()
const utils = require("../../utils/utils");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    tempinviterid: "",
    creatorid: "",
    title: "恭呈名片,敬请关照!",
    remark: "",
    // 登录框参数
    loginshow: false,
    // 名片参数
    type: "",
    cardinfo: [],
    viewed: [],
    link: "/pages/product/allproduct",
    linkshow: true,
    sample: {
      CardBg: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/namecard/bg4.jpg?sign=d6efb4092f3b166f2dd79649a46f19a0&t=1682499042",
      CardImages: [],
      CompanyLogo: ["https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/oo7kw5rohI15ogf6TCX_SGAxYUao/%E5%B8%A6unionid%E5%8F%82%E6%95%B0%E9%80%8F%E6%98%8E.png?sign=a2fe221407105d1394df92016c9ab7b4&t=1682498686"],
      CompanyName: "创企服有限公司（样版）",
      BusinessScope: "  创企服有限公司成立于2021年，专注于收集和整理各地税务优惠政策、财政奖励政策，并为企业提供企业托管、财税相关服务。",
      UserName: "创企服",
      Title: "产品经理",
      Handphone: "123456",
      WeChat: "123456",
      Email: "123456@163.com",
      Telephone: "0755-12345678",
      Website: "www.123456.com",
      Address: "广东省深圳市南山区粤海街道",
    },
    adddate: "",
    updatedate: ""
  },

  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      userphone: e.detail.userphone,
    })
  },
  bvViewed: function (e) {
    let that = this

    app.globalData.c1.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "NameCardViewed",
        command: "and",
        where: [{
          NameCardCreatorId: app.globalData.Guserid,
        }],
        orderbykey: "SysAddDate",
        orderby: "desc",
      },
      success: res => {
        console.log(res.result.data)
        that.setData({
          viewed: res.result.data
        })
      }
    })

  },
  bvEdit: function (e) {
    // 待更新，用户手机登录后如何更新参数
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      // 非会员先调用登录框
      this.setData({
        loginshow: true
      })
    } else {
      wx.redirectTo({
        url: "../promote/namecardedit"
      })
    }
  },
  // 长按号码响应函数
  bvPhoneNumTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cardinfo.handphone,
    })
  },

  addContact: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['添加联系人'],
      success: function (res) {
        // 添加到手机通讯录
        wx.addPhoneContact({
          firstName: that.data.cardinfo.username, //联系人姓名
          title: that.data.cardinfo.title, //联系人职位
          mobilePhoneNumber: that.data.cardinfo.handphone, //联系人手机号
          weChatNumber: that.data.cardinfo.wechat, //微信
          email: that.data.cardinfo.email, //电子邮件
          organization: that.data.cardinfo.companyname, //公司
          url: that.data.cardinfo.website, //公司网站

        })
      }
    })
  },
  bvLink(e) {
    console.log(e.currentTarget.dataset.link)
    // 注意navigate不能跳转到有导航的页面
    wx.navigateTo({
      // url: e.currentTarget.dataset.link,
      url: '/pages/product/allproduct',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("传入的参数为", options)
    let that = this
    if (options.userid || options.scene) {
      // 如果有传入参数，则是通过推广进入
      if (options.userid) {
        // 如果是通过分享链接进入
        this.data.params = options
        this.data.remark = "通过创企服用户分享名片进入"
        this.data.creatorid = options.creatorid
        this.setData({
          // 页面根据tempinviterid的值设置了显隐渲染，所以需要用setData赋值
          tempinviterid: options.userid
        })

      } else if (options.scene) {
        // 如果是通过扫码进入（scene中只有参数值，通过&和顺序区分）
        let scene = decodeURIComponent(options.scene);
        //可以连接多个参数值，&是我们定义的参数链接方式
        // let inviterid = scene.split('&')[0];
        // let productid = scene.split("&")[1];
        this.data.params = scene
        this.data.tempinviterid = scene.split('&')[0]
        this.data.creatorid = scene.split('&')[1]
        this.data.remark = "通过创企服用户分享小程序码进入"
        // 该功能仅管理员使用，默认使用管理员unionid做推荐人
        if (this.data.tempinviterid == "") {
          this.data.tempinviterid = "oo7kw5rohI15ogf6TCX_SGAxYUao"
        }
      }
      // 通过分享进入，执行用户登录操作，展示分享人的名片信息
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
      // 本地函数查询名片信息
      const db = app.globalData.c1.database()
      db.collection('NAMECARD').where({
        CreatorId: this.data.creatorid
      }).get({
        success: async res => {
          // 展示名片分享人的名片
          console.log(res.data)
          var fliter = res.data
          // 如果有背景，就进行转换
          if (res.data[0].CardBg != "" && res.data[0].CardBg != undefined) {
            var filelist1 = [res.data[0].CardBg]
            await app.globalData.c1.getTempFileURL({
              fileList: filelist1
            }).then(res => {
              console.log("执行顺序1", res.fileList)
              fliter[0].CardBg = res.fileList[0].tempFileURL
            })
          }
          // 如果有LOGO，就进行转换
          if (res.data[0].CompanyLogo != "" && res.data[0].CompanyLogo != undefined) {
            var filelist2 = [res.data[0].CompanyLogo]
            await app.globalData.c1.getTempFileURL({
              fileList: filelist2
            }).then(res => {
              console.log("执行顺序2", res.fileList)
              fliter[0].CompanyLogo = res.fileList[0].tempFileURL
            })
          }
          // 如果有附图，就进行转换
          if (res.data[0].CardImages[0] != "" && res.data[0].CardImages[0] != undefined) {
            var filelist3 = res.data[0].CardImages
            await app.globalData.c1.getTempFileURL({
              fileList: filelist3
            }).then(res => {
              console.log("执行顺序3", res.fileList)
              fliter[0].CardImages = [res.fileList[0].tempFileURL]
            })
          }
          console.log("执行顺序4")
          that.setData({
            cardinfo: fliter[0]
          })

          if (app.globalData.Guserid != this.data.creatorid) {
            // 浏览量更新
            that._viewadd(this.data.creatorid)
            // 浏览人已发布的名片信息会发送给被浏览人
            if (app.globalData.Guserdata.NameCardStatus == "Published") {
              // 本地函数查询名片信息
              const db = app.globalData.c1.database()
              db.collection('NAMECARD').where({
                CreatorId: app.globalData.Guserid
              }).get({
                success: res => {
                  // 登记本人名片
                  db.collection('NameCardViewed').add({
                    data: {
                      NameCardCreatorId: that.data.creatorid,
                      ViewerId: app.globalData.Guserid,
                      ViewerCompany: res.data[0].CompanyName,
                      ViewerName: res.data[0].UserName,
                      ViewerTitle: res.data[0].Title,
                      ViewerHandPhone: res.data[0].Handphone,
                      From: "创企服"
                    },
                    success: res => {
                      console.log("被查看信息添加了")
                    }
                  })
                }
              })
            }
            this.data.title = app.globalData.Guserdata.UserInfo.nickName + "推荐给您:"
          }
        }
      })
    } else {
      if (options.creatorid) {
        // 通过编辑之后返回打开
        // 本地函数查询名片信息
        const db = app.globalData.c1.database()
        db.collection('NAMECARD').where({
          CreatorId: options.creatorid
        }).get({
          success: async res => {
            var fliter = res.data
            // 如果有背景，就进行转换
            if (res.data[0].CardBg != "" && res.data[0].CardBg != undefined) {
              var filelist1 = [res.data[0].CardBg]
              await app.globalData.c1.getTempFileURL({
                fileList: filelist1
              }).then(res => {
                console.log("执行顺序1", res.fileList)
                fliter[0].CardBg = res.fileList[0].tempFileURL
              })
            }
            // 如果有LOGO，就进行转换
            if (res.data[0].CompanyLogo != "" && res.data[0].CompanyLogo != undefined) {
              var filelist2 = [res.data[0].CompanyLogo]
              await app.globalData.c1.getTempFileURL({
                fileList: filelist2
              }).then(res => {
                console.log("执行顺序2", res.fileList)
                fliter[0].CompanyLogo = res.fileList[0].tempFileURL
              })
            }
            // 如果有附图，就进行转换
            if (res.data[0].CardImages[0] != "" && res.data[0].CardImages[0] != undefined) {
              var filelist3 = res.data[0].CardImages
              await app.globalData.c1.getTempFileURL({
                fileList: filelist3
              }).then(res => {
                console.log("执行顺序3", res.fileList)
                fliter[0].CardImages = [res.fileList[0].tempFileURL]
              })
            }
            console.log("执行顺序4")
            that.setData({
              cardinfo: fliter[0]
            })
          }
        })
      } else {
        // 在本人小程序中打开
        console.log("在本人小程序中打开")
        if (app.globalData.Guserdata.NameCardStatus != "Published") {
          // 没有名片则展示样本
          console.log("执行了")
          this.setData({
            cardinfo: this.data.sample
          })
        } else {
          // 本地函数查询名片信息
          const db = app.globalData.c1.database()
          db.collection('NAMECARD').where({
            CreatorId: app.globalData.Guserid
          }).get({
            success: async res => {
              console.log(res)
              var fliter = res.data
              // 如果有背景，就进行转换
              if (res.data[0].CardBg != "" && res.data[0].CardBg != undefined) {
                var filelist1 = [res.data[0].CardBg]
                await app.globalData.c1.getTempFileURL({
                  fileList: filelist1
                }).then(res => {
                  console.log("执行顺序1", res.fileList)
                    fliter[0].CardBg = res.fileList[0].tempFileURL
                })
              }
              // 如果有LOGO，就进行转换
              if (res.data[0].CompanyLogo != "" && res.data[0].CompanyLogo != undefined) {
                var filelist2 = [res.data[0].CompanyLogo]
                await app.globalData.c1.getTempFileURL({
                  fileList: filelist2
                }).then(res => {
                  console.log("执行顺序2", res.fileList)
                  fliter[0].CompanyLogo = res.fileList[0].tempFileURL
                })
              }
              // 如果有附图，就进行转换
              if (res.data[0].CardImages[0] != "" && res.data[0].CardImages[0] != undefined) {
                var filelist3 = res.data[0].CardImages
                await app.globalData.c1.getTempFileURL({
                  fileList: filelist3
                }).then(res => {
                  console.log("执行顺序3", res.fileList)
                  let num = res.fileList.map(function (item, index) {
                    return item.tempFileURL
                  })
                  console.log(num) 
                  fliter[0].CardImages = num
                })
              }
              console.log("执行顺序4")
              that.setData({
                cardinfo: fliter[0]
              })
            }
          })
        }
      }
    }
  },
  _viewadd(creatorid) {

    app.globalData.c1.callFunction({
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
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.title,
      query: '/pages/promote/namecard?userid=' + app.globalData.Guserid + '&creatorid=' + this.data.cardinfo.CreatorId,
      imageUrl: '', //封面
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.title,
      path: '/pages/promote/namecard?userid=' + app.globalData.Guserid + '&creatorid=' + this.data.cardinfo.CreatorId,
      imageUrl: '', //封面，留空自动抓取500*400生成图片，真机有效，电脑调试会抓取整个页面
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