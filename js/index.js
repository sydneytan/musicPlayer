// 先做数据逻辑，再做界面逻辑，最后做事件逻辑
/**
 * 解析歌词字符串
 * 得到一个歌词对象数组
 * 每个歌词对象：
 *  { time:开始时间 , words: 歌词内容}
 */
function parseLrc(){
    let lines = lrc.split('\n');
    let result = []; // 歌词对象数组
    for(let item of lines){
        let parts = item.split(']'); 
        let timeStr = parts[0].substring(1);
        let obj = {
            time: parseTime(timeStr),
            words: parts[1],
        }
        result.push(obj);
    }
    return result;
}
/**
 * 将一个时间字符串解析为数字（秒）
 * @param {*} timeStr  时间字符串
 * @returns 时间数字
 */
function parseTime(timeStr){
    let parts = timeStr.split(':');
    let res = +parts[0]*60+ +parts[1];
    return res;
}

// 得到歌词对象
 const lrcData = parseLrc();

// 获取需要的 dom
 const doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
 }
 /**
  * 计算出，在当前播放器播放到第几秒的情况下
  * lrcData 数组中，应该高亮显示的歌词下标
  * 如果没有任何一个歌词显示，则返回 -1
  */
 function findIndex() {
    let curTime = doms.audio.currentTime;// 播放器当前时间
    for(let i=0;i<lrcData.length;i++){
        if(curTime<lrcData[i].time){
            return i - 1;
        }
    }
    // 找遍了都没找到 （说明播放到最后一秒了）展示最后一句
    return lrcData.length-1;
 }

 // 界面
 /**
  * 创建歌词元素 li
  */
 function createLrcElements(){
    let frag = document.createDocumentFragment();  // 文档片段，与 DOM 树脱离，无关联
    for(let item of lrcData){
        let li = document.createElement('li');
        li.textContent = item.words;
        //doms.ul.appendChild(li); // 每一次创建 li 都要改动一次 dom ，触发reflow
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
 }

 createLrcElements();

let containerHeight = doms.container.clientHeight; // 容器高度
let liHeight = doms.ul.children[0].clientHeight; // 每个 li 的高度
let maxOffset = doms.ul.clientHeight - containerHeight; // 最大偏移量

 /**
  * 设置 ul 元素的偏移量
  */
 function setOffset() {
    let index = findIndex(); // 当前 第几个 li 要在正中间
    let offset = liHeight * index + liHeight/2 - containerHeight/2;
    if(offset<0){
        offset = 0;
    }
    if(offset>maxOffset){
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    
    // 去掉之前的 active 样式
    let oldActiveLi = doms.ul.querySelector('.active');
    if(oldActiveLi){
        oldActiveLi.classList.remove('active');
    }
    let activeLi = doms.ul.children[index];
    if(activeLi){
        activeLi.classList.add('active')
    }
 }

 doms.audio.addEventListener('timeupdate',setOffset);