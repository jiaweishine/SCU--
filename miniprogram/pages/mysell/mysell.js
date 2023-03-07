// pages/mysell/mysell.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(){
    this.getselllist()
  },
  onShow(){
    this.checkuser()
  },
  getselllist(){
    let db=wx.cloud.database()
    const _ = db.command
    db.collection('shop_goods')
    .where({
      _openid:app.globalData.openid,
      buyer:_.neq('')
    })
    .get()
    .then(res=>{
      console.log('success',res)
      var util = require("../../utils/time.js");
      const alldatas = res.data
      for(let i=0;i<alldatas.length;i++){
        alldatas[i]['_createTime'] = util.js_date_time(alldatas[i]['_createTime']/1000)
        alldatas[i].buytime = util.js_date_time(alldatas[i].buytime/1000)
        // console.log(alldatas[i].buytime)
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
  
  //点击已交付按钮
  confirmDeliver(e){
    var that=this
    let id=e.currentTarget.dataset.id
    console.log(id)
    wx.cloud.database().collection('shop_goods').doc(id).get({
      success(res){
        console.log('info:',res)
        wx.cloud.database().collection('shop_goods').doc(id).update({
          data:{
            sellerconfir:true
          },
          success(res){
            console.log(res)
            wx.showToast({
              title: '交付订单成功',
            })
            that.getselllist()
          }
        })
      }
  })
  },
  toGoodDetail(e){
    let id =e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
    //点击确认收货按钮
    deletesell(e){
      var that=this
      console.log(e.currentTarget.dataset.id)
      let id=e.currentTarget.dataset.id
        wx.cloud.database().collection('shop_goods').doc(id).get({
            success(res){
              console.log('info:',res)
              wx.cloud.database().collection('shop_goods').doc(id).update({
                data:{
                  buyer:'',
                  state:'onsell',
                  buytime:''
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '取消订单成功',
                  })
                  that.getselllist()
                }
              })
            }
        })
      }
})