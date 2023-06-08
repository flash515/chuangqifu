const app = getApp()
var utils = require("../../utils/utils")
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    avatarurl: "",
    nickname: "",
    infoshares: [], //已保存的资讯分享
    infoselected: false,
    infoid: "",
    infotitle: "",
    link: "../product/allproduct",
    infotitleshow: false,
    linkshow: true,
    private: true,
    infostatus: "unchecked",
    infocontent: "",
    infoimage: "",
    infovideo: "",
    infocover: "",
    tempcover: "",
    tempimage: "",
    tempvideo: "",
    editbtn: false,
    clipershow: false,
    coveredit: "", //剪裁封面临时路径
    timestamp: "", //时间戳
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
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            ["UserInfo.avatarUrl"]: res.fileID,
          },
          success: res => {
            utils._SuccessToast("头像已更新")
          }
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
  bvUploadNickName(e) {
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ["UserInfo.nickName"]: this.data.nickname,
      },
      success: res => {
        utils._SuccessToast("昵称已更新")
      }
    })
  },

  bvInfoShareSelect(e) {
    console.log(e.detail)
    if (e.detail.checked == true) {
      this.setData({
        infoid: e.detail.cell.InfoId,
        infotitle: e.detail.cell.InfoTitle,
        link: e.detail.cell.Link,
        infotitleshow: e.detail.cell.InfoTitleShow,
        linkshow: e.detail.cell.LinkShow,
        private: e.detail.cell.Private,
        infocontent: e.detail.cell.InfoContent,
        infovideo: e.detail.cell.InfoVideo,
        infocover: e.detail.cell.InfoCover,
        infoimage: e.detail.cell.InfoImage,
        tempvideo: e.detail.cell.InfoVideo,
        tempcover: e.detail.cell.InfoCover,
        tempimage: e.detail.cell.InfoImage,
        infostatus: e.detail.cell.InfoStatus,
        editbtn: true
      })
    } else {
      this.setData({
        infoid: "",
        infotitle: "",
        infotitleshow: true,
        linkshow: false,
        private: false,
        infostatus: "unchecked",
        infocontent: "",
        infoimage: "",
        infovideo: "",
        infocover: "",
        tempcover: "",
        tempimage: "",
        tempvideo: "",
        editbtn: false
      })
    }
  },

  async bvDelInfo(e) {
    console.log(e)
    let that = this
    await utils._RemoveFiles([e.currentTarget.dataset.video])
    await utils._RemoveFiles([e.currentTarget.dataset.cover])
    await utils._RemoveFiles([e.currentTarget.dataset.image])
    const db = wx.cloud.database()
    await db.collection('INFOSHARE').where({
      InfoId: e.currentTarget.dataset.id
    }).remove({
      success: res => {
        utils._SuccessToast("资讯删除成功")
        // 查询本人提交的InfoShare
        this.data.infoshares.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          infoshares: this.data.infoshares
        })
      }
    })
  },

  bvInfoTitle(e) {
    this.setData({
      infotitle: e.detail.value
    })
  },
  bvLink(e) {
    this.setData({
      link: e.detail.value
    })
  },
  bvInfoContent(e) {
    this.setData({
      infocontent: e.detail.value
    })
  },

  async bvChooseMedia(e) {
    let that = this
    console.log("上传视频的方法")
    wx.chooseMedia({
      count: 1, //上传视频的个数
      mediaType: ['mix'], //限制上传的类型为video
      sourceType: ['album', 'camera'], //视频选择来源
      maxDuration: 58, //拍摄限制时间
      camera: 'back', //采用后置摄像头
      success: async function (res) {
        console.log(res)
        //获取临时存放的媒体资源
        if (res.tempFiles[0].fileType == "video") {
          //获取该视频的播放时间
          let duration = res.tempFiles[0].duration
          console.log("视频播放时间为" + duration)
          //获取视频的大小(MB单位)
          let size = parseFloat(res.tempFiles[0].size / 1024 / 1024).toFixed(1)
          console.log("视频大小为" + size)
          //获取视频的高度
          let height = res.tempFiles[0].height
          console.log("视频高度为" + height)
          //获取视频的宽度
          let width = res.tempFiles[0].width
          console.log("视频宽度为" + width)

          //校验大小后，符合进行上传
          if (size > 20) {
            let beyongSize = size - 20 //获取视频超出限制大小的数量
            Toast("上传的视频大小超限,超出" + beyongSize + "MB,请重新上传！")
            return
          } else {
            //符合大小限制，进行上传
            console.log("符合大小限制")
            that.setData({
              tempcover: res.tempFiles[0].thumbTempFilePath,
              tempvideo: res.tempFiles[0].tempFilePath,
              editbtn: true
            })
          }
        } else if (res.tempFiles[0].fileType == "image") {
          that.setData({
            tempcover: res.tempFiles[0].tempFilePath,
            tempimage: res.tempFiles[0].tempFilePath,
            editbtn: true
          })
        }
      }
    })
  },

  bvClipCover() {
    // 打开裁剪控件
    this.setData({
      clipershow: true,
      coveredit: this.data.tempcover
    })
  },

  linclipCover(e) {
    // 裁剪图片
    this.setData({
      tempcover: e.detail.url
    })
    console.log('生成的图片临时链接为：', this.data.tempcover);
  },

  //上传视频和图片
  bvUploadMedia: async function () {
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    var that = this
    this.data.timestamp = new Date().getTime()
    // 上传视频封面
    let coverpath = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'cover' + this.data.timestamp;
    let cover = await utils._UploadFile(this.data.tempcover, coverpath)
    this.setData({
      infocover: cover
    })
    console.log(that.data.infocover)
    if (this.data.tempvideo != '') {
      //    视频压缩
      wx.compressVideo({
        quality: 'high',
        src: this.data.tempvideo,
        success: function (res) {
          let size = parseFloat(res.size / 1024 / 1024).toFixed(1)
          console.log("压缩后视频大小为" + size)
          // 只上传一个video时
          const filePath = res.tempFilePath
          const cloudPath = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'video' + that.data.timestamp + filePath.match(/\.[^.]+?$/)
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: (res) => {
              wx.hideLoading();
              console.log("fileID", res.fileID)
              that.data.infovideo = res.fileID
            },
          });
        },
      })
    }
    if (this.data.tempimage != '') {
      //上传图片资讯
      let imagepath = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'image' + this.data.timestamp
      that.data.infoimage = await utils._UploadFile(this.data.tempimage, imagepath)
      wx.hideLoading();
      console.log(that.data.infoimage)
    }

  },

  async bvDeleteMedia(e) {
    console.log(e)
    if (this.data.infocover) {
      await utils._RemoveFiles([this.data.infocover])
    }
    if (this.data.infovideo) {
      await utils._RemoveFiles([this.data.infovideo])
    }
    if (this.data.infoimage) {
      await utils._RemoveFiles([this.data.infoimage])
    }
    utils._SuccessToast("删除成功")
    this.setData({
      tempvideo: "",
      tempcover: "",
      tempimage: "",
      infocover: "",
      editbtn: false,
    })
    this.data.infovideo = ""
    this.data.infoimage = ""
  },

  bvInfoTitleShow(e) {
    console.log(e.detail)
    this.setData({
      infotitleshow: e.detail.checked
    })
  },
  bvPrivate(e) {
    console.log(e.detail)
    this.setData({
      private: e.detail.checked
    })

  },
  bvLinkShow(e) {
    console.log(e.detail)
    this.setData({
      linkshow: e.detail.checked
    })

  },
  //发布到资讯广场
  async bvPublish(e) {
    let that = this
    if (this.data.infotitle == "") {
      utils._ErrorToast("标题不能为空")
      return
    }
    if (app.globalData.Guserdata.UserInfo.UserType == "admin") {} else {
      // 普能会员只能发布最多3条资讯
      if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "member" && this.data.infoshares.length > 2) {
        utils._ErrorToast("超出会员权限")
        return
      }
      // 银级会员只能发布最多10条资讯
      if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "silver" && this.data.infoshares.length > 9) {
        utils._ErrorToast("超出会员权限")
        return
      }
      // 黄金会员只能发布最多30条资讯
      if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "gold" && this.data.infoshares.length > 29) {
        utils._ErrorToast("超出会员权限")
        return
      }
      // 铂金会员只能发布最多50条资讯
      if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "platinum" && this.data.infoshares.length > 49) {
        utils._ErrorToast("超出会员权限")
        return
      }
    }
    console.log("测试是否执行")
    // 不公开发布不需要审核
    if (this.data.private == true) {
      this.data.infostatus = "checked"
    }
    const db = wx.cloud.database()
    if (this.data.infoid != "") {
      db.collection('INFOSHARE').where({
        InfoId: this.data.infoid
      }).update({
        data: {
          InfoTitle: this.data.infotitle,
          Link: this.data.link,
          InfoContent: this.data.infocontent,
          InfoVideo: this.data.infovideo,
          InfoImage: this.data.infoimage,
          InfoCover: this.data.infocover,
          InfoTitleShow: this.data.infotitleshow,
          Private: this.data.private,
          LinkShow: this.data.linkshow,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: "unchecked",
        },
        success: res => {
          utils._SuccessToast("资讯更新成功")
          // 查询本人提交的InfoShare
          wx.cloud.callFunction({
            name: "NormalQuery",
            data: {
              collectionName: "INFOSHARE",
              command: "and",
              where: [{
                CreatorId: app.globalData.Guserid,
              }]
            },
            success: res => {
              that.setData({
                infoshares: res.result.data,
              })
              console.log("本人全部资讯", that.data.infoshares)
            }
          })
        },
      })
      db.collection('USER').where({
        UserId: app.globalData.Guserid
      }).update({
        data: {
          ["UserInfo.avatarUrl"]: this.data.avatarurl,
          ["UserInfo.nickName"]: this.data.nickname,
        },
        success: res => {}
      })
    } else {
      db.collection('INFOSHARE').add({
        data: {
          CreatorId: app.globalData.Guserid,
          InfoId: app.globalData.Guserdata.UserInfo.UserPhone + new Date().getTime(),
          InfoTitle: this.data.infotitle,
          Link: this.data.link,
          InfoContent: this.data.infocontent,
          InfoVideo: this.data.infovideo,
          InfoImage: this.data.infoimage,
          InfoCover: this.data.infocover,
          View: 0,
          Praise: 0,
          Commont: 0,
          InfoTitleShow: this.data.infotitleshow,
          Private: this.data.private,
          LinkShow: this.data.linkshow,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoType: "Media",
          InfoStatus: this.data.infostatus,
        },
        success: res => {
          utils._SuccessToast("已发布等待审核")
          // 查询本人提交的InfoShare
          wx.cloud.callFunction({
            name: "NormalQuery",
            data: {
              collectionName: "INFOSHARE",
              command: "and",
              where: [{
                CreatorId: app.globalData.Guserid,
              }]
            },
            success: res => {
              that.setData({
                infoshares: res.result.data,
              })
              console.log("本人全部资讯", that.data.infoshares)
            }
          })

        },
        fail: res => {
          utils._ErrorToast("保存失败请重试")
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    this.setData({
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
    })
    // 查询本人提交的InfoShare
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          CreatorId: app.globalData.Guserid,
          InfoType: "Media"
        }]
      },
      success: res => {
        this.setData({
          infoshares: res.result.data,
        })
        console.log("本人全部资讯", this.data.infoshares)
      }
    })
  },

  bindButtonTap() {
    const that = this
    wx.chooseMedia()({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: res => {
        that.setData({
          infovideo: res.tempFilePath
        })
      }
    })
  },

  bindPlayVideo() {
    console.log('1')
    this.videoContext.play()
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },
  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
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