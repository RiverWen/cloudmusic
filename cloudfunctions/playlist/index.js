// 云函数入口文件
const lodash = require('lodash')
const axios = require('axios')
const cloud = require('wx-server-sdk')
cloud.init({
    env:'cloudmusic-ano5b'
})
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const PERPAGE = 10
const URL = 'http://musicapi.xiecheng.live/personalized'
const MAX_LIMIT = 5

// 云函数入口函数
exports.main = async (event, context) => {
    let playlist = await axios(URL)
    console.log(playlist.data.result)
    let data = await getPlaylistFromDb()
    console.log(data)

    // const arr = []
    // const write = playlistCollection.add({
    //     data:{
    //         nickname:'river9'
    //     }
    // })
    // arr.push(write)
    // await Promise.all(arr).then(res=>{console.log('bbbb')})

}
async function getPlaylistFromDb(){
    let count = await playlistCollection.count()
    let total = count.total
    let batchTimes = Math.ceil(total / MAX_LIMIT)
    let tasks = []
    for(let i=0; i<batchTimes; i++){
        let promise = playlistCollection.skip(MAX_LIMIT * i).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    let data
    if(tasks.length > 0){
        let res =await Promise.all(tasks)
        res.reduce((acc,cur)=>{
            data=acc.data.concat(cur.data)
        })
    }
    console.log(data)
    return new Promise( (resolve,reject)=>{
        console.log(data)
        resolve(data)
    })
    
}