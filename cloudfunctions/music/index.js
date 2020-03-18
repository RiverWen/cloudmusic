// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
    env: 'cloudmusic-ano5b'
})

const TcbRouter = require('tcb-router')
const Axios = require('axios')

const BASE_URL = "http://musicapi.xiecheng.live"

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({event})

    app.use(async (ctx,next)=>{
        ctx.data = {}
        await next()
    })

    app.router("playlist",async (ctx,next)=>{

    ctx.body = await cloud.database().collection('playlist').skip(event.start)
    .limit(event.count)
    .orderBy('createDate','desc')
    .get()
    .then(res=>{
        return res
    })

    })

    app.router("musiclist",async(ctx,next)=>{
        let url = BASE_URL + '/playlist/detail?id=' + event.playlistId
        ctx.body = await Axios(url).then(res=>{return res.data})
    })

    app.router("getSongUrl",async (ctx,next)=>{
        let url = BASE_URL + '/song/url?id=' + event.songId
        ctx.body = await Axios(url).then(res=>{ return res.data})
    })

    app.router("getLyric",async (ctx,next)=>{
        let url = BASE_URL + '/lyric?id=' + event.musicid
        ctx.body = await Axios(url).then(res=>{ return res.data})
    })

    return app.serve()
}