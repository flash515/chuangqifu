// 云函数入口文件
const cloud = require('wx-server-sdk');
 
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
});
 
// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    body: event.body, // 商品描述,必填
    outTradeNo: event.goodsnum, // 商户订单号,必填,不能重复
    spbillCreateIp: '127.0.0.1', // 终端IP，必填
    subMchId: "1612084242",//event.subMchId, // 子商户号,微信支付商户号,必填
    totalFee: event.payVal, // 总金额,必填
    envId: 'xsbmain-9gvsp7vo651fd1a9', // 结果通知回调云函数环境,你自己小程序的坏境id
    functionName: 'wechatpay', // 结果通知回调云函数名,非必填参数,即使为空,也不影响支付,但是官方文档里写的是必填参数,表示已醉
  });
  return res;
};
