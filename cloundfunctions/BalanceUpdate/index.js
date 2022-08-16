// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gn7aud7a22c693c',
  traceUser: true,
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
  return await db.collection('PRODUCTQA').where({
    _id: event.id,
  }).update({
    data: {
    Answer: event.answer,
    Status: event.status,
    UpdateDate: event.updatedate
    }
  })
}catch (e) {
  console.log(e)
}
}