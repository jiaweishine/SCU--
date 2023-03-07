// pages/goodList/goodList.js
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
  onLoad(options) {
    console.log(options.type)
    let db=wx.cloud.database()
    const monica=db.command
    db.collection('shop_goods')
    .where({type:options.type,
            state:'onsell'})
    .get()
    .then(res=>{
      console.log('success',res)
      this.setData({
        good:res.data
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
  getContent(e){
    content=e.detail.value
  },
  tosearch(e){
    // let content=e.
    wx.navigateTo({
      url: '../Search/Search?content=' + content,
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
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    //console.log("shuaxin");

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