const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// url:网络请求的url
// data:请求参数
// message:进度条的提示信息
const requestLoading = (url, data, message, token) => {
  return new Promise((resolve, reject) => {
    wx.showNavigationBarLoading();
    if (message != undefined) {
      wx.showLoading({
        title: message
      })
    } else {
        wx.showLoading({
          title: 'loading'
        })
    }

    var app = getApp();

    if (!token) {
      token = app.globalData.token
    }
    wx.request({
      url: 'https://zt2.cloud360.com.cn/mini-order-sorting/api/v1.0/'+url+'?ent_id=1600602444399414926',
      data,
      header: {
        'content-type':'application/json; charset=UTF-8'
      },
      method: 'POST',
      complete: (res) => {
  

        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (res.statusCode == 200) {
          if (res.data.return_code == 0) {
            resolve && resolve(res.data);
          } else if (res.data.return_code == 10000) {
            wx.showToast({
              title: res.data.return_msg || '网络异常',
              duration: 2000,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: "网络异常",
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  requestLoading: requestLoading
}
