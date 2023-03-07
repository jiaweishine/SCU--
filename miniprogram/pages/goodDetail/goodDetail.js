// pages/goodDetail/goodDetail.js
const app=getApp()
var uid=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    user:{},
    imgUrl:"../../imgs/collect0.png",
    good:'',
    placeHolder:'喜欢就多问问细节~',
    isCollected:false

  },

  /**
   * 商品对象
   */
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    this.setData({
      openid:app.globalData.openid
    })
    console.log(options)
    this.data.id=options.id
    this.getDetail()
    this.addhistory()
  },
  addhistory(){
    wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).get()
    .then(res=>{
      var action=res.data[0]
      wx.cloud.database().collection('shop_goods').doc(this.data.id).get()
      .then(resu=>{
        console.log(res)
        var hlist={}
        var flag=0
        var index
        for(var l in action.History){
          if(action.History[l]._id==resu.data._id){
            index=l
            flag=1
            break
          }
        }
        function sortBy(name,sort){
          console.log('name='+name+',sort='+sort);
          return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
              a = parseInt(o[name]);
              b = parseInt(p[name]);
              if (a === b) {
                return 0;
              }
              if(sort == 'asc'){
                if (typeof a === typeof b) {
                  return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
              }else{
                if (typeof a === typeof b) {
                  return a > b ? -1 : 1;
                }
                return typeof a > typeof b ? -1 : 1;
              }
            }
            else {
              throw ("error");
            }
          }
        }
        if(flag){
            res.data[0].History[index].time=Date.now()
            res.data[0].History=res.data[0].History.sort(sortBy("time","desc"))
            wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).update({
            data:{
              History:res.data[0].History
            }
          })
          
        }else{
          res.data[0].History=res.data[0].History.sort(sortBy("time","desc"))
          if(res.data[0].History.length<100){
            const _ = wx.cloud.database().command
            wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).update({
              data: {
                History: _.pop()
              }
            })
          }
          hlist._id=resu.data._id
          hlist.cover=resu.data.cover
          hlist.title=resu.data.title
          hlist.area=resu.data.area
          hlist.price=resu.data.price
          hlist.time=Date.now()
          res.data[0].History.push(hlist)
          res.data[0].History=res.data[0].History.sort(sortBy("time","desc"))
          wx.cloud.database().collection('user').where({_openid:app.globalData.openid}).update({
            data:{
              History:res.data[0].History
            }
          })
        }
      })
    })
  },
  onShow(){
    this.checkuser()
  },
  tocontact(){
    let gid=this.data.id
    wx.navigateTo({
      url: '../message/messgae?gid=' + gid,
    })
  },
  getDetail(){
    var that=this
    wx.cloud.database().collection('shop_goods').doc(this.data.id).get()
    .then(res=>{
      var action=res.data
      var util = require("../../utils/time.js");
      for(var l in action.commentList){
        action.commentList[l].time = util.js_date_time(action.commentList[l].time/1000)
      }
      console.log(res)
      this.setData({
        good:res.data,
        // uid:res.data._openid
      }) 
      uid=res.data._openid
      this.getUserInfo(uid)
      this.getCollectStatus()
    })
    .catch(err=>{
      console.log("error",err)
    })
  },
  cloacion(){
    wx.cloud.database().collection('shop_collects')
    .add({
      data:{
        img:this.data.good.cover,
        id:this.data.good._id,
        title:this.data.good.title,
        area:this.data.good.area,
        price:this.data.good.price
      }
    })
    .then(res=>{
      console.log(res)
      wx.showToast({
        title: '收藏成功',
      })
      this.getCollectStatus()
    })
  },
  getCollectStatus(){
    wx.cloud.database().collection('shop_collects')
    .where({
      _openid:app.globalData.openid,
      id:this.data.good._id
    }).get()
    .then(res=>{
      if(res.data.length>0){
        this.setData({
          isCollected:true
        })
      }else{
        this.setData({
          isCollected:false
        })
      }
    })
  },
  cancelcoll(e){
    wx.cloud.database().collection('shop_collects')
    .where({
      _openid:app.globalData.openid,
      id:this.data.good._id
    }).get()
    .then(res=>{
      wx.cloud.database().collection('shop_collects').doc(res.data[0]._id).remove()
      .then(result=>{
        this.getCollectStatus()
        wx.showToast({
          title: '取消收藏',
        })
      })
    })
  },
  getUserInfo(uid) {
      let db=wx.cloud.database()
      console.log('useriinfo的uid是',uid)
      const monica=db.command
      db.collection('user')
      .where({_openid:uid})
      .get()
      .then(obj=>{
        this.setData({
          user:obj.data[0]
        })
        console.log('user infoooooo',obj)
      })
      .catch(err=>{
        console.log("error",err)
      })
  },
  toSeller(e){
    console.log(e.currentTarget.dataset)
    uid =e.currentTarget.dataset.uid
    // console('detail',uid)
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid,
    })
  },
  getContent(e){
    // console.log(e.detail.value)
    this.data.content=e.detail.value
  },
  publishComment(){
    var that=this;
    if(app.globalData.userInfo==null){
      wx.navigateTo({
        url: '../no_log/no_log',
      })
    }else{
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
        console.log(this.data.id)
        // console.log('userinfo',app.globalData.userInfo)
        var that = this;
        wx.cloud.database().collection('shop_goods').doc(that.data.id).get({
          success(res){
            console.log(res)
            var action=res.data
            var comment={}
            comment.nickname=app.globalData.userInfo.name
            comment.openid=app.globalData.openid
            comment.text=that.data.content
            comment.time=Date.now()
            comment.toOpenid=that.data.toOpenid
            comment.tonickname=that.data.tonickname
            action.commentList.push(comment)
            console.log('comment is:',comment)
            wx.cloud.database().collection('shop_goods').doc(that.data.id).update({
              data:{
                commentList:action.commentList
              },
              success(res){
                console.log('yes i did it',res)
                wx.showToast({
                  title: '评论成功',
                })
                that.getDetail()
                that.setData({
                  inputvalue:'',
                  placeHolder:'喜欢就多问问细节~'
                })
              }
            })
          }
        })
      }
      
    }
  },
  deleteComment(e){
    var that=this;
    console.log(e.currentTarget.dataset.index)
    wx.showModal({
      title:'提示',
      content:'确定要删除本条评论吗？',
      success(res){
        if(res.confirm){
          var index=e.currentTarget.dataset.index
          wx.cloud.database().collection('shop_goods').doc(that.data.id).get({
            success(res){
              console.log(res)
              var action=res.data
              action.commentList.splice(index,1)
              wx.cloud.database().collection('shop_goods').doc(that.data.id).update({
                data:{
                  commentList:action.commentList
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  that.getDetail()
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
  },
  replyComment(e){
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
   // console.log(e.currentTarget.dataset.index)
   var index=e.currentTarget.dataset.index
   // console.log(this.data.good.commentList[index].nickname)
   this.setData({
     placeHolder:'回复'+this.data.good.commentList[index].nickname,
     toOpenid:this.data.good.commentList[index].openid,
     tonickname:this.data.good.commentList[index].nickname
   })
    }
 
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
  buy(){
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
      console.log(this.data.good)
      if(this.data.good._openid==app.globalData.openid){
        wx.showToast({
          title: '不可以买自己的商品',
          icon:'none'
        })
      }else if(this.data.good.state=='selling'){
        wx.showToast({
          title: '该商品已被购买',
          icon:'none'
        })
      }
      else{
        var that = this;
        wx.cloud.database().collection('shop_goods').doc(that.data.id).get({
            success(res){
              console.log('info:',res)
              // var action=res.data
              // var buyer=app.globalData.openid
              // action.buyer.set(buyer)
              // action.state.set('selling')
              wx.cloud.database().collection('shop_goods').doc(that.data.id).update({
                data:{
                  buyer:app.globalData.openid,
                  state:'selling',
                  buytime:Date.now(),
                  sellerconfir:false
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '下单成功',
                  })
                  that.getDetail()
                }
              })
            }
        })
      }
    }

  },
  //轮播图高度自适应
  imgH:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　　　　     //图片高度
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw + "px"　　　　　　　　　　     //等比设置swiper的高度。  
    this.setData({
        height:swiperH　　　　　　　　                             //设置高度
    })
  }
})