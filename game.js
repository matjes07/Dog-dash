const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dogImg = new Image();
dogImg.src = 'assets/dog.png';
const catImg = new Image();
catImg.src = 'assets/cat.png';

let score = 0, level = 1;
let player = { x:50, y:canvas.height-150, w:80, h:80, vy:0, onGround:true, lives:1, canDoubleJump:false };
let keys = {}, enemies = [], powerups = [], spawnTimer = 0;

document.addEventListener('keydown', e=> keys[e.code]=true);
document.addEventListener('keyup', e=> keys[e.code]=false);
canvas.addEventListener('touchstart', e=> keys['ArrowUp']=true);
canvas.addEventListener('touchend', e=> keys['ArrowUp']=false);

function gameLoop(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle='green';
  ctx.fillRect(0, canvas.height-50, canvas.width, 50);

  if((keys['ArrowUp']||keys['KeyW'])&&(player.onGround||player.canDoubleJump)){
    player.vy = -14;
    if(!player.onGround) player.canDoubleJump = false;
    player.onGround = false;
  }
  if(keys['ArrowDown']||keys['KeyS']) player.y += 10;

  player.vy += 0.7;
  player.y += player.vy;
  if(player.y > canvas.height - 150){
    player.y = canvas.height - 150;
    player.vy = 0;
    player.onGround = true;
    player.canDoubleJump = true;
  }

  ctx.drawImage(dogImg, player.x, player.y, player.w, player.h);

  spawnTimer++;
  if(spawnTimer > 100 - level*10){
    enemies.push({ x: canvas.width, y: canvas.height - 130, w:80, h:80, speed:5+level*1.5 });
    spawnTimer = 0;
  }

  enemies.forEach((e,i)=> {
    e.x -= e.speed;
    ctx.drawImage(catImg, e.x, e.y, e.w, e.h);
    if(e.x + e.w < 0) enemies.splice(i,1);
    if(player.x < e.x+e.w && player.x+player.w > e.x && player.y+player.h > e.y){
      if(player.vy < 0){
        enemies.splice(i,1);
        score += 10;
      } else {
        if(player.shield){
          player.shield = false;
        } else {
          return gameOver();
        }
      }
    }
  });

  score++;
  if(score > level*500) level++;
  document.getElementById('score').innerText = score;
  document.getElementById('level').innerText = 'Level '+level;
  requestAnimationFrame(gameLoop);
}

function gameOver(){
  alert('Game Over! Score: '+score);
  location.reload();
}

dogImg.onload = ()=> gameLoop();
