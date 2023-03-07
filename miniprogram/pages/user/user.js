// pages/user/user.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfollowed:false,
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('我输出options看看',options)
    this.setData({
      uid:options.uid
    })
    let db=wx.cloud.database()
    db.collection('user')
    .where({_openid:options.uid})
    .get()
    .then(res=>{
      this.setData({
        user:res.data[0]
      })
      this.getfollowStatus()
    })
    db.collection('shop_goods')
    .where({_openid:options.uid,
      state:'onsell'})
    .get()
    .then(res=>{
      this.setData({
        goodlist:res.data
      })
    })
  },
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
  floacion(e){
    console.log(this.data.uid)
    if(this.data.uid==app.globalData.openid){
      wx.showToast({
        title: '不可以关注自己',
        icon:'error'
      })
    }else{
      wx.cloud.database().collection('user_followed')
    .add({
      data:{
        img:this.data.user.photo,
        uid:this.data.user._openid,
        name:this.data.user.name
      }
    })
    .then(res=>{
      console.log(res)
      wx.showToast({
        title: '关注成功',
      })
      this.getfollowStatus()
    })
    }
    
  },
  onShow(){

  },
  getfollowStatus(){
    wx.cloud.database().collection('user_followed')
    .where({
      _openid:app.globalData.openid,
      uid:this.data.user._openid
    }).get()
    .then(res=>{
      if(res.data.length>0){
        this.setData({
          isfollowed:true
        })
      }else{
        this.setData({
          isfollowed:false
        })
      }
    })
  },
  cancelflo(e){
    wx.cloud.database().collection('user_followed')
    .where({
      _openid:app.globalData.openid,
      uid:this.data.user._openid
    }).get()
    .then(res=>{
      wx.cloud.database().collection('user_followed').doc(res.data[0]._id).remove()
      .then(result=>{
        this.getfollowStatus()
        wx.showToast({
          title: '取消关注',
        })
      })
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

  }
})