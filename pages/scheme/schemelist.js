const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
const track = require("../../utils/track");
Page({
  data: {
    schemearray:[],
    schemearrayA:[],
    schemearrayB:[],
    schemearrayC:[],
    schemearrayD:[],
    qaarray: [],
    qaarray1: [],
    qaarray2: [],
    qaarray3: [],
    qaarray4: [],
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    sublock1: false,
    sublock2: false,
    sublock3: false,
    sublock4: false,

    // 轮播参数
    image: [],
  },
  bvQuestion1(e) {
    
    this.setData({
      question1: e.detail.value
    })
  },
  bvQuestion2(e) {
    
    this.setData({
      question2: e.detail.value
    })
  },
  bvQuestion3(e) {
    
    this.setData({
      question3: e.detail.value
    })
  },
  bvQuestion4(e) {
    
    this.setData({
      question4: e.detail.value
    })
  },
  bvSubmit1(e) {
    // 判断是否重复提交
    if (this.data.sublock1) {
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
      db.collection('SCHEMEQA').add({
          data: {
            SchemeType: "增值税",
            Question: this.data.question1,
            Status: "",
            AddDate: new Date().toLocaleString('chinese',{ hour12: false })
          },
          success: res => {
            wx.showToast({
              title: '留言发送成功',
              icon: 'none',
              duration: 2000 //持续的时间
            })

          },
          fail: res => {
            console.log("留言发送失败", res)
            wx.showToast({
              title: '留言发送失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.sublock1 = true // 修改上传状态为锁定
        wx.requestSubscribeMessage({
          tmplIds: ['tXhFEK36Dqkasd9Cmmuh5Gj95C6YGSbFqBmKK2Y7Q2Y'],
        })
      }
  },
  bvSubmit2(e) {
    // 判断是否重复提交
    if (this.data.sublock2) {
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
      db.collection('SCHEMEQA').add({
          data: {
            SchemeType: "企业所得税",
            Question: this.data.question2,
            Status: "",
            AddDate: new Date().toLocaleString('chinese',{ hour12: false })
          },
          success: res => {
            wx.showToast({
              title: '留言发送成功',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          },
          fail: res => {
            console.log("留言发送失败", res)
            wx.showToast({
              title: '留言发送失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.sublock2 = true // 修改上传状态为锁定
        wx.requestSubscribeMessage({
          tmplIds: ['tXhFEK36Dqkasd9Cmmuh5Gj95C6YGSbFqBmKK2Y7Q2Y'],
        })
      }
  },
  bvSubmit3(e) {
    // 判断是否重复提交
    if (this.data.sublock3) {
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
      db.collection('SCHEMEQA').add({
          data: {
            SchemeType: "个人所得税",
            Question: this.data.question3,
            Status: "",
            AddDate: new Date().toLocaleString('chinese',{ hour12: false })
          },
          success: res => {
            wx.showToast({
              title: '留言发送成功',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          },
          fail: res => {
            console.log("留言发送失败", res)
            wx.showToast({
              title: '留言发送失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.sublock3 = true // 修改上传状态为锁定
        wx.requestSubscribeMessage({
          tmplIds: ['tXhFEK36Dqkasd9Cmmuh5Gj95C6YGSbFqBmKK2Y7Q2Y'],
        })
    }
  },
  bvSubmit4(e) {
    // 判断是否重复提交
    if (this.data.sublock4) {
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
      db.collection('SCHEMEQA').add({
          data: {
            SchemeType: "股权转让个税",
            Question: this.data.question4,
            Status: "",
            AddDate: new Date().toLocaleString('chinese',{ hour12: false })
          },
          success: res => {
            wx.showToast({
              title: '留言发送成功',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          },
          fail: res => {
            console.log("留言发送失败", res)
            wx.showToast({
              title: '留言发送失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.sublock4 = true // 修改上传状态为锁定
        wx.requestSubscribeMessage({
          tmplIds: ['tXhFEK36Dqkasd9Cmmuh5Gj95C6YGSbFqBmKK2Y7Q2Y'],
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image:app.globalData.Gimagearray
    })
        // 查询在售的商品并存入本地
        const db = wx.cloud.database()
        db.collection('SCHEME').where({
          // 状态为在售的商品
          Status: "onshow"
        }).get({
          success: res => {
            //括号1开始
               console.log("打印数据库查询反回结果",res)
            this.setData({
              schemearray: res.data,
            })
        // 筛选指定记录
        var fliterA = [];
        var fliterB = [];
        var fliterC = [];
        var fliterD = [];
  
        for (var i = 0; i < this.data.schemearray.length; i++) {
          if (this.data.schemearray[i].SchemeType == '增值税') {
            fliterA.push(this.data.schemearray[i]);
          }
        }
        for (var i = 0; i < this.data.schemearray.length; i++) {
          if (this.data.schemearray[i].SchemeType == '企业所得税') {
            fliterB.push(this.data.schemearray[i]);
          }
        }
        for (var i = 0; i < this.data.schemearray.length; i++) {
          if (this.data.schemearray[i].SchemeType == '个人所得税') {
            fliterC.push(this.data.schemearray[i]);
          }
        }
        for (var i = 0; i < this.data.schemearray.length; i++) {
          if (this.data.schemearray[i].SchemeType == '股权转让个税') {
            fliterD.push(this.data.schemearray[i]);
          }
        }
        console.log("A",fliterA)
        console.log("B",fliterB)
        console.log("C",fliterC)
        console.log("D",fliterD)
        this.setData({
          shemearrayA: fliterA,
          shemearrayB: fliterB,
          shemearrayC: fliterC,
          shemearrayD: fliterD,
        })
      }
    })
    // 查询商品的QA内容

    const _ = db.command
    db.collection('SCHEMEQA').where({
      Status: "展示"
    }).get({
      success: res => {
        console.log("查询QA结果", res);
        this.setData({
          qaarray: res.data
        })
        // 筛选指定记录
        var fliter1 = [];
        var fliter2 = [];
        var fliter3 = [];
        var fliter4 = [];
        // var _this = this
        // var fliter = [];
        // var _this = this
        for (var i = 0; i < this.data.qaarray.length; i++) {
          if (this.data.qaarray[i].SchemeType == '增值税') {
            fliter1.push(this.data.qaarray[i]);
          }
        }
        for (var i = 0; i < this.data.qaarray.length; i++) {
          if (this.data.qaarray[i].SchemeType == '企业所得税') {
            fliter2.push(this.data.qaarray[i]);
          }
        }
        for (var i = 0; i < this.data.qaarray.length; i++) {
          if (this.data.qaarray[i].SchemeType == '个人所得税') {
            fliter3.push(this.data.qaarray[i]);
          }
        }
        for (var i = 0; i < this.data.qaarray.length; i++) {
          if (this.data.qaarray[i].SchemeType == '股权转让个税') {
            fliter4.push(this.data.qaarray[i]);
          }
        }
        console.log("1",fliter1)
        console.log("2",fliter2)
        console.log("3",fliter3)
        console.log("4",fliter4)
        this.setData({
          qaarray1: fliter1,
          qaarray2: fliter2,
          qaarray3: fliter3,
          qaarray4: fliter4,
        })
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
    	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => startToTrack(),
  onShow: function () {
    startToTrack()
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
    startByBack()
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