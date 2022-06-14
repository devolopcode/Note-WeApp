// app.ts
var plugin = requirePlugin("chatbot");

App({
  globalData: {
    StatusBar:0,
    Custom:{},
    CustomBar:0
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      fail() {
        wx.clearStorageSync()
      }
    })
    plugin.init({
      appid: "TWBy1YUYKJTgRLmVdWre06IutAQY6c",
      openid: "oXaqt5CgDpYrvQKh1e4D-5bqcEaI", // 小程序的openid，必填项
      autoRecommendGuideList: true,
      success: () => { },
      fail: (error: any) => {
        console.log(error)
      },
      guideList: ["您好"],
      textToSpeech: true, //默认为ture打开状态
      background: "rgba(247,251,252,1)",
      guideCardHeight: 40,
      operateCardHeight: 145,
      history: true,
      navHeight: 0,
      robotHeader: "",
      userHeader: "",
      userName: "",
      anonymous: false, // 是否允许匿名用户登录，版本1.2.9后生效, 默认为false，设为ture时，未传递userName、userHeader两个字段时将弹出登录框
      hideMovableButton: false,
    });
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
})