let player1, player2;
let bullets1 = [];
let bullets2 = [];
let bgColor;

function setup() {
  createCanvas(800, 400);
  console.log("Canvas created"); // 添加調試信息
  
  bgColor = color(150, 200, 255);
  
  // 初始化玩家1
  player1 = {
    x: 200,
    y: 200,
    speed: 5,
    health: 100,
    color: color(255, 182, 193),
    size: 40,
    bulletColor: color(255, 150, 150),
    shootCooldown: 0,
    expression: "happy"
  };
  
  // 初始化玩家2
  player2 = {
    x: 600,
    y: 200,
    speed: 5,
    health: 100,
    color: color(173, 216, 230),
    size: 40,
    bulletColor: color(150, 150, 255),
    shootCooldown: 0,
    expression: "happy"
  };
  
  console.log("Setup complete"); // 添加調試信息
}

function draw() {
  background(bgColor);
  
  // 更新和繪製子彈
  updateBullets();
  drawBullets();
  
  // 繪製角色
  drawCharacter(player1);
  drawCharacter(player2);
  
  // 繪製血條
  drawHealthBar(player1, 50, 30);
  drawHealthBar(player2, width - 250, 30);
  
  // 處理輸入
  handleInput();
  
  // 更新冷卻時間
  if (player1.shootCooldown > 0) player1.shootCooldown--;
  if (player2.shootCooldown > 0) player2.shootCooldown--;
  
  // 顯示操作說明
  showInstructions();
}

function drawCharacter(player) {
  push();
  // 主體
  fill(player.color);
  stroke(0);
  strokeWeight(2);
  circle(player.x, player.y, player.size);
  
  // 耳朵
  fill(player.color);
  circle(player.x - player.size/3, player.y - player.size/2, player.size/2);
  circle(player.x + player.size/3, player.y - player.size/2, player.size/2);
  
  // 眼睛
  fill(255);
  circle(player.x - player.size/6, player.y - player.size/8, player.size/4);
  circle(player.x + player.size/6, player.y - player.size/8, player.size/4);
  
  // 眼珠
  fill(0);
  circle(player.x - player.size/6, player.y - player.size/8, player.size/8);
  circle(player.x + player.size/6, player.y - player.size/8, player.size/8);
  
  // 臉頰
  noStroke();
  fill(255, 150, 150, 100);
  circle(player.x - player.size/3, player.y, player.size/4);
  circle(player.x + player.size/3, player.y, player.size/4);
  
  // 嘴巴
  stroke(0);
  strokeWeight(2);
  if (player.health > 50) {
    noFill();
    arc(player.x, player.y + player.size/8, player.size/2, player.size/3, 0, PI);
  } else {
    noFill();
    arc(player.x, player.y + player.size/4, player.size/2, player.size/3, PI, TWO_PI);
  }
  pop();
}

function updateBullets() {
  // 更新玩家1的子彈
  for (let i = bullets1.length - 1; i >= 0; i--) {
    bullets1[i].x += bullets1[i].speed;
    if (dist(bullets1[i].x, bullets1[i].y, player2.x, player2.y) < player2.size/2) {
      player2.health = max(0, player2.health - 10);
      bullets1.splice(i, 1);
      continue;
    }
    if (bullets1[i].x > width) {
      bullets1.splice(i, 1);
    }
  }
  
  // 更新玩家2的子彈
  for (let i = bullets2.length - 1; i >= 0; i--) {
    bullets2[i].x -= bullets2[i].speed;
    if (dist(bullets2[i].x, bullets2[i].y, player1.x, player1.y) < player1.size/2) {
      player1.health = max(0, player1.health - 10);
      bullets2.splice(i, 1);
      continue;
    }
    if (bullets2[i].x < 0) {
      bullets2.splice(i, 1);
    }
  }
}

function drawBullets() {
  // 玩家1的子彈
  for (let bullet of bullets1) {
    drawHeart(bullet.x, bullet.y, bullet.size, player1.bulletColor);
  }
  
  // 玩家2的子彈
  for (let bullet of bullets2) {
    drawStar(bullet.x, bullet.y, bullet.size, player2.bulletColor);
  }
}

function drawHeart(x, y, size, color) {
  push();
  translate(x, y);
  scale(size/30);
  fill(color);
  noStroke();
  beginShape();
  vertex(0, -4);
  bezierVertex(-10, -10, -10, 4, 0, 8);
  bezierVertex(10, 4, 10, -10, 0, -4);
  endShape();
  pop();
}

function drawStar(x, y, size, color) {
  push();
  translate(x, y);
  fill(color);
  noStroke();
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5 - PI/2;
    let x1 = cos(angle) * size/2;
    let y1 = sin(angle) * size/2;
    vertex(x1, y1);
    angle += TWO_PI/10;
    x1 = cos(angle) * size/4;
    y1 = sin(angle) * size/4;
    vertex(x1, y1);
  }
  endShape(CLOSE);
  pop();
}

function drawHealthBar(player, x, y) {
  push();
  noStroke();
  fill(255, 0, 0);
  rect(x, y, 200, 20);
  fill(0, 255, 0);
  rect(x, y, player.health * 2, 20);
  fill(255);
  textAlign(CENTER);
  textSize(14);
  text(player.health + '/100', x + 100, y + 15);
  pop();
}

function handleInput() {
  // 玩家1移動
  if (keyIsDown(87)) player1.y -= player1.speed; // W
  if (keyIsDown(83)) player1.y += player1.speed; // S
  if (keyIsDown(65)) player1.x -= player1.speed; // A
  if (keyIsDown(68)) player1.x += player1.speed; // D
  
  // 玩家2移動
  if (keyIsDown(UP_ARROW)) player2.y -= player2.speed;
  if (keyIsDown(DOWN_ARROW)) player2.y += player2.speed;
  if (keyIsDown(LEFT_ARROW)) player2.x -= player2.speed;
  if (keyIsDown(RIGHT_ARROW)) player2.x += player2.speed;
  
  // 玩家1射擊
  if (keyIsDown(71) && player1.shootCooldown <= 0) { // G
    bullets1.push({
      x: player1.x + player1.size/2,
      y: player1.y,
      speed: 8,
      size: 10
    });
    player1.shootCooldown = 15;
  }
  
  // 玩家2射擊
  if (keyIsDown(78) && player2.shootCooldown <= 0) { // N
    bullets2.push({
      x: player2.x - player2.size/2,
      y: player2.y,
      speed: 8,
      size: 10
    });
    player2.shootCooldown = 15;
  }
  
  // 邊界檢查
  player1.x = constrain(player1.x, player1.size/2, width - player1.size/2);
  player1.y = constrain(player1.y, player1.size/2, height - player1.size/2);
  player2.x = constrain(player2.x, player2.size/2, width - player2.size/2);
  player2.y = constrain(player2.y, player2.size/2, height - player2.size/2);
}

function showInstructions() {
  push();
  fill(0);
  textSize(12);
  text('玩家1: WASD移動, G發射', 100, height - 20);
  text('玩家2: 方向鍵移動, N發射', width - 100, height - 20);
  pop();
}
