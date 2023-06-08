// components/Swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})