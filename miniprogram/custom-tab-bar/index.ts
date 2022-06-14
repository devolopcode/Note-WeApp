// custom-tab-bar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 1,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "../classify/classify",
      iconPath: "../images/tabBar/classify.png",
      selectedIconPath: "../images/tabBar/classify-select.png",
      text: ""
    }, {
      pagePath: "../index/index",
      iconPath: "../images/tabBar/notebook.png",
      selectedIconPath: "../images/tabBar/notebook-select.png",
      text: ""
    },{
      pagePath:"../individual/individual",
      iconPath:"../images/tabBar/individual.png",
      selectedIconPath:"../images/tabBar/individual-select.png",
      text:""
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e:any) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})
