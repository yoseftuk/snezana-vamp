const IMG_URL = 'media/profile-regular.jpg';
const IMG_V_URL = 'media/profile-vampire-2.jpg';
const RADIUS = .22;
const RADIUS_OVER_1 = .031;
const RADIUS_OVER_2 = .022;
const canvas = document.querySelector('#profile');
const ctx = canvas.getContext('2d');
const freq1 = {
    value: 5,
    shift: 0,
    speed: .02,
    max: 7,
    min: 2,
};
const freq2 = {
    value: 7,
    shift: Math.PI/2,
    speed: -.01,
    max: 5,
    min: 1,
};
// let regularImgData = [];
// let vampireImgData = [];
let img = new Image();
let imgV = new Image();
let x = 0, y = 0;
img.onload = initImg;
// imgV.onload = initVampImg;
const cw = (percent=1) => canvas.width*percent;
const ch = (percent=1) => canvas.height*percent;
const distance = (x,y, x2, y2) => Math.sqrt((x-x2)**2+(y-y2)**2);
// const getXY = (i,w) => ({dy: ((i/4)/w)|0, dx: (i/4)%w});
let play = false;
window.addEventListener('resize', handleResize);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseleave', () => play = false);
canvas.addEventListener('mouseenter', () => {play = true; frame()});

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.drawImage(img, 0, 0, cw(), ch());
}
function initImg(){
    ctx.drawImage(img, 0, 0, cw(), ch());
//     regularImgData = [...ctx.getImageData(0,0,cw(),ch()).data];
}
// function initVampImg(){
//     const mc = document.createElement('canvas');
//     mc.width = cw();
//     mc.height = ch();
//     const mctx = mc.getContext('2d');
//     mctx.drawImage(imgV, 0, 0, cw(), ch());
//     vampireImgData = [...mctx.getImageData(0,0,cw(),ch()).data];
// }
function handleResize() {
    initCanvas();
    // initImg();
    // initVampImg();
}
function handleMove({offsetX,offsetY}) {x = offsetX;y = offsetY;}
function frame(lastTimestamp = new Date().getTime()) {
    if(!play) {
        return ctx.drawImage(img,0,0,cw(),ch());
    }
    // if(regularImgData?.length !== ch()*cw()*4) {initImg()}
    // if(vampireImgData?.length !== ch()*cw()*4) {initVampImg()}
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const d = (deg) => {
        return ch(RADIUS) + Math.sin((deg+freq1.shift)*freq1.value)*ch(RADIUS_OVER_1)+Math.cos((deg+freq2.shift)*freq2.value)*ch(RADIUS_OVER_2);
    };
    const deg = (dx, dy) => Math.atan2(dy-totalR, dx-totalR) + Math.PI;
    ctx.drawImage(img, 0,0, cw(), ch());
    const totalR = Math.round(ch(RADIUS+RADIUS_OVER_1+RADIUS_OVER_2));
    // const imageData = ctx.getImageData(x-totalR,y-totalR,totalR*2,totalR*2);
    // const data = imageData.data;
    // for(let i=0;i<data.length;i+=4) {
    //     const {dx, dy} = getXY(i, totalR*2);
    //     const idx = ((y-totalR+dy)*cw() + x-totalR+dx)*4;
    //     if(distance(totalR, totalR, dx, dy) > d(deg(dx, dy, totalR))) {
    //         // data[i] = regularImgData[idx];
    //         // data[i+1] = regularImgData[idx+1];
    //         // data[i+2] = regularImgData[idx+2];
    //     } else {
    //         data[i] = vampireImgData[idx];
    //         data[i+1] = vampireImgData[idx+1];
    //         data[i+2] = vampireImgData[idx+2];
    //     }
    // }
    // ctx.putImageData(imageData, x-totalR, y-totalR);
    ctx.beginPath();
    ctx.moveTo(x+d(0), y);
    for (let i=0;i<totalR*2*Math.PI;i++) {
        const θ = i/totalR;
        const r = d(θ);
        ctx.lineTo(x+r*Math.cos(θ), y+r*Math.sin(θ));
    }
    ctx.moveTo(x+d(0), y);
    ctx.clip();
    ctx.drawImage(imgV,0, 0, cw(), ch());
    ctx.closePath();
    const currentTimestamp = new Date().getTime();
    const dt = (currentTimestamp-lastTimestamp)/5000;
    freq1.shift+=dt*2;
    freq2.shift-=dt;

    requestAnimationFrame(()=>frame(currentTimestamp));
}
imgV.src=IMG_V_URL;
img.src=IMG_URL;
handleResize();
