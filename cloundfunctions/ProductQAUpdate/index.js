// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
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