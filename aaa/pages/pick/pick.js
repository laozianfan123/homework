// pages/pick.js
const net = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: '',
    orderDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      oid: options.oid
    })
    this.getOrderDetail(options.oid)
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
  scanCode: function (e) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              console.log(res)
              let odid = '';
              let arr = [];
              arr = that.data.orderDetail.detail.map((item,index) => {
                if(item.barcode === res.result){
                  odid = item.odid
                }
                return item
              })
              if (arr.length >0) { 
                net.requestLoading('sorting', { odid }).then(res => {
                  wx.showToast({
                    title: '拣货成功',
                    duration: 2000,
                  })
                  that.getOrderDetail(that.data.oid)
                })
              } else {
                wx.showToast({
                  title: '请仔细核对商品',
                  duration: 2000,
                  icon: 'none'
                })
              }
            }, fail(res) {
              if (res.errMsg == "scanCode:fail") {
                wx.showToast({
                  title: '查询失败',
                  duration: 2000,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  getOrderDetail: function (oid) {
    let that = this;
    net.requestLoading('order/all/query', { oid }).then(res => {
      console.log(res)
      this.setData({
        orderDetail: res.data
      })
    })
  },
  allSorted: function(){
    net.requestLoading('/order/sorted', {oid: this.data.oid}).then((res) => {
      wx.showToast({
        title: '该订单拣货完毕',
      })
      // wx.navigateBack({
      //   delta: 1
      // })
    })
  }
})