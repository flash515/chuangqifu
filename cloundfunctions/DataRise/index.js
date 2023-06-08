// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
// 使用云函数更新解决小程序端更新的数据权限问题
  try{
  return await db.collection(event.collectionName).where({
    [event.key]:event.value
  }).update({
    data: {
      [event.key1]: _.inc(event.value1),
    },
    success: res => {
      console.log(res)
    },
    faile: res => {
      console.log(res)
    }
    })
}catch (e) {
  console.log(e)
}
}