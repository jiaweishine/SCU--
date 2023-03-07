// pages/confirm/confirm.js
const app=getApp()
let user= app.globalData.userInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enrollment_years: ['2015','2016', '2017', '2019', '2020','2021','2022'],
    enrollment_year: '入学年份',
    years: ['八年','五年','四年','三年','两年','一年'],
    year: '年制',
    sIdCard:''
  },
  onShow(options){
   if(user.isChecked){
     wx.showToast({
       title: '您已成功认证',
     })
   }
  },
  bindPickerChange(e){
    this.setData({
      enrollment_year: this.data.enrollment_years[e.detail.value]
    })
  } ,
  bindTypeChange(e){
    this.setData({
      year: this.data.years[e.detail.value]
    })
  },
chooseSource:function () {
  console.log(11)
  let that = this
  wx.showLoading({
    title: '正在上传',
  });
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sizeType: ['original'], //可以指定是原图还是压缩图
    sourceType: ['album', 'camera'], //从相册选择
    success:chooseResult =>{
      console.log(chooseResult)
      let filePath = chooseResult.tempFiles[0].tempFilePath
      console.log(filePath)
      let suffix = /\.[^\.]+$/.exec(filePath)
      wx.cloud.uploadFile({
        filePath: filePath,
        cloudPath:  (new Date()).getTime()+Math.floor(9*Math.random())+".png",
        config:{
          env:this.data.envId
        }
      }).then(res=>{
        console.log(res);
        that.setData({
          sIdCard:res.fileID
        })
      })
    }
  })
  wx.hideLoading();
},
submit(e){
  wx.showLoading({
    title: '发布中...',
  })
  let db = wx.cloud.database()
  let enrollment_year = this.data.enrollment_year
  let year =this.data.year
  let sIdCard =this.data.sIdCard
  db.collection('user').doc(user._id).update({
    data:{
      enrollment_year : enrollment_year,
      year: year,
      sIdCard: sIdCard
    }
  })
  .then(res => {
    console.log('上传的结果', res)
    user.enrollment_year = enrollment_year
    user.year = year
    user.sIdCard = sIdCard
    // app._saveUserInfo(user_id)
    wx.hideLoading()
    wx.showToast({
        title: '上传成功',
    })
    
})
},
  quit(){
    console.log('点击了取消')
    this.setData({
      enrollment_year: '',
      year: [],
      sIdCard: []
    })
  }
})