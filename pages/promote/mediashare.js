const app = getApp()
var utils = require("../../utils/utils")
const Time= require("../../utils/getDates");
const wxpay = require("../../utils/WxPay")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    inviterid: "",
    tempinviterid: "",
    remark: "",
    indirectinviterid: "",
    userinfo: {},
    width:"",
    height:"",
    // 登录框相关变量
    loginshow: false,

    // 页面相关
    infoshares: [],
    infoid: "",
    infocover: "",
    infotitle: "",
    comments: [],
    // currentinfoid: "",
    creatorid: "",
    userid: "",
    avatarurl: "",
    nickname: "",
    donateshow: false,
    commentshow: false,
    replycontent: "",
    replyshow: false,
    infoshow: true,
    // 赞赏相关参数
    isPaying: false,
    btnname: "赞赏",
    totalfee: 0,
    praise: 0,
    creatorpoints: 0,
    inviterpoints: 0,
    indirectinviterpoints: 0,
    donate: [{
      praise: 500,
      price: 5,
      creatorpoints: 2.5,
      inviterpoints: 0.75,
      indirectinviterpoints: 0.25,
    }, {
      praise: 1100,
      price: 10,
      creatorpoints: 5,
      inviterpoints: 1.5,
      indirectinviterpoints: 0.5,
    }, {
      praise: 2300,
      price: 20,
      creatorpoints: 10,
      inviterpoints: 3,
      indirectinviterpoints: 1,
    }, {
      praise: 3500,
      price: 30,
      creatorpoints: 15,
      inviterpoints: 4.5,
      indirectinviterpoints: 1.5,
    }],
  },
  toCreator(e) {
    console.log(e.currentTarget.dataset.id)
    let that = this
    utils.CloudInit(function (c1) {
      const db = c1.database()
      if (e.currentTarget.dataset.id == app.globalData.Guserid) {
        // 如果用户是资讯创建者,显示本人全部发布资讯
        db.collection('INFOSHARE').where({
          CreatorId: e.currentTarget.dataset.id,
          InfoType:"Media",
        }).get({
          success: res => {
            console.log(res)
            var fliter = res.data
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].InfoVideo != "") {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoVideo]
              } else {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoImage]
              }
              c1.getTempFileURL({
                fileList: filelist
              }).then(res => {
                console.log(res.fileList)
                if (fliter[i].InfoVideo != "") {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoVideo = res.fileList[1].tempFileURL
                } else {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoImage = res.fileList[1].tempFileURL
                }
                if (i + 1 == fliter.length) {
                  console.log("执行了")
                  // 展示接收到的info
                  that.setData({
                    infoshares: fliter,
                    creatorid: fliter[0].CreatorId
                  })
                  that.data.infocover = fliter[0].InfoCover
                  that.data.infotitle = fliter[0].InfoTitle
                  // 调用播放视频方法
                  that.startUp()
                } else {
                  console.log("没执行")
                }

              }).catch(error => {
                // handle error
              })

            }
          }
        })
      } else {
        // 如果用户不是资讯创建者,只打开创建者公开发布资讯
        db.collection('INFOSHARE').where({
          CreatorId: e.currentTarget.dataset.id,
          InfoType:"Media",
          InfoStatus: 'checked',
          Private: false
        }).get({
          success: res => {
            console.log(res)
            var fliter = res.data
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].InfoVideo != "") {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoVideo]
              } else {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoImage]
              }
              c1.getTempFileURL({
                fileList: filelist
              }).then(res => {
                console.log(res.fileList)
                if (fliter[i].InfoVideo != "") {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoVideo = res.fileList[1].tempFileURL
                } else {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoImage = res.fileList[1].tempFileURL
                }
                if (i + 1 == fliter.length) {
                  console.log("执行了")
                  // 展示接收到的info
                  that.setData({
                    infoshares: fliter,
                    creatorid: fliter[0].CreatorId
                  })
                  that.data.infocover = fliter[0].InfoCover
                  that.data.infotitle = fliter[0].InfoTitle
                  // 调用播放视频方法
                  that.startUp()
                } else {
                  console.log("没执行")
                }

              }).catch(error => {
                // handle error
              })

            }
          }
        })
      }
    })
  },
  bvDonateShow() {
    this.setData({
      donateshow: !this.data.donateshow
    })
  },
  bvComment(e) {
    this.setData({
      comment: e.detail.value,
    })
  },
  bvCommentShow() {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      // 非会员先调用登录框
      this.setData({
        loginshow: true
      })
    } else {
      this.setData({
        commentshow: true,
      })
    }
  },
  onChooseAvatar(e) {
    console.log(e.detail)
    const cloudPath = 'user/' + app.globalData.Guserid + '/' + "avatarUrl" + e.detail.avatarUrl.match(/\.[^.]+?$/)
    let that = this
    utils.CloudInit(function (c1) {
    c1.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: e.detail.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        // do something
        that.setData({
          avatarurl: res.fileID,
        })
      },
      fail: console.error
    })
  })
  },

  bvNickName(e) {
    console.log("真机测试才能获取到", e.detail.value)
    this.setData({
      nickname: e.detail.value,
    })
  },
  bvReplyContent(e) {
    this.setData({
      replycontent: e.detail.value
    })

  },
  bvReplySend(e) {
    // 新增回复
    console.log(e.currentTarget.dataset.id)
    utils.CloudInit(function (c1) {
      c1.callFunction({
        // 要调用的云函数名称
        name: 'NormalReply',
        // 传递给云函数的参数
        data: {
          collectionName: "InfoShareComment",
          id: e.currentTarget.dataset.id,
          key1: "Reply",
          value1: this.data.replycontent,
          key2: "ReplyStatus",
          value2: "unchecked",
          key3: "ReplyDate",
          value3: Time.getCurrentTime(),
        },
        success: res => {
          console.log(res)
          utils._SuccessToast("回复发送成功")
        },
      })
    })

  },

  bvPublish() {
    if (this.data.avatarurl == "" || this.data.nickname == "") {
      utils._ErrorToast("需要头像和昵称")
    } else {
      // 新增留言
      let that = this
      utils.CloudInit(function (c1) {
        const db = c1.database()
        db.collection("InfoShareComment").add({
          data: {
            InfoId: this.data.infoid,
            UserId: app.globalData.Guserid,
            avatarUrl: this.data.avatarurl,
            nickName: this.data.nickname,
            Comment: this.data.comment,
            PublishDate:Time.getCurrentTime(),
            Status: "unchecked",
            From:"创企服"
          },
          success: res => {
            that.setData({
              replyshow: false
            })
          },
          fail: res => {
            utils._ErrorToast("提交失败请重试")
          }
        })
      })
    }
  },
  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      userphone: e.detail.userphone,
    })
  },

  bvLink(e) {
    console.log(e.currentTarget.dataset.link)
    // 注意navigate不能跳转到有导航的页面
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
      // url: '../index/index',
    })
  },

  bvEdit: function (e) {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      this.setData({
        loginshow: true
      })
    } else {
      wx.navigateTo({
        url: '../promote/mediaedit',
      })
    }
  },

  bvDonateSelect(e) {
    console.log(e.detail.cell)
    this.data.totalfee = e.detail.cell.price
    this.data.praise = e.detail.cell.praise
    this.data.creatorpoints = e.detail.cell.creatorpoints
    this.data.inviterpoints = e.detail.cell.inviterpoints
    this.data.indirectinviterpoints = e.detail.cell.indirectinviterpoints
  },

  // 点击支付按钮,发起支付
  bvToDonate(event) {
    if (this.data.isPaying) return
    this.setData({
      isPaying: true,
      btnname: "支付中"
    })
    const goodsnum = wxpay._getGoodsRandomNumber();
    const body = "资讯赞赏";
    const PayVal = this.data.totalfee * 100;
    this._callWXPay(body, goodsnum, PayVal);
  },
  // 请求WXPay云函数,调用支付能力
  _callWXPay(body, goodsnum, payVal) {
    let that = this
    utils.CloudInit(function (c1) {
      c1.callFunction({
          name: 'WXPay',
          data: {
            // 需要将data里面的参数传给WXPay云函数
            body,
            goodsnum, // 商品订单号不能重复
            payVal, // 这里必须整数,不能是小数,而且类型是number,否则就会报错
          },
        })
        .then((res) => {
          console.log(res);
          const payment = res.result.payment;
          console.log(payment); // 里面包含appId,nonceStr,package,paySign,signType,timeStamp这些支付参数
          wx.requestPayment({
            // 根据获取到的参数调用支付 API 发起支付
            ...payment, // 解构参数appId,nonceStr,package,paySign,signType,timeStamp
            success: (res) => {
              console.log('支付成功', res);
              that._paymentadd(goodsnum)
              that._pointsadd()
              that._praiseadd()
            },
            fail: (err) => {
              console.error('支付失败', err);
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
  },

  _viewadd(infoid) {
    utils.CloudInit(function (c1) {
      c1.callFunction({
        name: "DataRise",
        data: {
          collectionName: "INFOSHARE",
          key: "InfoId",
          value: infoid,
          key1: "View",
          value1: 1
        },
        success: res => {
          console.log("播放量已更新", res)

        }
      })
    })
  },
  _praiseadd() {
    let that = this
    utils.CloudInit(function (c1) {
      c1.callFunction({
        name: "DataRise",
        data: {
          collectionName: "INFOSHARE",
          key: "InfoId",
          value: that.data.infoid,
          key1: "Praise",
          value1: that.data.praise
        },
        success: res => {
          console.log(res)
          that.setData({
            donateshow: false
          })
        }
      })
    })
  },

  _pointsadd() {
    // 赞赏点数记录
    utils.CloudInit(function (c1) {
      const db = c1.database()
      db.collection("POINTS").add({
        data: {
          PointsType: "donate",
          UserId: app.globalData.Guserid,
          ProductId: this.data.infoid,
          ProductName: "资讯赞赏",
          TotalFee: this.data.price,
          CreatorId: this.data.creatorid,
          CreatorPoints: this.data.creatorpoints,
          InviterId: this.data.creatorinviterid,
          InviterPoints: this.data.inviterpoints,
          IndirectInviterId: this.data.creatorindirectinviterid,
          IndirectInviterPoints: this.data.indirectinviterpoints,
          SysAddDate: new Date().getTime(),
          AddDate: Time.getCurrentTime(),
          PointsStatus: "checked",
          From:"创企服"
        },
        success: res => {
          resolve(res)
        },
      })
    })
  },

  _paymentadd(goodsnum) {
    // 支付成功后增加付款记录
    let that = this
    utils.CloudInit(function (c1) {
      const db = c1.database()
      db.collection("PAYMENT").add({
        data: {
          OrderId: goodsnum,
          ProductId: this.data.infoid,
          ProductName: "资讯赞赏",
          TotalFee: this.data.totalfee,
          AddDate: Time.getCurrentTime(),
          PaymentStatus: "checked",
          UserId: app.globalData.Guserid,
          From:"创企服"
        },
        success: res => {
          console.log("paymentadd成功")
          that.setData({
            isPaying: false,
            btnname: "赞赏"
          })
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    })
  },

  onLoad: async function (options) {
    console.log("接收到的参数", options)
    if (options.infoid) {
      // 如果是通过分享链接进入
      this.data.params = options
      this.data.remark = "通过创企服用户分享资讯进入"
      this.data.tempinviterid = options.userid
      this.data.infoid = options.infoid
      this._getComments(options.infoid)
      this._viewadd(that.data.infoid)
      // 本地函数查询分享的资讯
      let that = this
      utils.CloudInit(function (c1) {
        const db = c1.database()
        db.collection('INFOSHARE').where({
          InfoId: options.infoid,
          InfoStatus: 'checked'
        }).get({
          success: res => {
            console.log(res)
            var fliter = res.data
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].InfoVideo != "") {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoVideo]
              } else {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoImage]
              }
              c1.getTempFileURL({
                fileList: filelist
              }).then(res => {
                console.log(res.fileList)
                if (fliter[i].InfoVideo != "") {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoVideo = res.fileList[1].tempFileURL
                } else {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoImage = res.fileList[1].tempFileURL
                }
                if (i + 1 == fliter.length) {
                  console.log("执行了")
                  // 展示接收到的info
                  that.setData({
                    infoshares: fliter,
                    creatorid: fliter[0].CreatorId
                  })
                  that.data.infocover = fliter[0].InfoCover
                  that.data.infotitle = fliter[0].InfoTitle
                  // 调用播放视频方法
                  that.startUp()
                } else {
                  console.log("没执行")
                }

              }).catch(error => {
                // handle error
              })

            }

          }
        })
      })
      // 通过分享进入，执行用户登录操作
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
      // 查询创作者的推荐人及间接推荐人，以便打赏时记录
      let creator = await utils._usercheck(this.data.creatorid)
      this.data.creatorinviterid = creator[0].UserInfo.InviterId
      this.data.creatorindirectinviterid = creator[0].UserInfo.IndirectInviterId

    } else {
      // 在本人小程序中打开
      console.log("在本人小程序中打开展示全部公开资讯")
      // 查询公开发布的视频，数量少于20条用本地函数就可以
      let that = this
      utils.CloudInit(function (c1) {
        const db = c1.database()
        db.collection('INFOSHARE').where({
          InfoType:"Media",
          InfoStatus: 'checked',
          Private: false
        }).get({
          success: async res => {
            console.log(res)
            that.data.infotitle = res.data[0].InfoTitle
            that.data.infoid = res.data[0].InfoId
            that._getComments(res.data[0].InfoId)
            // 本人打开浏览量也增加
            that._viewadd(res.data[0].InfoId)
            var fliter = res.data
            for (let i = 0; i < res.data.length; i++) {
              console.log(i)
              if (res.data[i].InfoVideo != "") {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoVideo]
              } else {
                var filelist = [res.data[i].InfoCover, res.data[i].InfoImage]
              }
              await c1.getTempFileURL({
                fileList: filelist
              }).then(res => {
                console.log(i)
                console.log(res.fileList)
                if (fliter[i].InfoVideo != "") {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoVideo = res.fileList[1].tempFileURL
                } else {
                  fliter[i].InfoCover = res.fileList[0].tempFileURL
                  fliter[i].InfoImage = res.fileList[1].tempFileURL
                }
              })
            }
              // 展示接收到的info
              console.log("执行了")
              that.setData({
                infoshares: fliter,
                creatorid: fliter[0].CreatorId
              })
              console.log("公开资讯", that.data.infoshares)
              that.data.infocover = fliter[0].InfoCover
              // 调用播放视频方法
              that.startUp()

          }
        })
      })
    }
    this.setData({
      userid: app.globalData.Guserid,
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
      width:app.globalData.Gsysteminfo.windowWidth,
      height:app.globalData.Gsysteminfo.windowHeight,
    })

  },

  _getComments(infoid) {
    // 云函数查询评论内容
    let that = this
    utils.CloudInit(function (c1) {
      c1.callFunction({
        name: "NormalQuery",
        data: {
          collectionName: "InfoShareComment",
          command: "and",
          where: [{
            InfoId: infoid,
            Status: "checked"
          }]
        },
        success: res => {
          that.setData({
            comments: res.result.data
          })
        },
        fail: res => {
          that.setData({
            comments: []
          })
        }
      })
    })
  },
  // 进页面时播放视频
  startUp() {
    console.log("延迟1.2秒再播放避免出现渲染网络层错误")
    setTimeout(() => {
      // 获取video节点
      let createVideoContext = wx.createVideoContext('video0')
      // 播放视频
      createVideoContext.play()
    }, 1200)
  },

  // 切换视频的时候播放视频
  // 注：此方法视频如果过大可能会叠音，所以视频需要压缩，或者可以尝试循环节点关闭视频
  nextVideo(e) {
    this.data.infoid = this.data.infoshares[e.detail.current].InfoId
    this.data.infocover = this.data.infoshares[e.detail.current].InfoCover
    this.data.infotitle = this.data.infoshares[e.detail.current].InfoTitle
    this.setData({
      creatorid: this.data.infoshares[e.detail.current].CreatorId
    })
    console.log(this.data.infoid)
    // 播放当前页面视频
    let index = 'video' + e.detail.current
    this.playVio(index)
    // 暂停前一个页面视频
    if (e.detail.current - 1 >= 0) {
      let index1 = 'video' + (e.detail.current - 1)
      this.pauseVio(index1)
    }
    // 暂停后一个页面视频
    if (e.detail.current + 1 < this.data.infoshares.length) {
      let index2 = 'video' + (e.detail.current + 1)
      this.pauseVio(index2)
    }
    this._getComments(this.data.infoid)
    this._viewadd(this.data.infoid)
  },

  // 播放视频
  playVio(index) {
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 播放视频
    createVideoContext.play()
  },

  // 暂停视频
  pauseVio(index) {
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 暂停视频
    createVideoContext.pause()
  },

  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.infotitle,
      query: '/pages/promote/mediashare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.infoid,
      imageUrl: this.data.infocover, //封面
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
      title: this.data.infotitle,
      path: '/pages/promote/mediashare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.infoid,
      imageUrl: this.data.infocover, //封面，留空自动抓取500*400生成图片
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