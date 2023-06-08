// 新建页面埋点
const app = getApp()
const utils = require("../utils/utils");
// temptrack用于记录所有track,初始化定义要放在外层，避免被内层多次初始化
var temptrack = []
let newStorage = data => {
  return {
    time: data && data.time || 0, // 页面访问时间
    click: data && data.click || [], // 点击事件次数
  }
}
let route = ""; // 当前页面路由
let storage = null; // 埋点信息
let TIME = null; // 当前页累计访问时间(秒)

// 计时器：记录当前页面停留时间
let buying = function () {
  let func = () => storage.time++;
  TIME = setInterval(func, 1000);
}

// 获取埋点数据
let getSession = () => {
  wx.getStorage({
    key: route,
    success: res => storage = newStorage(res.data), // 已有当前页信息
    fail: res => storage = newStorage(), // 没有当前页信息
    complete: () => buying() // 开始计时
  })
}

// 停止统计 && 保存埋点数据 && 初始化页面变量
let setSession = () => {
  // trackarray是在本方法中赋值，初始化要放在本方法中，避免没有初始化而造成数据重复
  var trackarray = []
  clearInterval(TIME); // 停止统计
  wx.setStorage({
    key: route,
    data: storage
  }) // 保存埋点数据

  // 构建一个临时对象
  var obj = new Object();
  obj = {
    [route]: [storage]
  }
  //用object.assign方法把对象推入到temptrack变里里，
  Object.assign(temptrack, obj)
  console.log("temptrack", temptrack)
  //但是object在更新数接库时无效，所以再转为array用于更新数据库
  for (var key in temptrack) {
    if (!temptrack.hasOwnProperty(key)) {
      continue;
    }
    var item = {};
    item[key] = temptrack[key];
    trackarray.push(item);
  }
  // 更新USER数据库里的Track字段
  utils.CloudInit(function (c1) {
    const db = c1.database()
    console.log(app.globalData.Guserid)
    db.collection("USER").where({
      UserId: app.globalData.Guserid,
    }).update({
      data: {
        Track: trackarray
      },
      complete(res) {
        console.log("track更新", res)
      }
    })
  })
  console.log("trackarray", trackarray)
  initData(); // 初始化
}

// 小程序切前台
wx.onAppShow(res => {
  route = res.path;
  getSession();
})

// 小程序切后台
wx.onAppHide(res => setSession())

// 异常捕捉
// wx.onError(error => console.error("捕获到异常错误：", error))

// 初始化信息
let initData = () => {
  route = "";
  storage = null;
  TIME = null;
}

module.exports = {
  // 页面触发埋点
  startToTrack() {
    setSession(); // 停止旧页面统计 && 保存旧页面信息

    let arr = getCurrentPages(); // 获取页面信息
    route = arr[arr.length - 1].route; // 获取页面路由
    getSession(); // 获取新页面埋点信息 && 开始统计
  },

  // 返回按钮触发埋点
  startByBack() {
    setSession(); // 停止旧页面统计 && 保存旧页面信息

    let arr = getCurrentPages(); // 获取页面信息
    route = arr[arr.length - 2].route; // 获取页面路由
    getSession(); // 获取新页面埋点信息 && 开始统计
  },

  // 通过点击事件触发埋点 id--以dom的id属性作为storage里唯一的key值
  startByClick(id) {
    let arr = storage.click.filter(item => item.id === id); // 查找元素历史足迹
    if (arr.length) {
      arr[0].num++; // 继续增长
      storage.click.concat(arr);
    } else {
      storage.click.push({
        id: id,
        num: 1
      }); // 新增
    }
  },

  // 查询storage用量, 同一个小程序 storage最大限制10MB
  getStorageBalance() {
    wx.getStorageInfo({
      success: option => {
        console.log("当前内存使用量：", option.currentSize, "KB");
        console.log("剩余内存可用量：", `${option.limitSize - option.currentSize}KB(${100 - (option.currentSize / option.limitSize)}%)`)
      }
    })
  }
}