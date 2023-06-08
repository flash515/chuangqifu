    // 云函数入口文件
    const cloud = require('wx-server-sdk')
    cloud.init({
      env: 'xsbmain-9gvsp7vo651fd1a9',
      traceUser: true,
    })
    const db = cloud.database()
    // 云函数入口函数
    exports.main = async (event, context) => {
var dktemp = []
var zctemp = []
for (let i = 0; i < event.userarray.length; i++) {
  let dkpromise = db.collection('DKORDER').where({
    UserId:event.userarray[i].UserId,
  }).get()
     dktemp=dktemp.concat(dkpromise)
}
return (await Promise.all(dktemp))
for (let x = 0; x < event.userarray.length; x++) {
  let zcpromise = db.collection('ZCORDER').where({
    UserId:event.userarray[x].UserId,
  }).get()
     zctemp=zctemp.concat(zcpromise)
}
return (await Promise.all(dktemp),await Promise.all(zctemp))
    }

