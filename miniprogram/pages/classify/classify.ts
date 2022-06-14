// pages/classify/classify.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[
      {
        "name":"数学",
        "url":"../../images/classify/math.png"
      },
      {
        "name":"化学",
        "url":"../../images/classify/chemistry.png"
      },
      {
        "name":"英语",
        "url":"../../images/classify/english.png"
      },
      {
        "name":"语文",
        "url":"../../images/classify/chinese.png"
      },
      {
        "name":"其他",
        "url":"../../images/classify/other.png"
      }
    ]
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
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
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

  }
})