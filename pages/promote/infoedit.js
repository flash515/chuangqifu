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
    creatorphone:"",
    infomations: [], //已保存的资讯分享
    infoselected: false,
    infoid: "",
    infotype:"",
    infomationtype:"供应",
    infostatus: "unchecked",
    infocontent: "",
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
        infocontent: e.detail.cell.InfoContent,
        infostatus: e.detail.cell.InfoStatus,
      })
    } else {
      this.setData({
        infoid: "",
        infocontent: "",
        infostatus: "unchecked",
      })
    }
  },

  async bvDelInfo(e) {
    console.log(e)
    let that = this
    const db = wx.cloud.database()
    await db.collection('INFOSHARE').where({
      InfoId: e.currentTarget.dataset.id
    }).remove({
      success: res => {
        utils._SuccessToast("信息删除成功")
        // 查询本人提交的InfoShare
        this.data.infomations.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          infomations: this.data.infomations
        })
      }
    })
  },
  bvInfomationType(e) {
    console.log(e.detail)
    if(e.detail.key=="1"){
      this.data.infomationtype="供应"
    }else if(e.detail.key=="2"){
      this.data.infomationtype="求购"
    }

  },

  bvInfoContent(e) {
    this.setData({
      infocontent: e.detail.value
    })
  },

  //发布到供求信息
  async bvPublish(e) {
    let that = this
    if (this.data.infocontent == "") {
      utils._ErrorToast("请填写信息内容")
      return
    }

    const db = wx.cloud.database()
    if (this.data.infoid != "") {
      db.collection('INFOSHARE').where({
        InfoId: this.data.infoid
      }).update({
        data: {
          InfoContent: this.data.infocontent,
          InfomationType:this.data.infomationtype,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          CreatorPhone:app.globalData.Guserdata.UserInfo.UserPhone,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: "unchecked",
        },
        success: res => {
          utils._SuccessToast("信息发布成功")
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
                infomations: res.result.data,
              })
              console.log("本人全部资讯", that.data.infomations)
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
          InfoType: "Simple",
          InfomationType:this.data.infomationtype,
          InfoId: app.globalData.Guserdata.UserInfo.UserPhone + new Date().getTime(),
          InfoContent: this.data.infocontent,
          View: 0,
          Commont: 0,
          CreatorId: app.globalData.Guserid,
          CreatorPhone: app.globalData.Guserdata.UserInfo.UserPhone,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: "unchecked",
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
                infomations: res.result.data,
              })
              console.log("本人全部资讯", that.data.infomations)
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
      creatorphone:app.globalData.Guserdata.UserInfo.UserPhone,
    })
    // 查询本人提交的InfoShare
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          CreatorId: app.globalData.Guserid,
          InfoType:"Simple"
        }]
      },
      success: res => {
        this.setData({
          infomations: res.result.data,
        })
        console.log("本人全部资讯", this.data.infomations)
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
})