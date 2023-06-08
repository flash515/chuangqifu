// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  // const dbName = event.collection
  try {
    return await db.collection(event.collection).where({
      _id: _.exists(true)
    }).remove()
  } catch (e) {
    console.log(e)
  }
}