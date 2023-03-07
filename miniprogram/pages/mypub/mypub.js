// pages/mypub/mypub.js
const app=getApp()
let uid=app.globalData.openid
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow: function () {
    // var util = require("../../utils/time.js");
    // // var arr = 1551598000000;//这里是*1000的
    // var arr =1666962827358/1000;  //这里是没有*1000的 
    // console.log(util.js_date_time(arr))
    this.checkuser()
  },
  onLoad(options) {
    this.getgoodList()
},
getgoodList(){
    console.log(uid)
    let db=wx.cloud.database()
    const monica=db.command
    db.collection('shop_goods')
    .where({_openid:monica.eq(uid)})
    .get()
    .then(res=>{
      console.log('success',res)
      var util = require("../../utils/time.js");
      const alldatas = res.data
      for(let i=0;i<alldatas.length;i++){
        alldatas[i]['_createTime'] = util.js_date_time(alldatas[i]['_createTime']/1000)
        this.setData({
         alldata : alldatas
        })  
      }
      console.log('after',res)
      this.setData({
        goodlist:res.data,
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
toEdit(e){
  let id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/modify/modify?id='+id,
  })
},
checkuser(){
  let db=wx.cloud.database()
  var st="onsell"
  db.collection('user')
  .where({_openid:app.globalData.openid})
  .get()
  .then(res=>{
    console.log('success get the data 测试',res.data[0].islocked)
    if(res.data[0].islocked)
    {
      wx.showToast({
        title: '您已被锁定',
        icon:'error'
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../mine/mine',
        })
      },1000)
    }
  })
  .catch(err=>{
    console.log("error",err)
  })
},
Delete(e){
  var that=this
  wx.showModal({
    title: '提示',
    content: '确认要删除该订单吗?',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        let id = e.currentTarget.dataset.id
        let db = wx.cloud.database()
        db.collection('shop_goods').doc(id).remove({
          success(res){
            console.log("删除数据成功",res.data)
            that.getgoodList()
          },
          fail(res){
             console.log("删除失败",res.data)
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

  
}

})