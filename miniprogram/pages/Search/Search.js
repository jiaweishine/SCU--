// pages/Search/Search.js
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
    console.log(options.content)
    let db=wx.cloud.database()
    let _=db.command
    db.collection('shop_goods')
    .where(_.or([
      {
      title:db.RegExp({
        regexp:options.content,
        options:'i',
      })
    },
    {
      describe:db.RegExp({
        regexp:options.content,
        options:'i',
    })
  }
  ]).and([{
    state:'onsell'
  }])).get()
  .then(res=>{
    console.log('succsee',res)
    this.setData({
      searchList:res.data
    })
  })
  .catch(err=>{
    console.log('error',err)
  })

  },
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
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