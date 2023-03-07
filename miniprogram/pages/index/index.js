// index.js
const app=getApp()
let content=''
Page({
  
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品列表
    
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      width: wx.getSystemInfoSync().windowWidth
    })
  },
  checkuser(){
    let db=wx.cloud.database()
    var st="onsell"
    db.collection('user')
    .where({_openid:app.globalData.openid})
    .get()
    .then(res=>{
      console.log('success get the data 测试',res.data[0].islocked)
      if(res.data[0].islocked)
      {
        wx.showToast({
          title: '您已被锁定',
          icon:'error'
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../mine/mine',
          })
        },1000)
      }
    })
    .catch(err=>{
      console.log("error",err)
    })
  },
  onShow(){
    this.checkuser()
    this.getGoodList()
  },
  getGoodList(){
    let db=wx.cloud.database()
    var st="onsell"
    db.collection('shop_goods')
    .where({state:st})
    .get()
    .then(res=>{
      console.log('success get the data',res)
      this.setData({
        goodlist:res.data
      })
    })
    .catch(err=>{
      console.log("error",err)
    })
  },
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
  toBook(e){
    let mtype='book'
      wx.navigateTo({
        url: '../goodList/goodList?type=' + mtype,
      })
  },
  toCloth(){
    let mtype='clothes'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  tomakeup(){
    let mtype='makeup'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  todigit(){
    let mtype='digital'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  tobycicle(){
    let mtype='bycicle'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  tobag(){
    let mtype='bag'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  todecoration(){
    let mtype='decoration'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  tofood(){
    let mtype='food'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  toothers(){
    let mtype='others'
    wx.navigateTo({
      url: '../goodList/goodList?type=' + mtype,
    })
  },
  getContent(e){
    content=e.detail.value
  },
  tosearch(e){
    // let content=e.
    wx.navigateTo({
      url: '../Search/Search?content=' + content,
    })
  }
})
