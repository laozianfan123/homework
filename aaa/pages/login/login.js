// pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId:'',
    filmShow:false
  },
  //  确定账号登录
  makeSrue: function(e){
    var that=this
    var paramsData = {};
    paramsData.openid=this.data.openId;

    console.log(this.data.openId,1111)
    paramsData.loginid=e.detail.value.user;
    paramsData.boundno = e.detail.value.pas;
    var str = JSON.stringify(paramsData)
   
    wx.request({
      url: "http://172.17.9.31:8081/api/v1.0/pdalogin/updatePdaLogin",
      method:'POST',
      header:{
        "Content-Type": "application/json"
      },
      data: str,
      success: function (res) {
        // success

        console.log("返回数据为：" + res.data);
        console.log('submit success');
        that.setData({
          filmShow:false
        })
      },
      fail: function () {
        // fail
        console.log('submit fail');
      },
      complete: function () {
        // complete
        console.log('submit comlete');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 查看是否授权
    wx.getSetting({
      withCredentials: true,
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
    wx.login({
      success: function (res){
      var code = res.code
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx85c1adb52579bbb6&secret=e5e420b632ed05f4cb7196fc579d93ad&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

              that.setData({
              openId:res.data.openid
           })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
   bindGetUserInfo: function (e) {
    
    e.detail.userInfo
  }
})