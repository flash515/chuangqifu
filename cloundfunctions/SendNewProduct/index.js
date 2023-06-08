// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
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
        thing10: {
          value: event.thing10
        },
        name1: {
          value: event.name1
        },
        amount2: {
          value: event.amount2
        },
        thing8: {
          value: event.thing8
        }
      },
      templateId: 'H4fK4iyDUqkVVxrd7RWuDQh5DOhoChTn8phqFGlfwRU',
      miniprogramState: 'developer'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
