let canvas = document.querySelector('canvas');
let ctx    = canvas.getContext('2d');
let cW = canvas.width = 700;
let cH = canvas.height = 525;
window.addEventListener("keypress", checkInput, false);
var startup = false;
var gravity = -7;
var birdURL = canvas.toDataURL(document.getElementById('bird'));
var running = false;
var avg = parseInt(localStorage.getItem("average"));

var average = [];
for (var i = 1; i <= localStorage.getItem("average.length"); i++) {
    average.push(parseInt(avg));
}

var highscores = {
    "top1": [localStorage.getItem("top1name"),localStorage.getItem("top1")],
    "top2": localStorage.getItem("top2"),
    "top3": localStorage.getItem("top3"),
    "top4": localStorage.getItem("top4"),
    "top5": localStorage.getItem("top5"),
    "top6": localStorage.getItem("top6"),
    "top7": localStorage.getItem("top7"),
    "top8": localStorage.getItem("top8"),
    "top9": localStorage.getItem("top9"),
    "top10": localStorage.getItem("top10"),
    "top11": localStorage.getItem("top11"),
    "top12": localStorage.getItem("top12"),
    "top13": localStorage.getItem("top13"),
    "top14": localStorage.getItem("top14"),
    "top15": localStorage.getItem("top15"),
};

displayHighscore();
clearScreen();

if (localStorage.length < 30) {
    for (var i = 1; i <= 15; i++) {
        localStorage.setItem("top" + String(i), 0);
        localStorage.setItem("top" + String(i) + "name", "unset");
    }
    localStorage.setItem("average", 0);
    localStorage.setItem("average.length", 0);
    avg = 0;    
}
document.getElementById('average').innerHTML = "Average score: " + (avg/average.length).toFixed(2);

function getReady() {
    bird.init();
    pipe.init(80, 120, 1.5);
}

function init() {
    running = true;
    getReady();
    play();
    pipeMove = setInterval(function() {
        if (bird.x > pipe.x + pipe.width) {
            document.getElementById('sfx_point').play();
            bird.score = pipe.wave;
            setTimeout(function() {
                document.getElementById('sfx_point').currentTime = 0;
                document.getElementById('sfx_point').pause();
            }, 900);
        }
        if (pipe.x <= -pipe.width) {
            pipe.x = cW;
            pipe.y = Math.random() * (cH-pipe.gap*1.5);
            if (pipe.y < 150) {
                pipe.y = 150;
            }
            pipe.wave++;
        }
        pipe.x -= pipe.speed;
    }, 1);
}

function clearScreen() {
    ctx.drawImage(document.getElementById('bg'), 0, 0, cW, cH, 0, 0, cW, cH);
}

function Pipe() {
    this.init = function(width = 80, gap = 120, speed = 2) {
        this.width = width;
        this.gap = gap;
        this.y = Math.random() * (cH - this.gap*1.5);
        if (this.y < 150) {
            this.y = 150;
        }
        this.x = 800;
        this.wave = 1;
        this.speed = speed;
    },

    this.draw = function() {
        ctx.drawImage(document.getElementById('toppipe'), this.x, -50, this.width, this.y+50);
        ctx.drawImage(document.getElementById('botpipe'), this.x, this.y + this.gap, this.width, cH-this.y);
    }
}

function Bird() {
    this.init = function() {
        this.w = 51;
        this.h = 36;
        this.x = cW*0.4 - this.w;
        this.gravity = -3;
        this.y = cH/2;
        this.score = 0;
        this.alive = true;
    },

    this.up = function(gravity) {
        this.gravity = gravity;
    },

    this.draw = function() {
        ctx.drawImage(document.getElementById('bird'), this.x, this.y);
    },

    this.update = function() {
        this.y += this.gravity;
        this.gravity += 0.5;

        if (this.y + this.h > cH) {
            this.y = cH - this.h;
            this.gravity -= 0.4;
        }

        if (this.y < pipe.y || this.y + this.h > pipe.y + pipe.gap) {
            if (this.x > pipe.x && this.x < pipe.x + pipe.w) {
                document.getElementById('sfx_hit').play();
                this.alive = false;
            } else if (this.x + this.w > pipe.x && this.x + this.w < pipe.x + pipe.width) {
                document.getElementById('sfx_hit').play();
                this.alive = false;
            }
        }
        if (this.y > 450) {
            document.getElementById('sfx_hit').play();
            this.alive = false;
        }
        clearScreen();
        this.draw();
    }
}
var bird = new Bird();
var pipe = new Pipe();
prepareGamestart();
function prepareGamestart() {
    ctx.drawImage(document.getElementById('bird'), cW*0.4 - 51, cH/2);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press SPACE to start!", cW/2 - ctx.measureText("Press SPACE to start!").width/2, 100);
}
function checkInput(key) {
    if (key.keyCode == 32 && running) {
        bird.up(gravity);
        bird.update();
        document.getElementById('sfx_wing').currentTime = 0;
        document.getElementById('sfx_wing').pause();
        document.getElementById('sfx_wing').play();
    } else if (key.keyCode == 32 && !running) {
        init();
    }
}

var pipeMove;

function play() {
    bird.update();
    pipe.draw();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + bird.score, cW/2 - ctx.measureText("Score: " + bird.score).width/2, 100);
    if (bird.alive == true) {
        requestAnimationFrame(play);
    } else {
        if (bird.score > 0) {
            average.push(bird.score);
            avg += bird.score;
            localStorage.setItem("average", avg);
            localStorage.setItem("average.length", average.length);
            document.getElementById('average').innerHTML = "Average score: " + (avg/average.length).toFixed(2);
        }
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Your score: " + bird.score, cW/2 - ctx.measureText("Your score: " + bird.score).width/2, cH/2);
        clearInterval(pipeMove);
        newHighscore();
        running = false;
    }
}

function newHighscore() {
    for (var i = 1; i <= 15; i++) {
        var current = localStorage.getItem("top" + String(i));
        if (bird.score > current) {
            running = false;
            var name = prompt("Please enter your name (Max 15 characters)\n"
                            + "Or press enter to save with previous name");
            console.log(name);
                for (var j = 15; j > i; j--) {
                    localStorage.setItem("top" + String(j), localStorage.getItem("top" + String(j-1)));
                    localStorage.setItem("top" + String(j) + "name", localStorage.getItem("top" + String(j-1) + "name"));
                }
            localStorage.setItem("top" + String(i), bird.score);
            if (name == null) {
                document.location.reload();
            }
            if (name.length > 15) {
                name = name.substring(14, name.length);
            } else if (name != null) {
                localStorage.setItem("top" + String(i) + "name", name);
            }
            displayHighscore();
            return;
        }
        for (var l = 0; l < current.length; l++) {
            if (parseInt(current.slice(l)) != NaN) {
                current = parseInt(current.slice(l));
                l = 1000;
            }
        }
    }
}

function displayHighscore() {
    for (var i = 1; i <= 15; i++) {
        var currentt = String("top" + i);
        document.getElementById(currentt).innerHTML = String(localStorage.getItem(currentt + "name")) + ": " + String(localStorage.getItem(currentt));
    }
}
