// pages/edit/edit.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */

    onLoad() {
    var user = app.globalData.userInfo
    console.log('user', user)
    console.log('user.name', user.name)
    if (user && user.name) {
        this.setData({
            user: user,
            name: user.name,
            school: user.school
        })
    }
  },
  getName(e) {
    this.setData({
        name: e.detail.value
    })
 },
 getSchool(e) {
  this.setData({
      school: e.detail.value
  })
},
 submit(e) {
  let user = this.data.user
  let school = this.data.school
  let name = this.data.name
  if (school == user.school && name == user.name) {
      console.log('校区姓名都没有改变')
  } else if ( school == user.school&& name != user.name) {
      console.log('只改变姓名')
      db.collection('user').doc(user._id).update({
          data: {
              name: name
          }
      }).then(res => {
          console.log('修改姓名的结果', res)
          user.name = name
          // app._saveUserInfo(user)
          wx.showToast({
              title: '修改成功',
          })
      })
  } else {
    console.log('改变校区和姓名')
         db.collection('user').doc(user._id).update({
              data: {
                  name: name,
                  school: school
              }
          }).then(res => {
              console.log('修改姓名和头像的结果', res)
              user.name = name
              user.school = school
              // app._saveUserInfo(user)
              wx.showToast({
                  title: '修改成功',
              })
          })
            .catch(error => {
              console.log("上传失败", error)
      })
  }
},

  
})