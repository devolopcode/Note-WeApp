// pages/writeNote/writeNote.ts
import EditorContext from "../../utils/editorContext"
import MyPromise from '../../utils/myPromise'
import MyRequest from '../../utils/myRequest'
import { formatTime } from "../../utils/util";

var plugin = requirePlugin("chatbot");
const editorCtx: EditorContext = {}

Page({

  editorCtx: editorCtx,

  /**
   * 页面的初始数据
   */
  data: {
    _id: "",
    placeholder: "输入文本...",
    title: "",
    editTime: "",
    empty: true,
    save: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context as EditorContext
    }).exec(() => {
      if (options._id) {
        let _id = options._id
        let data = { _id }
        let query = `_id=${_id}`
        MyRequest('GET', `/n/selectOne?${query}`, data).then((res: any) => {
          console.log(res)
          that.setData({
            _id: res._id,
            title: res.title,
            editTime: res.editTime,
          })
          return res.contents
        }, (err: any) => {
        }).then((ops: any) => {
          that.setContents(
            { ops }
          )
        }, (err: any) => {

        })
      }
    })

    this.setData({
      editTime: formatTime(new Date())
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
   * 用户点击返回按钮
   */
  back() {
    let that = this
    if (!this.data.empty && !this.data.save) {
      wx.showModal({
        title: '是否保存所作更改',
        success: () => {
          that.save()
          wx.navigateBack({

          })
        },
        fail: () => {
          wx.navigateBack({

          })
        }
      })
    } else {
      wx.navigateBack({

      })
    }
    this.getContents((res: any) => {
      console.log(res)
    })
  },

  /**
   * 插入图片
   */
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          width: '100%'
        })
      }
    })
  },

  /**
   * 
   */
  updatePosition(keyboardHeight: number) {
    const toolbarHeight = 50
    const { windowHeight } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },

  /**
   * 获取编辑器内容
   */
  getContents(callback: Function) {
    this.editorCtx.getContents({
      success: function (res: any) {
        callback(res)
      }
    })
  },

  setContents(delta: any) {
    console.log(delta)
    this.editorCtx.setContents({
      // delta:{ops:[{insert:'he'}]},
      delta: delta,
      success: (res: any) => {
        console.log(res)
      },
      fail: (err: any) => {
        console.log(err)
      },
    })
    console.log('hello world')
    this.getContents((res: any) => {
      console.log(res)
    })
  },

  onEditorInput(e: any) {
    if (e.detail.delta.ops[0].insert.image === undefined && e.detail.delta.ops[0].insert.trim() === '') {
      this.setData({
        empty: true,
        isSave: true
      })
    } else {
      this.setData({
        empty: false,
        isSave: false
      })
    }
  },

  save() {
    console.log("hello world")
    if (!this.data.empty&&!this.data.save&&this.data._id) {
      this.update()
    }else if(!this.data.empty&&!this.data.save){
      this.upload()
    }else{
      return
    }
    
  },

  /**
   * 更新
   */
  update(){
    const that = this
    new MyPromise((resolve: Function, reject: Function) => {
      that.getContents((res: any) => {
        let l = res.delta.ops.length;
        let i = 0;
        while (i < l) {
          if (typeof res.delta.ops[i].insert == "object") {
            wx.uploadFile({
              filePath: res.delta.ops[i].insert.image,
              name: "image",
              url: 'http://localhost:8080/api/i/upload',
              success: (res) => {
                console.log(res)
              }
            })
          }
          i++
        }
        resolve(res)
      })
    }).then((value: any) => {
      console.log(value.delta.ops)
      let data = {
        title: that.data.title || '未命名',
        contents: value.delta.ops,
        editTime: this.data.editTime
      }
      return MyRequest('POST', '/n/upload', data)
    }, (error: any) => {
      console.log(error)
    }).then((value: any) => {
      console.log(value)
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 500
      })
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 500)
      that.setData({
        isSave: true
      })
    }, (error: any) => {
      console.log(error)
      wx.showToast({
        title: '上传失败',
        icon: 'error',
        duration: 500
      })
      that.setData({
        isSave: false
      })
    })
  },

  /**
   * 上传
   */
  upload(){
    const that = this
    new MyPromise((resolve: Function, reject: Function) => {
      that.getContents((res: any) => {
        let l = res.delta.ops.length;
        let i = 0;
        while (i < l) {
          if (typeof res.delta.ops[i].insert == "object") {
            wx.uploadFile({
              filePath: res.delta.ops[i].insert.image,
              name: "image",
              url: 'http://localhost:8080/api/i/upload',
              success: (res) => {
                console.log(res)
              }
            })
          }
          i++
        }
        resolve(res)
      })
    }).then((value: any) => {
      console.log(value.delta.ops)
      let data = {
        title: that.data.title || '未命名',
        contents: value.delta.ops,
        editTime: this.data.editTime
      }
      return MyRequest('POST', '/n/upload', data)
    }, (error: any) => {
      console.log(error)
    }).then((value: any) => {
      console.log(value)
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 500
      })
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 500)
      that.setData({
        isSave: true
      })
    }, (error: any) => {
      console.log(error)
      wx.showToast({
        title: '上传失败',
        icon: 'error',
        duration: 500
      })
      that.setData({
        isSave: false
      })
    })
  },

  /**
   * 
   */
  async nlp() {
    let txt:string=''
    this.getContents((res:any)=>{
      res.delta.ops.forEach((item:any) => {
        if(typeof item.insert=="string"&&item.insert.trim()!=''){
          if(txt==''){
            txt=item.insert
          }else{
            txt=txt+'，'+item.insert
          }
        }
      });
      plugin.api.nlp("tokenize", { q: txt }).then((res: any) => {
        console.log(txt)
        console.log("tokenize result : ", res);
      }, (err: any) => {
        console.log(err)
      });
    })
    // const txt =
    //   "在微信智言与微信智聆两大技术的支持下，微信AI团队推出了“微信对话开放平台”和“腾讯小微”智能硬件两大核心产品。微信支付团队最新发布的“微信青蛙Pro”在现场设置了体验区，让大家感受AI认脸的本事。";
  }
})