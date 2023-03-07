// pages/history/history.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.gethistorylist()
  },
  onShow(){
    this.gethistorylist()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  gethistorylist(){
    wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).get()
    .then(res=>{
      this.setData({
        history:res.data[0].History,
      }) 
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */

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
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
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