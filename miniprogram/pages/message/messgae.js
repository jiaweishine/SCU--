// pages/message/messgae.js
const app = getApp()

Page({
    data: {
      
    },
    onLoad(options) {
      let user = app.globalData.userInfo 
      if (!user.isChecked) { 
        wx.showToast({ 
          icon: 'error', 
          title: '请先进行身份认证', 
        }) 
        setTimeout(() => { 
          wx.switchTab({ 
            url: '/pages/confirm/confirm', 
          }) 
        }, 1000); 
        return 
      } else{
        console.log(options.gid)
        let db=wx.cloud.database()
        // const monica=db.command
        db.collection('shop_goods')
        .doc(options.gid)
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
      }
        
      },
     
    toMessage(){
      wx.switchTab({
        url: '../messagelist/messagelist',
      })
      console.log('success')
    }

})