// app.js
App({
  onLaunch(){
      wx.cloud.init({
        env:'cloud1-0g7ygyp588b7d987',
        traceUser:true,
      })
    // 获取用户id
    var that = this;
    wx.cloud.callFunction({
      name:'getUserData',
      complete: res => {
        // 获取到用户的 openid
        console.log('云函数获取到的openid: ', res.result.openId);//注意这里的openId的'id'中的'i'是否大小写要根据你的res.result下数据的详情，有点要大写，有的不用。
        this.globalData.openid=res.result.openId
        wx.cloud.database().collection('user').where({
          _openid:res.result.openId
        }).get({
          success(rel){
            console.log(rel)
            that.globalData.userInfo=rel.data[0]
          }
        })
      }
    })
   
  },
    globalData: {
      userInfo:null,
      openid:null
    }
})
