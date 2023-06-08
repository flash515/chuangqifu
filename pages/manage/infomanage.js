const app = getApp()
var utils = require("../../utils/utils")
const wxpay = require("../../utils/WxPay")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 页面相关
    infoshares: [],
    infoid: "",
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

  },
  toCreator(e) {
    console.log(e.currentTarget.dataset.id)
    const db = wx.cloud.database()
    if (e.currentTarget.dataset.id == app.globalData.Guserid) {
      // 如果用户是资讯创建者,显示本人全部发布资讯
      db.collection('INFOSHARE').where({
        CreatorId: e.currentTarget.dataset.id,
      }).get({
        success: res => {
          console.log(res)
          // 展示接收到的info
          this.setData({
            infoshares: res.data,
            // currentinfoid: options.infoid
            creatorid: res.data[0].CreatorId
          })
        }
      })
    } else {
      // 如果用户不是资讯创建者,只打开创建者公开发布资讯
      db.collection('INFOSHARE').where({
        CreatorId: e.currentTarget.dataset.id,
        InfoStatus: 'checked',
        Private: false
      }).get({
        success: res => {
          console.log(res)
          // 展示接收到的info
          this.setData({
            infoshares: res.data,
            // currentinfoid: options.infoid
            creatorid: res.data[0].CreatorId
          })
        }
      })
    }

  },

  bvCommentShow() {
    this.setData({
      commentshow: true,
    })
    // if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
    //   // 非会员先调用登录框
    //   this.setData({
    //     loginshow: true
    //   })
    // } else {
    //   this.setData({
    //     commentshow:true,
    //   })
    // }
  },


  bvReplySend(e) {
    // 新增回复
    console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
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
        value3: new Date().toLocaleString('chinese', {
          hour12: false
        })
      },
      success: res => {
        console.log(res)
        utils._SuccessToast("回复发送成功")
      },
    })

  },



  bvCheck: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      name: "NormalUpdate",
      data: {
        collectionName: "INFOSHARE",
        key:"InfoId",
        id: e.currentTarget.dataset.id,
        key1: "InfoStatus",
        value1: "checked"
      },
      success: res => {
        console.log(res)
        utils._SuccessToast("状态更新完成")
      }
    })
  },




  onLoad: async function (options) {

    // 查询公开发布的视频，数量少于20条用本地函数就可以
    const db = wx.cloud.database()
    db.collection('INFOSHARE').where({
      InfoStatus: 'unchecked',
      Private: false
    }).get({
      success: res => {
        console.log(res)
        // 展示查询到的结果
        this.setData({
          infoshares: res.data,
          creatorid: res.data[0].CreatorId,
        })
        this.data.infoid = res.data[0].InfoId
        console.log("公开资讯", this.data.infoshares)
      }
    })

    this.setData({
      userid: app.globalData.Guserid,
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
    })
    // 调用播放视频方法
    this.startUp()
  },


  // 进页面时播放视频
  startUp() {
    // 获取video节点
    let createVideoContext = wx.createVideoContext('video0')
    // 播放视频
    createVideoContext.play()
  },

  // 切换视频的时候播放视频
  // 注：此方法视频如果过大可能会叠音，所以视频需要压缩，或者可以尝试循环节点关闭视频
  nextVideo(e) {
    this.data.infoid = this.data.infoshares[e.detail.current].InfoId
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
    this._getPraise(this.data.infoid)
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



})