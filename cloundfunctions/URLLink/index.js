const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
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
        //   "env": 'xsbmain-9gvsp7vo651fd1a9',
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