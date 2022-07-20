    // 云函数入口文件
    const cloud = require('wx-server-sdk')
    cloud.init({
      env: 'cloud1-2gn7aud7a22c693c',
      traceUser: true,
    })
    const db = cloud.database()
    // 云函数入口函数
    exports.main = async (event, context) => {
var dktemp = []
var zctemp = []
for (let i = 0; i < event.userarray.length; i++) {
  let dkpromise = db.collection('DKORDER').where({
    _openid:event.userarray[i]._openid,
  }).get()
     dktemp=dktemp.concat(dkpromise)
}
return (await Promise.all(dktemp))
for (let x = 0; x < event.userarray.length; x++) {
  let zcpromise = db.collection('ZCORDER').where({
    _openid:event.userarray[x]._openid,
  }).get()
     zctemp=zctemp.concat(zcpromise)
}
return (await Promise.all(dktemp),await Promise.all(zctemp))
    }

