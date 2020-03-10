// pages/demo/demo.js
const axios = require('axios')
const db = wx.cloud.database()
const playlistCollection = db.collection('playlist')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.digPlaylist()
    },

    async digPlaylist(){
        const requestUrl = 'http://musicapi.xiecheng.live/personalized'
        const dailyMusic = await this.getPlaylist_1()
        console.log(dailyMusic)
        // const data = dailyMusic?dailyMusic.data.result:[]
        // console.log(data)
        // playlistCollection.add({
        //     data: {
        //         ...data[0],
        //         nima: 'wo-qu-ni-de'
        //     }
        // }).then(res=>{console.log(res)})
    },

    getPlaylist(url){
        return new Promise((resolve,reject)=> wx.request({
            url,
            success(res){
                resolve(res)
            },
            fail(err){
                reject(err)
            }
            })
        )
    },
    getPlaylist_1(){
        return new Promise(async (resolve,reject)=>{
            let data = await playlistCollection.add({data:{'zhou':1000}})
            resolve(data)
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

    }
})