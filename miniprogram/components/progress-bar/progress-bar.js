// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentTime = 0
let duration = 0
let isMoving = false
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        

    },

    /**
     * 组件的初始数据
     */
    data: {
        timePanel: {
            currentTime: '00:00',
            totalTime: '00:00'
        },
        movableDis: 0,
        progress: 0
    },
    lifetimes:{
        ready(){
            this._getMovableWidth()
            this._bindBGMEvent()
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event){
            if(event.detail.source == 'touch'){
                this.data.movableDis = event.detail.x
                this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
                isMoving = true
            }
        },
        
        onTouchEnd(){
            currentTime = Math.floor(this.data.progress / 100 * duration)
            let formatCurrentTime = this._formatTime(currentTime)
            this.setData({
                movableDis: this.data.movableDis,
                progress: this.data.progress,
                ['timePanel.currentTime']: `${formatCurrentTime.min}:${formatCurrentTime.sec}`
            })
            backgroundAudioManager.seek(currentTime)
        },
        _getMovableWidth(){
            const query = this.createSelectorQuery()
            query.select('.movable-area').boundingClientRect()
            query.select('.movable-view').boundingClientRect()
            query.exec(rect=>{
                 movableAreaWidth = rect[0].width
                 movableViewWidth = rect[1].width
            })
        },
        _bindBGMEvent(){
            backgroundAudioManager.onPlay(()=>{
                console.log('onPlay')
                isMoving = false
            })
            backgroundAudioManager.onPause(()=>{
                console.log('onPause')
            })
            backgroundAudioManager.onWaiting(()=>{
                console.log('onWaiting')
            })
            backgroundAudioManager.onCanplay(()=>{
                console.log('onCanplay')
                if(typeof backgroundAudioManager.duration != 'undefined'){
                    this._setTime()
                }else{
                    setTimeout(()=>{
                        this._setTime()
                    },1000)
                }
            })
            backgroundAudioManager.onTimeUpdate(()=>{
                if(!isMoving){
                    let currentT = Math.floor(backgroundAudioManager.currentTime)
                    if(currentT != currentTime){
                        currentTime = currentT
                        let formatCurrnetTime = this._formatTime(currentTime)
                        this.setData({
                            ['timePanel.currentTime']:`${formatCurrnetTime.min}:${formatCurrnetTime.sec}`,
                            movableDis:currentTime / duration * (movableAreaWidth - movableViewWidth),
                            progress: currentTime / duration * 100
                        })
                    }
                }
            })
            backgroundAudioManager.onEnded(()=>{
                console.log('onEnded')
                this.triggerEvent('musicEnd')
            })
            backgroundAudioManager.onError((err)=>{
                console.log(err.errMsg)
                console.log(err.errCode)
                wx.showToast({
                    title: '错误' + err.errCode,
                })
            })

        },
        _setTime(){
            duration = Math.floor(backgroundAudioManager.duration)
            let formatTime = this._formatTime(duration)
            this.setData({
                ['timePanel.totalTime']: `${formatTime.min}:${formatTime.sec}`
            })
        },
        
        _formatTime(time){
            let min = Math.floor(time / 60)
            min = this._addZero(min)
            let sec = Math.floor(time % 60)
            sec = this._addZero(sec)
            return {
                min,
                sec
            }
        },
        _addZero(num){
           return num < 10 ?'0'+num:num
        },
    }
})
