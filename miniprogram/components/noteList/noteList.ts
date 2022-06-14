// components/noteList/noteList.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    notes:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CustomBar:getApp().globalData.CustomBar,
    show:true,
    startY:0,
    scrollTop:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scroll(e:any){
      this.setData({
        scrollTop:e.detail.scrollTop
      })
    },
    touchStart(e:any){
      console.log("touchStart",e)

      this.setData({
        startY:e.touches[0].pageY
      })
    },
    touchEnd(e:any){
      console.log("touchEnd",e)
      let endY = e.changedTouches[0].pageY
      let  yOffset = endY - this.data.startY;
      if (yOffset < 0&&this.data.scrollTop>20) {
        console.log('向上滑动')
        this.setData({
          show:false,
          startY:0
        })
      } else if(yOffset > 0&&this.data.scrollTop>20) {
        console.log('向下滑动')
        this.setData({
          show:true,
          startY:0
        })
      } else{
        this.setData({
          show:true
        })
      }
    },
    touchCancel(){
    },
    touchMove(e:any){
      console.log(e)
    },
    edit(e:any){
      let _id=e.currentTarget.dataset['_id']
      wx.navigateTo({
        url:`../../pages/writeNote/writeNote?_id=${_id}`
      })
    },
  },
  
  /**
   * 激活插槽
   */
  options:{
    multipleSlots: true
  },
  /**
   * 在组件实例刚刚被创建时执行
   */
  created(){

  },

  /**
   * 在组件进入页面节点树时执行
   */
  attached(){
    let list=this.data.notes.reverse()
    this.setData({
      noteList:list
    })
  },

  /**
   * 在组件视图层布局完成后执行
   */
  ready(){
    
  },

  /**
   * 在组件实例移动到节点树另一个位置时执行
   */
  moved(){

  },

  /**
   * 在组件实例被从页面节点树移除时执行
   */
  detached(){

  },

  /**
   * 每当组件抛出错误方法时执行
   */
  error(){

  }
})
