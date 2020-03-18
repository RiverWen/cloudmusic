// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      playlist:{
          type:Object
      }
  },

  observers: {
      ['playlist.playCount'](count){
          this.setData({
              _count:this._transNum(count,2)
          })
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      _count:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      gotoMusiclist: function () {
          wx.navigateTo({
              url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
          })
      },

      _transNum(num,point){
          let numStr = num.toFixed().toString()
          if(numStr.length < 4){
              return numStr
          }else if(numStr.length >=4 && numStr.length < 7){
             return (num / 1000).toFixed(point) + "k"
          }else if (numStr.length >= 7 && numStr.length < 10){
              return (num / 1000000).toFixed(point) + 'M'
          }else if (numStr >= 10){
              return (num / 1000000000).toFixed(point) + 'B'
          }
      }

  }
})
