// pages/follow/follow.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getCollist(){
    wx.cloud.database().collection('user_followed')
    .where({
      _openid:app.globalData.openid,
    }).get()
    .then(res=>{
      console.log(res)
      this.setData({
        flolist:res.data
      })
    })
  },
  onShow(){
    this.getCollist()
  },
  toUserDetail(e) {
    console.log(e)
    let uid =e.currentTarget.dataset.id
    wx.navigateTo({
     url: '../user/user?uid='+uid,
    })
  }
})