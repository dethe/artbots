var canvas = document.querySelector('canvas');
var video = document.querySelector('video');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
video.setAttribute('width', window.innerWidth);
video.setAttribute('height', window.innerHeight);
navigator.getMedia = ( navigator.getUserMedia ||
               navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia ||
               navigator.msGetUserMedia);
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
     window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
     window.requestAnimationFrame = requestAnimationFrame;

var SLICES = 32;
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;
var _vw = CANVAS_WIDTH / 2;
var _vr = CANVAS_HEIGHT / 2;
var MAX_RADIUS = Math.sqrt(_vw * _vw + _vr * _vr);
var CANVAS_SLICE_WIDTH = MAX_RADIUS / SLICES;
var FRAME = 0;
var buffer = [];
for (var i = 0; i < SLICES; i++){
    var c = document.createElement('canvas');
    c.setAttribute('width', window.innerWidth);
    c.setAttribute('height', window.innerHeight);
    buffer.push(c);
}

function startCamera(){
    var videoStream = navigator.getMedia({video:true}, function(stream) {
        if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
        } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
        drawFrame();
    },function(err){
        console.log('an error occurred: %o', err);
    });
}
function drawFrame(){
    requestAnimationFrame(drawFrame);
    buffer.unshift(buffer.pop()); // move last frame to first
    var context = buffer[0].getContext('2d');
    context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    for (var i = 0; i < SLICES; i++){
        var src = buffer[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(_vw, _vr, CANVAS_SLICE_WIDTH * (SLICES - i), 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(src, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.restore();
    }
    FRAME++;
}
startCamera();
