// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gn7aud7a22c693c',
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {

    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: '../../pages/index/index',
      lang: 'zh_CN',
      data: {
        thing1: {
          value: event.thing1
        },
        time2: {
          value: event.time2
        },
      },
      templateId: 'Z1znM-MaX0eQKsXJNJxuu4oetRGDnTXM4AiO6AR0Rww',
      miniprogramState: 'developer'
    })

    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}