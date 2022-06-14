// pages/index/index.ts

import MyPromise from "../../utils/myPromise"
import MyRequest from "../../utils/myRequest"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    notes: [],
    text: "",
    keyword: "",
    CustomBar:getApp().globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    let that = this
    console.log('hello world')
    MyRequest('GET', `/n/select`, '').then((res: any) => {
      console.log(res)
      that.setData({
        notes: res
      })
    }, (err: any) => {
      wx.showToast({
        icon: 'error',
        title: '网络错误'
      })
    })
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
   * 
   * @param e 
   */
  // input(e:any) {
  //   let reg=new RegExp(`.*${e.detail.value}.*`)
  //   let list=this.data.notes.filter((value)=>{
  //     // return value.match(reg)!=null
  //   });
  //   this.setData({
  //     newNoteList:list
  //   })
  // },

  /**
   * 
   */
  clear() {
    this.setData({
      keyword: ''
    })
  },

  /**
   * 
   */
  write() {
    if (!wx.getStorageSync('thirdSessionId')) {
      wx.showModal({
        title: '请先登录',
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '../individual/individual'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../writeNote/writeNote'
      })
    }
  }
})