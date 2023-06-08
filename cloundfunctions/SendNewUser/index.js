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
        date1: {
          value: event.date1
        },
        phrase2: {
          value: event.phrase2
        },
        thing3: {
          value: event.thing3
        }
      },
      templateId: 'Ap6SsQZ-fj8SZkyVv9ZvIg8EcJ5b1jgmMQko_o4LyAw',
      miniprogramState: 'developer'
    })

    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}