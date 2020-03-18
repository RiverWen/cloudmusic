let musiclist = {}
let nowPlayingIndex = -1
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        musicInfo:{},
        isPlaying: false,
        isLyric: false,
        lyric:'暂无歌词'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        nowPlayingIndex = options.index
        musiclist = wx.getStorageSync('musiclist')
        this._loadMusicDetail(nowPlayingIndex)
        
    },
    onLyric(){
        this.setData({
            isLyric: !this.data.isLyric
        })
    },
    _loadMusicDetail(index){
        backgroundAudioManager.stop()
        this.setData({
            musicInfo: musiclist[index],
            isPlaying: false
        })
        wx.setNavigationBarTitle({
            title: musiclist[index].name,
        })
        wx.showLoading({
            title: 'song loading...',
        })
        wx.cloud.callFunction({
            name: 'music',
            data: {
                songId: musiclist[index].id,
                $url: 'getSongUrl'
            }
        }).then(res => {
            wx.hideLoading()
            backgroundAudioManager.src = res.result.data[0].url
            backgroundAudioManager.title = musiclist[index].name
            backgroundAudioManager.coverImgUrl = musiclist[index].al.picUrl
            backgroundAudioManager.singer = musiclist[index].ar[0].name
            backgroundAudioManager.epname = musiclist[index].al.name
            this.setData({
                isPlaying:true
            })
        })
            console.log(musiclist[index].id)
        wx.cloud.callFunction({
            name: 'music',
            data: {
                $url: 'getLyric',
                musicid: musiclist[index].id
            }
        }).then(res=>{
            if (res.result.lrc.lyric){
                this.setData({
                    lyric: res.result.lrc.lyric
                })
            }
        })
    },

    onPause(){
        if(this.data.isPlaying){
            backgroundAudioManager.pause()
        }else{
            backgroundAudioManager.play()
        }
        this.setData({
            isPlaying: !this.data.isPlaying
        })
    },

    onPrev(){
        nowPlayingIndex--
        if(nowPlayingIndex < 0){
            nowPlayingIndex = musiclist.length - 1
        }
        this._loadMusicDetail(nowPlayingIndex)
    },
    onNext(){
        nowPlayingIndex++
        if (nowPlayingIndex > musiclist.length-1){
            nowPlayingIndex = 0
        }
        this._loadMusicDetail(nowPlayingIndex)
    }
})