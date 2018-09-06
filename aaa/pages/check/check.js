//index.js
//获取应用实例
const app = getApp();
const net = require("../../utils/util.js");

Page({
  data: {
    filterList: [{
      name: '全部',
      checked: true
    }, {
      name: '待拣货',
      checked: false
    }],
    orderList: [],
    num: 0
  },
  onLoad: function (options) {
    this.getOrderList();
  },
  onShow: function () {
  },
  getOrderList: function () {
    let that = this;
    let params = {};
    params.page_no = 1;
    params.page_size = 20;
    net.requestLoading('order/query', params).then(res => {
      console.log(res.data)
      this.setData({
        orderList: res.data && res.data.order || [],
        num: res.data.total_results
      })
    })
  }
})