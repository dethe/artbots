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

var SLICES = 64;
var CANVAS_SLICE_WIDTH = window.innerWidth / SLICES;
var CANVAS_HEIGHT = window.innerHeight;
var VIDEO_SLICE_WIDTH;
var VIDEO_HEIGHT;
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
        VIDEO_SLICE_WIDTH = video.width / SLICES;
        VIDEO_HEIGHT = video.height;
        drawFrame();
    },function(err){
        console.log('an error occurred: %o', err);
    });
}
function drawFrame(){
    requestAnimationFrame(drawFrame);
    buffer.unshift(buffer.pop()); // move last frame to first
    var context = buffer[0].getContext('2d');
    context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < SLICES; i++){
        var src = buffer[i];
        ctx.drawImage(src, VIDEO_SLICE_WIDTH * i, 0, VIDEO_SLICE_WIDTH, VIDEO_HEIGHT,
                             CANVAS_SLICE_WIDTH * i, 0, CANVAS_SLICE_WIDTH, CANVAS_HEIGHT);
    }
}
startCamera();
