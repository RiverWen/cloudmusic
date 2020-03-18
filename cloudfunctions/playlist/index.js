// 云函数入口文件
const lodash = require('lodash')
const axios = require('axios')
const cloud = require('wx-server-sdk')
cloud.init({
    env:'cloudmusic-ano5b'
})
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const URL = 'http://musicapi.xiecheng.live/personalized'
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
    let newPlaylist = await axios(URL)
    let playlist = newPlaylist.data.result
    let data = await getAllPlaylist()
    
    let whatsNew = lodash.dropWhile(playlist,function(o){
        return lodash.some(data,['id',o.id])
    })
    if(whatsNew.length){
        console.log(`${whatsNew.length}playlist has been found this time`)
        addData(whatsNew)
    }else{
        console.log('No new-playlist found this time')
    }
}

 function addData(data){
    const tasks = []
    for(let i=0; i< data.length; i++){
        let promise = playlistCollection.add({
            data:{
                ...data[i],
                createTime: db.serverDate()
            }
        })
        tasks.push(promise)
    }
    Promise.all(tasks)
    .then(res=>{console.log('playlist added, todays job is done')})
    .catch(err=>console.log(err))
}


async function getAllPlaylist(){
    let count = await playlistCollection.count()
    let total = count.total
    let batchTimes = Math.ceil(total / MAX_LIMIT)
    let tasks = []
    for(let i=0; i<batchTimes; i++){
        let promise = playlistCollection.skip(MAX_LIMIT * i).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    let list = {data:[]}
    if(tasks.length > 0){
        let res =await Promise.all(tasks)
        list = res.reduce((acc,cur)=>{
            return{
                data:acc.data.concat(cur.data)
            }
        })
    }
    return new Promise( (resolve,reject)=>{
        resolve(list.data)
    })
}