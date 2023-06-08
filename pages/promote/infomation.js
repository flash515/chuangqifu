const app = getApp()
var utils = require("../../utils/utils")
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
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone: "",
    s_phonecode: "",
    u_phonecode: "",
    // 页面相关
    infomations: [],
    sales:[],
    purchases:[],
    infoid: "",
    comments: [],
    // currentinfoid: "",
    creatorid: "",
    userid: "",
    avatarurl: "",
    nickname: "",

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
            infomations: res.data,
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
            infomations: res.data,
            // currentinfoid: options.infoid
            creatorid: res.data[0].CreatorId
          })
        }
      })
    }

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
        commentshow:true,
      })
    }
  },
  onChooseAvatar(e) {
    console.log(e.detail)
    const cloudPath = 'user/' + app.globalData.Guserid + '/' + "avatarUrl" + e.detail.avatarUrl.match(/\.[^.]+?$/)
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: e.detail.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        // do something
        this.setData({
          avatarurl: res.fileID,
        })
      },
      fail: console.error
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
  
  bvPublishComment() {
    if (this.data.avatarurl == "" || this.data.nickname == "") {
      utils._ErrorToast("需要头像和昵称")
    } else {
      // 新增留言
      const db = wx.cloud.database()
      db.collection("InfoShareComment").add({
        data: {
          InfoId: this.data.infoid,
          UserId: app.globalData.Guserid,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          Comment: this.data.comment,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          Status: "unchecked",
        },
        success: res => {
          utils._SuccessToast("留言发送成功")
          this.setData({
            replyshow: false
          })
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
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
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },
  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      loginbtnshow:e.detail.loginbtnshow,
      userphone: e.detail.userphone,
    })
  },

  bvEditInfomation: function (e) {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      this.setData({
        loginshow: true
      })
    } else {
      wx.navigateTo({
        url: '../promote/infoedit',
      })
    }
  },

  onLoad: async function () {
    this.setData({
      image: app.globalData.Gimagearray,
    })
    if (app.globalData.Guserdata.UserInfo.UserPhone != '') {
      //loginbtnshow已赋值
    } else {
      this.setData({
        loginbtnshow: true
      })
    }
    // 在本人小程序中打开
    console.log("在本人小程序中打开展示全部公开资讯")
    // 查询公开发布的视频，数量少于20条用本地函数就可以
    const db = wx.cloud.database()
    db.collection('INFOSHARE').where({
      InfoStatus: 'checked',
      InfoType: "Simple"
    }).get({
      success: res => {
        console.log(res)
        // 展示查询到的结果

        this.data.infoid = res.data[0].InfoId
        this._getComments(res.data[0].InfoId)
        console.log("公开资讯", this.data.infomations)
        var fliter1 = [];
        var fliter2 = [];
        // var _this = this
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].InfomationType == "供应") {
            fliter1.push(res.data[i]);
          }else if(res.data[i].InfomationType == "求购"){
            fliter2.push(res.data[i]);
          }
        }
        this.setData({
          infomations: res.data,
          creatorid: res.data[0].CreatorId,
          sales:fliter1,
          purchases:fliter2,
        })
      }

    })

    this.setData({
      userid: app.globalData.Guserid,
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
    })

  },

  _getComments(infoid) {
    // 云函数查询评论内容
    wx.cloud.callFunction({
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
        console.log(res)
        this.setData({
          comments: res.result.data
        })
      },
      fail: res => {
        console.log(res)
        this.setData({
          comments: []
        })
      }
    })
  },

})