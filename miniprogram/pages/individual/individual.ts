// pages/individual/individual.ts
import MyPromise from "../../utils/myPromise"
import MyRequest from "../../utils/myRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that=this
    wx.getStorage({
      key:'nickName',
      success:(res)=>{
        console.log(res)
        that.setData({
          nickName:res.data
        })
      }
    })
    wx.getStorage({
      key:'avatarUrl',
      success:(res)=>{
        console.log(res)
        this.setData({
          avatarUrl:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 登陆用户
   */
  loginUser() {
    const that = this
    let rawData:string=''
    let signature:string=''
    let encryptedData:string=''
    let iv=""
    new MyPromise((resolve: Function, reject: Function) => {
      if(!wx.getStorageSync('thirdSessionId')){
        resolve()
      }
    }).then(() => {
      return new MyPromise((resolve: Function, reject: Function) => {
        wx.getUserProfile({
          desc: "获取微信名和头像",
          lang: 'zh_CN',
          success: (res: any) => {
            console.log(res)
            rawData=res.rawData
            signature=res.signature
            encryptedData=res.encryptedData
            iv=res.iv
            resolve(res.rawData)
          },
          fail: (err: any) => {
            reject(err)
          }
        })
      })
    }, () => {

    }).then((rawData: string) => {
      return new MyPromise((resolve: Function, reject: Function) => {
        wx.login({
          success: (res) => {
            console.log(res)
            if (res.errMsg === "login:ok") {
              wx.setStorageSync('nickName',JSON.parse(rawData).nickName)
              wx.setStorageSync('avatarUrl',JSON.parse(rawData).avatarUrl)
              resolve(res.code)
            } else {
              reject("登录失败")
            }
          },
          fail: ((err) => {
            reject(err)
          })
        })
      })
    }, (err: any) => {
      console.log(err)
    }).then((code: string) => {
      console.log('code 在这里')
      console.log(code)
      return MyRequest('POST', `/user/signup`,{})
    }, (err: any) => {
      console.log(err)
    }).then((value: any) => {
      wx.setStorageSync('thirdSessionId',value.thirdSessionId)
      that.setData({
        nickName:wx.getStorageSync('nickName'),
        avatarUrl:wx.getStorageSync('avatarUrl')
      })
    }, (err: any) => {
      wx.clearStorageSync()
      console.log(err)
    })
  }
})