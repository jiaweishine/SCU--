// pages/messagelist/messagelist.js
const app=getApp()
const TIM = require('../../TUIKit/lib/tim-wx-sdk')
import { genTestUserSig }  from '../../TUIKit/debug/GenerateTestUserSig'
import TIMUploadPlugin from '../../TUIKit/lib/tim-upload-plugin'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      userID: app.globalData.openid, //User ID
      SDKAPPID: 1400768010, // Your SDKAppID
      SECRETKEY: 'c42b92d5620c9c917f4dd2586aaff586034427b885ba60a976c07d51a81839b0', // Your secretKey
      EXPIRETIME: 604800,
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userSig = genTestUserSig(this.data.config).userSig 
    wx.$TUIKit = TIM.create({
        SDKAppID: this.data.config.SDKAPPID
    })
    wx.$chat_SDKAppID = this.data.config.SDKAPPID;
    wx.$chat_userID = this.data.config.userID;
    wx.$chat_userSig = userSig;
    wx.$TUIKitTIM = TIM;
    wx.$TUIKit.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });            
    wx.$TUIKit.login({
        userID: this.data.config.userID,
        userSig
    });
    wx.setStorage({
        key: 'currentUserID',
        data: [],
    });
    wx.$TUIKit.on(wx.$TUIKitTIM.EVENT.SDK_READY, this.onSDKReady,this);
  },

  onUnload() {
    wx.$TUIKit.off(wx.$TUIKitTIM.EVENT.SDK_READY, this.onSDKReady,this);
},
onSDKReady() {
    const TUIKit = this.selectComponent('#TUIKit');
    TUIKit.init();
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