// pages/mine/mine.js
const app=getApp()
var util = require("../../utils/GenerateTestUserSig.js");
// var UserID=app.globalData.openid
// var userSig=util.genTestUserSig(userid).userSig
// var name=app.globalData.name
// var photo=app.globalData.photo
// var url='https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=1400768010&identifier=administrator&usersig=eJwtjcsOgjAURP*lWwzeEqiFxB0mRokLJaLLxla5wWJT6jv*uw2wnDMnM19SFrvwoSzJSBQCmfQZpWodnrHHQmpssXNWuJsdhU42whiUJKMxwIxxoDA0DrXylLE05QnldKDqZdB6ziDmMJodXvz6urpPD28h6*DZJJ9tuc9ZlK*Q88VVUn3c*GtdBMuqpqc5*f0B9mI0Uw__&random=254559215&contenttype=json'
// var Request=
// {
//   "UserID": app.globalData.openid,
//   "Nick": app.globalData.userInfo.name,
//   "FaceUrl": app.globalData.userInfo.photo
// }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    name:''
  },
  onLoad(){
    this.addUser()
  },
  // gene(){
  //   console.log('usersig',util.genTestUserSig('administrator').userSig)
  // },
  addUser(){
    wx.request({
      url: 'https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=1400768010&identifier=administrator&usersig=eJwtzMsOgjAUBNB-6RaDl2eRxIXuBGOMsHIHaSGXBgptJQTjv0uA5ZyZzJfk98weuSIxcW0ghzUj453BClcuWIsdaqMKI9U*0EwUfY*MxI4PQMMIHNgagy1fNKRwigIfnE351KNa3AXqhbBPNdbL-XvM9TXSVlJ6xqplxofP053TQMisKZPXfJmax21IqTjCmfz*LE808Q__&random=606517872&contenttype=json',
      data:{
        UserID: app.globalData.openid,
        Nick: app.globalData.userInfo.name,
        FaceUrl: app.globalData.userInfo.photo
      },
      method: "POST",
      success (res) {
        // console.log( app.globalData.userInfo.name)
        console.log('成功添加',res.data)
      }
    })
  },
  deleteUser(){
    wx.request({
      url: 'https://console.tim.qq.com/v4/im_open_login_svc/account_delete?sdkappid=1400768010&identifier=administrator&usersig=eJwtzMsOgjAUBNB-6RaDl2eRxIXuBGOMsHIHaSGXBgptJQTjv0uA5ZyZzJfk98weuSIxcW0ghzUj453BClcuWIsdaqMKI9U*0EwUfY*MxI4PQMMIHNgagy1fNKRwigIfnE351KNa3AXqhbBPNdbL-XvM9TXSVlJ6xqplxofP053TQMisKZPXfJmax21IqTjCmfz*LE808Q__&random=3573595685&contenttype=json',
      data:{
        DeleteItem: [
          {
            "UserID": app.globalData.openid
          }
        ]
      },
      method: "POST",
      success (res) {
        // console.log( app.globalData.userInfo.name)
        console.log('成功删除',res.data)
      }
    })
  },
  loginOut(){
    this.setData({
      userinfo: ''
    })
  },
  
  onShow() {
    const userinfo=wx.getStorageSync("user");
    console.log('I got',userinfo)
    this.setData({userinfo:userinfo});
    this.getUserinfo()
  },
  getUserinfo(){
    wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).get().then(res=>{
      console.log('I got ',res)
      this.setData({
        user:res.data[0]
      })
    })
  },
  //跳转到历史浏览界面
  navigateToHis() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },
  //点击注销账号
  logoff() {
    var that = this
    wx.showModal({
      content: '是否要注销账号',
      success (res) {
        if (res.confirm) {
          wx.showToast({
            title: '感谢使用',
            icon:'none'
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '../no_log/no_log',
            },2000)
            
          })
          console.log('用户点击确定',app.globalData.openid)
          wx.cloud.database().collection('user').where({
            _openid:app.globalData.openid
          }).remove({
            success(rul){
              console.log('用户表已无此用户')
              wx.cloud.callFunction({
                name:'deleteGood',
                complete: res => {
                  console.log('删除成功了', res.result);
                }
              })
              console.log('用户商品清理完毕')
              that.deleteUser()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})