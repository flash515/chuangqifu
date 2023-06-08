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
  return await db.collection('setting').doc('28ee4e3e60c48c3821c54eee6564dec5').update({
    data: {
      [event.key1]: event.value1,
      [event.key2]: event.value2,
      [event.key3]: event.value3,
    }
  })
}catch (e) {
  console.log(e)
}
}