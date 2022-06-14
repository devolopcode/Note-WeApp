import MyPromise from './myPromise'

type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT' | undefined

const baseURL = 'http://42.192.155.29:5556'

function MyRequest(method: METHOD, url: string, data: any) {
  return new MyPromise(function (resolve: Function, reject: Function) {
    const thirdSessionId = wx.getStorageSync('thirdSessionId')
    console.log(thirdSessionId)
    let header: { [key: string]: string } = {
      'content-type': 'application/json',
      'Authorization': thirdSessionId
    };
    wx.request({
      url: baseURL + url,
      method: method,
      data: method === 'POST' ? JSON.stringify(data) : data,
      header: header,
      success(res: any) {
        //请求成功
        //判断状态码---errCode状态根据后端定义来判断
        if (res.data.code === 200) {
          console.log('hello world')
          console.log(res.data)
          resolve(res.data.data)
        } else {
          reject(res.data.msg)
        }
      },
      fail(err) {
        //请求失败
        console.log('hello error')
        reject(err)
      }
    })
  })
}

export default MyRequest