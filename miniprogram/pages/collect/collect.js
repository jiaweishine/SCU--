// pages/collect/collect.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCollist()
  },
  getCollist(){
    wx.cloud.database().collection('shop_collects')
    .where({
      _openid:app.globalData.openid,
    }).get()
    .then(res=>{
      console.log(res)
      this.setData({
        collist:res.data
      })
    })
  },
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})