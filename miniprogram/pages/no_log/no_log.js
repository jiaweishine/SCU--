// pages/no_log/no_log.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  handleGetUserInfo(e) {
    // console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx-wx.navigateBack({
      delta: 1
    })
  },
  login(){
    wx.getUserProfile({
      desc: '必须授权才可以使用',
      success: res => {
        let user = res.userInfo
        this.setData({
          userinfo: user
        })
        app.globalData.userInfo=user
        wx.setStorageSync('user', user)
        wx.cloud.database().collection('user').where({
         _openid:app.globalData.openid 
        }).get({
          success(res){
            console.log(res)
            if(res.data.length==0){
              wx.cloud.database().collection('user').add({
                data:{
                  photo:user.avatarUrl,
                  name:user.nickName,
                  isChecked:false,
                  islocked:false,
                  history:[],
                  school:'',
                },
                success(res){
                    console.log('注册成功',res)
                    wx.showToast({
                      title: '登录成功',
                    })
                }              
              })
            }else{
              this.setData({
                userinfo:res.data[0]
              })
            }
          }
        })
      },
      fail: res =>{
        console.log("授权失败",res)
      }
    })
  },
})