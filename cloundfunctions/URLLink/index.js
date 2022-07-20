const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gn7aud7a22c693c',
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.urllink.generate({
        "path": '/pages/index/index',
        "query": event.query,
        "isExpire": false,
        // "expireType": 1,
        // "expireInterval": 365,
        // "cloudBase": {
        //   "env": 'cloud1-2gn7aud7a22c693c',
        //   "domain": 'xxx.xx',
        //   "path": '/jump-wxa.html',
        //   "query": 'a=1&b=2'
        // }
      })
    return result
  } catch (err) {
    return err
  }
}