const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //新增数据变量
    date1:"",
    date2:"",
    date3:"",
    date4:"",
    date5:"",
    date6:"",
    date7:"",
    date8:"",
    date9:"",
  },
  bvRefresh(e) {
    console.log("刷新执行了")
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('POINTS').where(_.or([{
      RegistrantId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
    },
      {
        InviterId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
      },
      {
        IndirectInviterId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
      }
    ])).get({
      success: res => {
        wx.setStorageSync('LPoints', res.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询相关积分", res.data)
      },
      complete:res => {
        console.log(res)
      },
    })
  
  },
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
var date1=new Date()
var date2=new Date().getTime()
var date3=new Date(1677827326678)
var date4=new Date(1677827326678).toLocaleString('chinese',{ hour12: false })
var date5=new Date(1677827326678).toLocaleString()
var date6=new Date(1677827326678).toLocaleTimeString()
var date7=new Date(1677827326678).toLocaleString('chinese',{ hour12: false })//后台转换时间戳为24小时格式
var date8=new Date("2023/3/3 15:08:46").getTime()


console.log(date1)

console.log(date2)
console.log(date3)
console.log(date4)
console.log(date5)
console.log(date6)
console.log(date7)
console.log(date8)
  },
})
