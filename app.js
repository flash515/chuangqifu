//app.js
App({
  onLaunch: async function () {
    // 测试async，await可用
    // (async () => {
    //   const p = await new Promise(resolve => {
    //     setTimeout(() => resolve("hello async/await"), 1000);
    //   });
    //   console.log(p);
    // })();

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'xsbmain-9gvsp7vo651fd1a9',
        traceUser: true,
      })
    }
    // 初始化全局参数
    this.globalData = {}

    // 清除本地存储数据,调试发布后可去除
    
    // wx.clearStorage({
    //   success: (res) => {
    //     console.log("清除本地存储数据成功")
    //   },
    // })

    	/*调用方关键代码如下*/
    // 声明新的 cloud 实例
    var c1 = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: 'wx810b87f0575b9a47',
      // 资源方环境 ID
      resourceEnv: 'xsbmain-9gvsp7vo651fd1a9',
      })
      
      // 跨账号调用，必须等待 init 完成
      // init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
      await c1.init()
      // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log("res", res)
    //   }
    // })


    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({ // 获取设备宽高
      success: res => {
        this.globalData.Gsysteminfo = res
        console.log("可用屏幕高", this.globalData.Gsysteminfo.windowHeight)
        console.log("可用屏幕宽", this.globalData.Gsysteminfo.windowWidth)
      }

    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '小税宝新版本已经准备好，请重启小程序',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新的版本',
              content: '小税宝新版本已经上线，请删除当前小程序，重新搜索并打开'
            })
          })
        }
      })
    }
  },
  globalData: {
    //全局变量要考虑新用户初始情况及老用户赋值情况，尽量避免过于概括或过于琐碎
    // 接收到的参数数组,包含推荐人userid,页面路径page，来源编号source等
    Gsysteminfo: [], //系统参数

    GWidth: "", // 屏幕可用宽度
    GHeight: "", // 屏幕可用高度
    Gsetting: [], //设置信息

    Gproduct: [], // 在售商品
    Gproductlist: [], // 数据库中全部商品

    Guserid: "", // 用户本人小程序id 
    Guserdata: [], //用户个人全部数据,

    Gdirect1yearvaliduser: "", //一年内有效推荐用户数

    Gsearch: [],
    Gtrack: [], //浏览记录
    // 直接推荐人
    Ginviter: [], //推荐人信息,待删除
    Ginviterid: "", //推荐人id
    Ginviterphone: "", //推荐人手机，发送认证积分短信时使用
    Ginviterpromoterlevel: "", //推荐人推广级别,待删除
    Ginviterbalance: "", //推荐人积分,待删除
    // 间接推荐人
    Gindirectinviter: [], //间接推荐人信息,待删除
    Gindirectinviterid: "", //间接推荐人id,
    Gindirectinviterpromoterlevel: "", //间接推荐人推广级别,待删除
    Gindirectinviterbalance: "", //间接推荐人积分,待删除

    Gimagearray: [], //轮播图

    //个人设置参数
    Gpriceshow: '',
    Gdirectvalueshow: '',
    Gindirectvalueshow: '',
    Gdirectusershow: '',
    Gindirectusershow: '',
    Gvaluedetailshow: '',
    Guserdetailshow: '',
  }
})