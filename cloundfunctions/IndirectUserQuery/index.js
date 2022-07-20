    // 云函数入口文件
    const cloud = require('wx-server-sdk')
    cloud.init({
      env: 'cloud1-2gn7aud7a22c693c',
      traceUser: true,
    })
    const db = cloud.database()
    // 云函数入口函数
    exports.main = async (event, context) => {
var temp = []
for (let i = 0; i < event.userarray.length; i++) {
  let promise = db.collection('USER').where({
    InviterOpenId:event.userarray[i]._openid,
  }).get()
     temp=temp.concat((await promise).data)
}
// return (await Promise.all(temp))
return temp
}