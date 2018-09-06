//index.js
//获取应用实例
const app = getApp();
const net = require("../../utils/util.js");

Page({
  data: {
    waitShow:false,
    picShow:false,
    changeList:true,
    orderColor:"red",
    shopColor:"white",
    xuan:false,
    achJdg:[],
    ze:1,
    achNum:-1,
    achShow:false,
    deList:true,
    filmShow:false,
    filterList: [{
      name: '待拣货',
      checked: true,
      sort_status: '0',
      num: 3
      }, {
        name: '拣货中',
        checked: false,
        sort_status: '1',
        num: 2
    },{
      name: '已拣货',
      checked: false,
      sort_status: '2',
      num: 0
      }],
    orderList: [],
    nuo:'',
    waitCheck:[
      {item:1,checked:'false'},
      { item: 2, checked: 'false' },
      { item: 3, checked: 'false' }
    ]
  },
  onLoad: function(options){
    this.getOrderCount()
  
      var that = this
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
        success: function (res) {
          var code = res.code
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx85c1adb52579bbb6&secret=e5e420b632ed05f4cb7196fc579d93ad&js_code=' + code + '&grant_type=authorization_code',
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                openId: res.data.openid
              })
            

              wx.request({
                url: "http://172.17.9.31:8081/api/v1.0/task/getPickupTask",
                method:'POST',
                data:{openid:res.data.openid},
                header: {
                  "content-type": "application/json"
                },
                success:function(rs){
                  console.log(rs,33333)
                }
              })

            }

          })
        }
      })
    
  },
  selectOrder:function(){
    this.setData({
      orderColor:'red',
      shopColor:'white',
      changeList:true
    })

  },
  selectShop: function () {
    this.setData({
      orderColor: 'white',
      shopColor: 'red',
      changeList:false

    })
  },
  changeList:function(){

  },
  changeFilter: function (e) {
 
    let that = this;
    let arr = this.data.filterList;
    arr.forEach((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        item.checked = true;
        this.setData({nuo:e.currentTarget.dataset.index})
        that.getOrderList(that.data.filterList[index].sort_status)
        
      } else {
        
        item.checked = false;
      }
    });

    this.setData({
      filterList: arr
    })
    console.log(this.data.nuo)
  },
  onShow: function(){
    this.getOrderList('0');
  },
  trick:function(){
    this.setData({
      filmShow:true
    })
  },
  scl:function(e){
  
  },
  getOrderList: function (sort_status) {
    let that = this;
    let params = {};
    params.page_no = 1;
    params.page_size = 20;
    params.sort_status = sort_status;
    net.requestLoading('order/query', params).then(res => {
      console.log(res, 7777777)
      var lon = res.data.order.map(()=>{
        return false
      })
      this.setData({
        achJdg:lon
      })
      this.setData({
        
        orderList: res.data && res.data.order || [],
        num: res.data.total_results
      })
    })
  },
  deleteList:function(){
    console.log(123123)
    if(this.data.xuan==true){
      this.setData({
        deList:false
      })
    }
  },
  photoShow:function(){
    this.setData({
      picShow:true
    })
  },
  cancleFilm:function(){
    this.setData({
      filmShow:false
    })
  },
  photoHidden:function(){
    this.setData({
      picShow:false
    })
  },
  maxPhoto:function(){
  },
  pullList:function(e){
    var jdg=this.data.achJdg
    if (jdg[e.target.dataset.index] == false){
      jdg[e.target.dataset.index]=true
    }else{
      jdg[e.target.dataset.index] = false
    }
      this.setData({
      achJdg : jdg
      })
   
  },
 tink(e){
   
 
   e.currentTarget.dataset.judge=true
 },
  bindSelectAll:function(e){
    console.log(this.data.xuan,222)
    if(this.data.ze==0){
    this.setData({ xuan: false,ze:1})}else{
      this.setData({ xuan: true, ze: 0 })
    }
    
  },
  saoMa(){
    wx.scanCode({
      
    })


  },
  getOrderCount: function(){
    let that = this;
    let filter = that.data.filterList
    net.requestLoading('order/count/query').then(res => {
      filter.map((item,index) => {
        if (item.sort_status == '0'){
          filter[index].num = res.data.count_unsort
        } else if (item.sort_status == '1'){
          filter[index].num = res.data.count_sorting
        }else{
          filter[index].num = res.data.count_sorted
        }
      })
      that.setData({
        filterList: filter
      })
    })
  }
})