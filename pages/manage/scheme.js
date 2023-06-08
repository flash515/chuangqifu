const app = getApp()

const track = require("../../utils/track");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: "",
    adddate: '',
    schemetype: '',
    condition: '',
    scheme: '',
    refproduct: '',
    updatedate:'',
    onshowchecked: true,
    sublock: false
  },
  getSchemeType(e) {
    this.setData({
      schemetype: e.detail.value
    });
  },
  getCondition(e) {
    this.setData({
      textLen1: e.detail.value.length,
      condition: e.detail.value
    });
  },
  getScheme(e) {
    this.setData({
      textLen2: e.detail.value.length,
      scheme: e.detail.value
    });
  },
  getRefproduct(e) {
    this.setData({
      textLen3: e.detail.value.length,
      refproduct: e.detail.value
    });
  },
  addData(e) {
        // 多层嵌套的this需提前定义中转变量
        var thispage = this
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      const db = wx.cloud.database()
      db.collection('SCHEME').add({
        data: {
          AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
          SchemeType: this.data.schemetype,
          Condition: this.data.condition,
          Scheme: this.data.scheme,
          RefProduct: this.data.refproduct,
          Status: this.data.status,
        },
        success: res => {
          console.log('新增数据成功', res)
          thispage.setData({
            sublock: true // 修改上传状态并返回前端
          })
          wx.showToast({
            title: '新增数据成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
      })
    }
  },
  updateData(e) {
    const db = wx.cloud.database()
    db.collection('SCHEME').doc(this.data._id).update({
      data: {
        SchemeType: this.data.schemetype,
        Condition: this.data.condition,
        Scheme: this.data.scheme,
        RefProduct: this.data.refproduct,
        Status: this.data.status,
        UpdateDate: new Date().toLocaleString('chinese',{ hour12: false })
      }
    })
  },
  onsearch(e) {
    const db = wx.cloud.database()
    db.collection('SCHEME').where({
      UserId:app.globalData.Guserid,
      SchemeType: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).get({
      success: res => {
        this.setData({
          _id: res.data[0]._id,
          adddate: res.data[0].AddDate,
          schemetype: res.data[0].SchemeType,
          condition: res.data[0].Condition,
          scheme: res.data[0].Scheme,
          refproduct: res.data[0].RefProduct,
          status: res.data[0].Status,
          updatedate:res.data[0].UpdateDate,
        })
        if (res.data[0].Status == "onshow") {
          this.setData({
            onshowchecked: true
          })
        } else {
          this.setData({
            onshowchecked: false
          })
        }
      }
    })
  },
  onshowChange(e) {
    if (e.detail.value == true) {
      this.setData({
        status: "onshow",
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        status: "noshow",
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
    	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => track.startToTrack(),
  onShow: function () {
    track.startToTrack()
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
    track.startByBack()
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