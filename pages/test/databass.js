Page({
  /**
   * 页面的初始数据
   */
  data: {
    //新增数据变量
    username: "",
    userphone: "",
    companyname: "",
    companyid: "",
    //查询数据变量
    cxusername: "",
    cxuserphone: "",
    cxcompanyname: "",
    cxcompanyid: "",
    array: [],
    //删除数据变量
    nameDelete: "",
    //修改数据变量
    updateID: "",
    updateValue: "",
    updatePhone: ""
  },

  // 新增事件变量赋值
  bvUserName(e) {
    console.log(e.detail)
    this.setData({
      username: e.detail.value
    })
  },
  bvUserPhone(e) {
    console.log(e.detail)
    this.setData({
      userphone: Number(e.detail.value)
    })
  },
  bvCompanyName(e) {
    console.log(e.detail)
    this.setData({
      companyname: e.detail.value
    })
  },
  bvCompanyId(e) {
    console.log(e.detail)
    this.setData({
      companyid: e.detail.value
    })
  },

  //查询事件变量赋值
  cxUserName(e) {
    console.log(e.detail)
    this.setData({
      cxusername: e.detail.value
    })
  },
  cxUserPhone(e) {
    console.log(e.detail)
    this.setData({
      cxuserphone: Number(e.detail.value)
    })
  },
  cxCompanyName(e) {
    console.log(e.detail)
    this.setData({
      cxcompanyname: e.detail.value
    })
  },
  cxCompanyId(e) {
    console.log(e.detail)
    this.setData({
      cxcompanyid: e.detail.value
    })
  },
  // 异步新增数据方法
  async addData() {
    // 获取数据库引用
    const db = wx.cloud.database()
    // 新增数据
    await db.collection("USER").add({
      data: {
        usertype: this.data.items,
        UserName: this.data.username,
        UserPhone: this.data.userphone,
        CompanyName: this.data.companyname,
        CompanyId: this.data.companyid
      }
    }).then(this.setData({
      result: "写入数据成功."
    }))
  },
  // 异步读取数据方法
  async loadData() {
    this.setData({
      result: "正在读取数据."
    })
    // 获取数据库引用
    const db = wx.cloud.database()
    // 读取记录数数据
    await db.collection('USER').count().then(
      res => {
        this.setData({
          result: "云数据共有数据 " + res.total + " 条."
        })
      }
    )
    await db.collection("USER").where({
      type: 1
    }).get().then(
      res => {
        console.log(res)
      }
    )
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('USER').where({
      UserId: app.globalData.Guserid,
      UserName: this.data.cxusername,
      //UserPhone: this.data.cxuserphone,
      //CompanyName: this.data.cxcompanyname,
      //CompanyId: this.data.cxcompanyid
    }).get({
      success: res => {
        console.log(res);
        this.setData({
          // 值渲染
          queryResult: JSON.stringify(res.data, null, 2),
          // 列表渲染
          array:res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //删除数据赋值
  delDataInputName(e) {
    console.log(e.detail)
    this.setData({
      nameDelete: e.detail.value
    })

  },

  delDataByProperty() {
    console.log('调用属性删除数据的方法')
    const db = wx.cloud.database()
    db.collection('USERINFO').where({
      UserName: this.data.nameDelete
    }).remove({
      success: res => {
        console.log('删除数据成功', res.data) 
      },
      fail: res => {
        console.log("删除数据失败", res)
      }
    })
  },
  //修改数据变量赋值
  updateID(event) {
    console.log(event.detail.value)
    this.setData({
      updateID: event.detail.value
    })
  },
  updateValue(event) {
    console.log(event.detail.value)
    this.setData({
      updateValue: event.detail.value
    })
  },
  updatePhone(event) {
    console.log(event.detail.value)
    this.setData({
      updatePhone: event.detail.value
    })
  },
  //修改数据操作
  updateData() {
    console.log('调用修改更新数据的方法')
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserName: this.data.updateValue
    }).update({
      data: {
        UserPhone: this.data.updatePhone
      },
      success: res => {
        console.log('修改更新数据成功', res.data)
      },
      fail: res => {
        console.log("修改更新数据失败", res)
      }
    })
  },
  deleteClick() {
    console.log('调用ID删除数据的方法')
    const db = wx.cloud.database()
    db.collection('USERINFO').where(
      {_id: "{{item._id}}"}).remove({
      success: res => {
        console.log('{{item._id}}', res.data) 
        console.log('删除数据成功', res.data) 
      },
      fail: res => {
        console.log("删除数据失败", res)
      }
    })
  },
})