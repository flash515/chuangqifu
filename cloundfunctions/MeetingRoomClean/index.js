// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gn7aud7a22c693c',
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