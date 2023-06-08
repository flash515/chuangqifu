// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    var promise = new Promise((resolve, reject) => {
    var tempfiles = []
    for (let i = 0; i < event.filelist.length; ++i) {
      tempfiles = tempfiles.concat(new Promise((resolve, reject) => {
        const filePath = event.filelist[i]
        const cloudPath = event.cloudpath + [i+1] + filePath.match(/\.[^.]+?$/)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('res', res.fileID)
            resolve(res.fileID)
          }
        })
      }))
    }
    Promise.all(tempfiles).then(res => {
      console.log(res)
      resolve(res)
    }, err => {
      console.log(err)
    })
  });
  return promise;
}