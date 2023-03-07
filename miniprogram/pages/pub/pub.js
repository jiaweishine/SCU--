// pages/pub/pub.js
let app = getApp()
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areas: ['江安校区', '望江校区', '华西校区' ],
    area: '所属校区',
    types: ['book', 'clothes', 'makeup', 'digital', 'bycicle', 'bag', 'decoration', 'food', 'others'],
    type: '商品类型',
    cover: '',
    imgs: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
  },
  onLoad(){
    this.checkuser()
  },
  getgood_name(e){
    this.setData({
      name: e.detail.value
    })
  },
  getgood_price(e){
    this.setData({
      price: e.detail.value
    })
  },
  getgood_detail(e){
    this.setData({
      describe: e.detail.value
    })
  },
  bindSchoolChange(e) {
    this.setData({
      area: this.data.areas[e.detail.value]
    })
  },
  bindTypeChange(e) {
    this.setData({
      type: this.data.types[e.detail.value]
    })
  },
  ChooseImage:function () {
    let that = this
    wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['original'], //可以指定是原图还是压缩图
        sourceType: ['album', 'camera'], //从相册选择
        success:chooseResult =>{
          console.log(chooseResult)
          let filePath = chooseResult.tempFiles[0].tempFilePath
          console.log(filePath)
          wx.cloud.uploadFile({
            filePath: filePath,
            cloudPath:  (new Date()).getTime()+Math.floor(9*Math.random())+".png",
            config:{
              env:this.data.envId
            }
          }).then(res=>{
            console.log(res);
            that.setData({
              cover:res.fileID
            })
          })
        }
      })
      wx.hideLoading();
},
chooseImg:function () {
  let that = this
  wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sizeType: ['original'], //可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], //从相册选择
      success:chooseResult =>{
        console.log(chooseResult)
        let tempFiles = chooseResult.tempFiles
        var imgs = that.data.imgs;
        for(let i=0;i<tempFiles.length;i++){
        if (imgs.length >= 9) {
          that.setData({
           imgs: imgs
          });
          return false;
         } else {
          imgs.push(tempFiles[i].tempFilePath);
         }
        }
        // console.log(imgs);
        that.setData({
         imgs: imgs
        });
         const promiseArr = []
       //只能一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.imgs.length; i++){
          promiseArr.push(new Promise((reslove, reject) =>{
            wx.cloud.uploadFile({
              filePath:  this.data.imgs[i],
              cloudPath:  (new Date()).getTime()+Math.floor(9*Math.random())+".png"
            }).then(res=>{
              console.log("上传结果", res.fileID)
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              })
              reslove()
            }).catch(error => {
              console.log("上传失败", error)
            })
          }))
        }
      }
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
deleteImg: function (e) {
  var imgs = this.data.imgs;
  var index = e.currentTarget.dataset.index;
  imgs.splice(index, 1);
  this.setData({
   imgs: imgs
  });
 },
 // 预览图片
 previewImg: function (e) {
   //获取当前图片的下标
  var index = e.currentTarget.dataset.index;
   //所有图片
  var imgs = this.data.imgs;
  wx.previewImage({
   //当前显示图片
   current: imgs[index],
   //所有图片
   urls: imgs
  })
 },
 submit(e){
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
  } 
  let good = e.detail.value 
  if (good.area == '所属校区') { 
    wx.showToast({ 
      icon: "error", 
      title: '请选择所属校区' 
    }) 
    return 
  } 
  if (good.type == '商品类型') { 
    wx.showToast({ 
      icon: "error", 
      title: '请选择商品类型' 
    }) 
    return 
  } 
  if (!good.name) { 
    wx.showToast({ 
      icon: "error", 
      title: '请填写商品名' 
    }) 
    return 
  } 
  if (!good.price) { 
    wx.showToast({ 
      icon: "error", 
      title: '请填写价格' 
    }) 
    return 
  } 
  if (good.price <= 0) { 
    wx.showToast({ 
      icon: 'none', 
      title: '价格不能为0或负数' 
    }) 
    return 
  } 
  if (!good.describe||good.describe.length<6) { 
    wx.showToast({ 
      icon: "error", 
      title: '描述大于6个字' 
    }) 
    return 
  } 
  //图片相关 
  let imgs = this.data.imgs 
  if (!imgs || imgs.length < 1) { 
    wx.showToast({ 
      icon: "error", 
      title: '请选择详情图片' 
    }) 
    return 
  } 
  if (!this.data.cover) { 
    wx.showToast({ 
      icon: "error", 
      title: '请选择封面图片' 
    }) 
    return 
  } 
  wx.showLoading({
    title: '发布中...',
  })
  let db = wx.cloud.database()
  let shop_goods = e.detail.value


  db.collection('shop_goods').add({
    data:{
      area : shop_goods.area,
      type:  shop_goods.type,
      title: shop_goods.name,
      price: parseInt(shop_goods.price),
      _openid: user._openid,
      state: 'onsell',
      cover: this.data.cover,
      imgs: this.data.fileIDs,
      describe: shop_goods.describe,
       _createTime: new Date().getTime(),
       commentList :[],
       buyer:'',
       buytime:'',
    }
  })
  .then(res => {
    console.log('上传的结果', res)
    // app._saveUserInfo(user_id)
    wx.hideLoading()
    wx.showToast({
        title: '上传成功',
    })
    this.setData({
      name : '',
      price: '',
      area: '所属校区',
      type: '商品类型',
      describe:'',
      cover: '',
      imgs :[]
    })
})
}
})
