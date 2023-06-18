const app = getApp();
const utils = require("../../utils/utils");
Page({
  data: {
    // 初始化相关
    params: {},
    tempinviterid: "",
    remark: "",
  },

  onLoad: async function (options) {
    let that = this
    var c1 = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: 'wx810b87f0575b9a47',
      // 资源方环境 ID
      resourceEnv: 'xsbmain-9gvsp7vo651fd1a9',
    })
    // 跨账号调用，必须等待 init 完成
    // init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
    await c1.init()
    //options内容：scene扫码参数，page跳转页面，type跳转类型，path1路径1，path2路径2，userid推荐人ID,productid产品id
    console.log("接收到的参数", options)
    if (options.userid) {
      // 如果是通过链接打开
      this.data.params = options
      this.data.tempinviterid = options.userid
      this.data.remark = "通过创企服用户分享链接进入"
      console.log("通过链接打开接收到的参数", this.data.tempinviterid);
    } else if (options.scene) {
      // 如果是通过扫码进入（scene中只有参数值，通过&和顺序区分）
      let scene = decodeURIComponent(options.scene);
      //可以连接多个参数值，&是我们定义的参数链接方式
      // let inviterid = scene.split('&')[0];
      // let userId = scene.split("&")[1];
      this.data.params = scene
      this.data.tempinviterid = scene.split('&')[0]
      this.data.remark = "通过创企服用户小程序码进入"
      // openid升级unionid后的适配，老名片用完后一年后可删除
      if (this.data.tempinviterid == "omLS75Xib_obyxkVAahnBffPytcA") {
        this.data.tempinviterid = "oo7kw5rohI15ogf6TCX_SGAxYUao"
      }
      console.log("小程序码进入参数:", this.data.tempinviterid);
    } else {
      // 两种都不带参数，则是自主搜索小程序进入，推荐人指定为开发人
      this.data.tempinviterid = "oo7kw5rohI15ogf6TCX_SGAxYUao"
      this.data.remark = "创企服无参数进入"
    }

    // 调用方法初始化
    await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    wx.switchTab({
      url: '../index/home',
    })

  },

  onShow: function () {

  },

})