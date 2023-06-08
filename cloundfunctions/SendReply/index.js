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
      touser: event.openid ,
      page: '../../pages/index/index',
      lang: 'zh_CN',
      data: {
        date6: {
          value: event.date6
        },
        thing4: {
          value: event.thing4
        },
        thing2: {
          value: event.thing2
        },
        name1: {
          value: event.name1
        }
      },
      templateId: 'tXhFEK36Dqkasd9Cmmuh5EKZ6LZycrWfgn4xqBreQz4',
      miniprogramState: 'developer'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
