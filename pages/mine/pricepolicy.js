const {
  dateLater
} = require("../../utils/getDates.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adddate:"",
    startdate: "",
    pl3startdate: "",
    pl3enddate: "",
    pl2startdate: "",
    pl2enddate: "",
    pl1startdate: "",
    pl1enddate: "",
    pricelevel: "",
    discountid: "",
    discountname: "",
    dlstartdate: "",
    dlenddate: "",
    dtotalfee: "",
    ordersublock: false,
    paymentsublock: false,
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

  },
  bvPL3_180(e) {
    this.setData({
      pl3_180startdate: e.detail.value,
      pl3_180enddate: dateLater(e.detail.value, 180).year + '-' + dateLater(e.detail.value, 180).newdates
    })
  },
  bvPL3_90(e) {
    this.setData({
      pl3_90startdate: e.detail.value,
      pl3_90enddate: dateLater(e.detail.value, 90).year + '-' + dateLater(e.detail.value, 90).newdates
    })
  },
  bvPL2_360(e) {
    this.setData({
      pl2_360startdate: e.detail.value,
      pl2_360enddate: dateLater(e.detail.value, 360).year + '-' + dateLater(e.detail.value, 360).newdates
    })
  },
  bvPL2_180(e) {
    this.setData({
      pl2_180startdate: e.detail.value,
      pl2_180enddate: dateLater(e.detail.value, 180).year + '-' + dateLater(e.detail.value, 180).newdates
    })
  },
  bvPL2_90(e) {
    this.setData({
      pl2_90startdate: e.detail.value,
      pl2_90enddate: dateLater(e.detail.value, 90).year + '-' + dateLater(e.detail.value, 90).newdates
    })
  },
  bvPL1_360(e) {
    this.setData({
      pl1_360startdate: e.detail.value,
      pl1_360enddate: dateLater(e.detail.value, 360).year + '-' + dateLater(e.detail.value, 360).newdates
    })
  },
  bvPL1_180(e) {
    this.setData({
      pl1_180startdate: e.detail.value,
      pl1_180enddate: dateLater(e.detail.value, 180).year + '-' + dateLater(e.detail.value, 180).newdates
    })
  },
  bvPL1_90(e) {
    this.setData({
      pl1_90startdate: e.detail.value,
      pl1_90enddate: dateLater(e.detail.value, 90).year + '-' + dateLater(e.detail.value, 90).newdates
    })
  },
  bvBuy(e) {
    let that = this
      this.data.pricelevel= e.currentTarget.dataset.level
      this.data.discountid= e.currentTarget.dataset.id
      this.data.discountname= e.currentTarget.dataset.name
      this.data.dlstartdate= e.currentTarget.dataset.startdate
      this.data.dlenddate= e.currentTarget.dataset.enddate
      this.data.totalfee= e.currentTarget.dataset.price

      if (this.data.dlstartdate == "" || this.data.dlstartdate == undefined) {
        wx.showToast({
          title: '请选择生效日期',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.ordersublock) {} else {
        const db = wx.cloud.database()
        // 新增数据
        db.collection("DISCOUNTORDER").add({
          data: {
            PriceLevel: this.data.pricelevel,
            DiscountId: this.data.discountid,
            DiscountName: this.data.discountname,
            DLStartDate: this.data.dlstartdate,
            DLEndDate: this.data.dlenddate,
            TotalFee: this.data.totalfee,
            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus:"unchecked",
            OrderStatus:"unchecked",
          },
          success(res) {
            that.setData({
              ordersublock: true
            })
          },
          fail(res) {
            wx.showToast({
              title: '提交失败请重试',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        })
      }
      if (this.data.paymentsublock) {} else {
        const db = wx.cloud.database()
        db.collection("PAYMENT").add({
          data: {
            ProductId: this.data.discountid,
            ProductName: this.data.discountname,
            TotalFee: this.data.totalfee,
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus: "unchecked",
          },
          success(res) {
            that.setData({
              paymentsublock: true
            })
          },
          fail(res) {
            wx.showToast({
              title: '提交失败请重试',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        })
      }
      if (this.data.ordersublock == true && this.data.paymentsublock == true) {
        wx.showToast({
          title: '成功提交转支付',
          icon: 'success',
          duration: 2000, //持续的时间
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '../order/pay?totalfee=' + that.data.totalfee
              })
            }, 2000);
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })

    console.log(this.data.startdate)
    // let that=this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
        _openid: app.globalData.Gopenid,
        PaymentStatus:"checked",
        OrderStatus:"checked"
      }).orderBy('SysAddDate','desc').get({
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              tempfliter.push(res.data[i]);
            }
          }
          if(tempfliter.length !=0  && tempfliter.length != undefined){
                    console.log(tempfliter)
          this.setData({
            plstartdate: tempfliter[0].DLStartDate,
            plenddate: tempfliter[0].DLEndDate,
            paymentstatus: tempfliter[0].PaymentStatus,
            orderstatus: tempfliter[0].OrderStatus,
          })
          if (tempfliter[0].PriceLevel == "PL1") {
            this.setData({
              plname: "特惠价"
            })
          } else if (tempfliter[0].PriceLevel == "PL2") {
            this.setData({
              plname: "巨惠价"
            })
          } else if (tempfliter[0].PriceLevel == "PL3") {
            this.setData({
              plname: "优惠价"
            })
          } else if (tempfliter[0].PriceLevel == "PL4") {
            this.setData({
              plname: "普客价"
            })
          }
        } else{
            //卡券已过期
            this.setData({
              plname: "普客价"
            })
          }
        } else {
          //没有卡券
          this.setData({
            plname: "普客价",
          })
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})