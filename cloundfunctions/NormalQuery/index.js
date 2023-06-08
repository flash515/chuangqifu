// 云函数入口文件
//event.collectionName  //数据库表
//event.command  //查询指令
//event.where  //查询条件

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
let orderbykey = "_id"
let orderby = "desc"
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.orderbykey != undefined && event.orderbykey != '') {
    orderbykey = event.orderbykey
    orderby = event.orderby
  }
  switch (event.command) {
    case "or": {
      return queryByWhere({
        collectionName: event.collectionName,
        where: event.where,
        command: db.command.or,
        orderbykey,
        orderby,
      })
    }
    case "and": {
      return queryByWhere({
        collectionName: event.collectionName,
        where: event.where,
        command: db.command.and,
        orderbykey,
        orderby,
      })
    }
    case "": {
      // event.where为空时默认为and
      return queryByWhere({
        collectionName: event.collectionName,
        where: event.where,
        command: db.command.and,
        orderbykey,
        orderby,
      })
    }
  }
  async function queryByWhere(param) {
    const com = param.command
    //先取符合条件的记录总数
    const countResult = await db.collection(param.collectionName).where(
      com(param.where)
      //传入的条件参数
    ).orderBy(param.orderbykey, param.orderby).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(param.collectionName).where(
        //传入的条件参数
        com(param.where)
      ).skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy(param.orderbykey, param.orderby).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
      }
  })
  }
}