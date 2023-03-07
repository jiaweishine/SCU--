Page({
  onLoad(){
    wx.cloud.callFunction({
      name:'getData'
    })
    .then(res=>{
      console.log('chengg',res)
    })
    .catch(res=>{
      console.log('failed',res)
    })
    console.log('thank')
  }

  

})