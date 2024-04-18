import pgzrun
import random
import math
from pgzhelper import *

WIDTH=800
HEIGHT=600

player = Actor('playership1_blue')
player.x = 400
player.y = 300
player.scale = 0.8
player.life = 3

drone = Actor('enemyblack5')
drone.scale = 0.5

shield = Actor('energy_shield')
shield.y = player.y
shield.x = player.x
shield.scale = 0.25

game_over = Actor('game_over')
game_over.x = 380
game_over.y = 300
game_over.scale = 1.25

victory = Actor('victory')
victory.x = 400
victory.y = 300
victory.scale = 2.2

start = Actor("untitled")
start.x = 520
start.y = 300
start.scale = 0.835

cursor = Actor('cursor')
cursor.x = 400
cursor.y = 750
cursor.scale = 0.08

button = Actor("button")
button.x = 300
button.y = 280
button.scale = 0.3

test = Actor("test")
test.x = 300
test.y = 390
test.scale = 0.6

nuke = Actor("small_bomb1")

game_state = 0

bullets = []
bullet_delay = 0

background_images = ['background1','background2','background3']
backgrounds = []
background = Actor(random.choice(background_images))
background.x = 400
background.y = 300
backgrounds.append(background)
background.scale = 2
background = Actor(random.choice(background_images))
background.x = 400
background.y = -300
backgrounds.append(background)
background.scale = 2

enemies = []

explosions = []

powerups = []
powerup_images = ['bullet', 'drone', "shield", "pill_blue" , "speed", "slow", "small_bomb1"]
powerup1 = 0
powerup2 = 0
powerup3 = False
powerup4 = False
powerup5 = False
powerup6 = False
powerup7 = False

shields = []

score = 0
FPS = 0
shield_strength = 0
speed = 0
meteors = 0
slow = 0
FPS2 = 0
FPS3 = 0

def on_mouse_move(pos, rel, buttons):
    cursor.x = pos[0]
    cursor.y = pos[1]
  
def shoot():
  global bullet_delay

  bullet_delay = 5

  if powerup1 == 0:
    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

  elif powerup1 == 1:
    bullet = Actor('laserblue01')
    bullet.x = player.x - 15
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x + 15
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

  elif powerup1 == 2:
    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 110
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 70
    bullets.append(bullet)

  elif powerup1 == 3:
    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 110
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x - 15
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x + 15
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 70
    bullets.append(bullet)

  elif powerup1 >= 4:
    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 115
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 100
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 80
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = player.x
    bullet.y = player.y
    bullet.angle = player.angle + 65
    bullets.append(bullet)

  if powerup2 == 1:
      bullet = Actor('laserblue01')
      bullet.x = drone.x
      bullet.y = drone.y
      bullet.angle = player.angle + 90
      bullets.append(bullet)

  if powerup2 == 2:
    bullet = Actor('laserblue01')
    bullet.x = drone.x - 15
    bullet.y = drone.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

    bullet = Actor('laserblue01')
    bullet.x = drone.x + 15
    bullet.y = drone.y
    bullet.angle = player.angle + 90
    bullets.append(bullet)

def update():
  global bullet_delay, powerup1, powerup2, powerup3, powerup4, powerup5, game_state, score, shield, bomb, FPS, shield_strength, speed, shields, ang, meteors, powerup6, slow, powerup7, FPS2, FPS3

  #start screen
  if game_state == 0:
    if cursor.collide_pixel(button):
     game_state = 1  
  if game_state == 0:
    if cursor.collide_pixel(test):
      game_state = 4
  #timer
  FPS -= 1
  FPS2 -= 1

  if FPS < 0:
    FPS = 0

  if FPS2 < 0:
    FPS2 = 0

  if FPS3 < 0:
    FPS3 = 0
    
  #aim
  ang = math.atan2(cursor.y - player.y, cursor.x - player.x)
  player.angle = ang * -180

  #shield_position
  shield.x = player.x
  shield.y = player.y
  
  #movement
  if keyboard.w:
    player.y -= 5 + speed
  if keyboard.s:
    player.y += 5 + speed
  if keyboard.d:
    player.x += 5 + speed
  if keyboard.a:
    player.x -= 5 + speed

  if keyboard.up:
    player.y -= 5 + speed
  if keyboard.down:
    player.y += 5 + speed
  if keyboard.right:
    player.x += 5 + speed
  if keyboard.left:
    player.x -= 5 + speed

  #movment_limits
  if player.x < 25:
    player.x = 25
  if player.x > 775:
    player.x = 775
  if player.y < 30:
    player.y = 30
  if player.y > 570:
    player.y = 570

  #drone_location
  drone.move_towards(player, 3)

  #life
  player.life == 3
  
  if player.life > 5:
    score += 50
    player.life = 5

  #victory
  if game_state == 1:
    print (FPS)
    if score > 2000:
      game_state = 3

  #shot
  if keyboard.space and bullet_delay == 0 and game_state > 0:
    shoot()

  if keyboard.lshift and bullet_delay == 0 and game_state > 0:
    shoot()

  #space between bullets
  if bullet_delay > 0:
    bullet_delay -= 1
  
  for bullet in bullets:
    bullet.move_forward(15)
    if bullet.y < 0:
      bullets.remove(bullet)

  #moving background
  for background in backgrounds:
    background.y += 3
    if background.y > 900:
      background.y -= 1200
      background.image = random.choice(background_images)

  if game_state > 0:
    # meteor goes down
    if random.randint(0, 600) > 597:
      enemy = Actor('meteorbrown_big3')
      enemy.images = ['meteorbrown_big3', 'meteorbrown_big4']
      enemy.fps = 5
      meteors += 1
      enemy.y = -50
      enemy.x = random.randint(100, 500)
      enemy.direction = -90
      enemies.append(enemy)

    # meteorer goes right
    if random.randint(0, 600) > 597:
      enemy = Actor('meteorbrown_big3')
      enemy.images = ['meteorbrown_big3', 'meteorbrown_big4']
      enemy.fps = 5
      meteors += 1
      enemy.x = -50
      enemy.y = random.randint(100, 500)
      enemy.direction = 0
      enemies.append(enemy)

    # meteor goes left
    if random.randint(0, 600) > 597:
      enemy = Actor('meteorbrown_big3')
      enemy.images = ['meteorbrown_big3', 'meteorbrown_big4']
      enemy.fps = 5
      meteors += 1
      enemy.x = 810
      enemy.y = random.randint(100, 500)
      enemy.direction = 180
      enemies.append(enemy)

    #meteor goes up
    if random.randint(0, 600) > 597:
      enemy = Actor('meteorbrown_big3')
      enemy.images = ['meteorbrown_big3', 'meteorbrown_big4']
      enemy.fps = 5
      meteors += 1
      enemy.y = 610
      enemy.x = random.randint(100, 500)
      enemy.direction = 90
      enemies.append(enemy)

  #powerup location
  if random.randint(0, 1000) > 997:
    powerup = Actor('star')
    powerup.y = -50
    powerup.x = random.randint(100, 700)
    powerup. scale = 1.5
    if score > 100 :
      powerups.append(powerup)
  
  for powerup in powerups:
    powerup.y += 4

  #enemy limits
  for enemy in enemies:
    enemy.move_in_direction(5 - slow)
    enemy.animate()
    if enemy.y > 700:
      enemies.remove(enemy)
      score -= 20
      meteors -= 1
    if enemy.y < -100:
      enemies.remove(enemy)
      score -= 20
      meteors -= 1
    if enemy.x > 900:
      enemies.remove(enemy)
      score -= 20
      meteors -= 1
    if enemy.x < -100:
      enemies.remove(enemy)
      score -= 20
      meteors -= 1

    #score limits
    if score < 0:
      score = 0

  #if bullet hit
  for bullet in bullets:
    hit = bullet.collidelist(enemies)
    if hit != -1:
      bullets.remove(bullet)
      explosion = Actor('explosion')
      explosion.x = enemies[hit].x
      explosion.y = enemies[hit].y
      explosion.scale = 0.25
      explosion.images = ['explosion', 'explosjon']
      explosion.fps = 8
      explosion.life = 10
      explosions.append(explosion)
      enemies.remove(enemies[hit])
      score += 20
      meteors -= 1
    if bullet.y > 700:
      bullets.remove(bullet)    

    #player hit enemy
  for enemy in enemies:
    hit = player.collidelist(enemies)
    if game_state == 1:
      if player.collidelist(enemies) != -1 and player.life > 0 and shield_strength == 0:
        player.life -= 1
        enemies.remove(enemies[hit])
        meteors -= 1

  #shield hit enemy
  for enemy in enemies:
    hit = shield.collidelist(enemies)
    if shield.collidelist(enemies) != -1 and shield_strength > 0:
      shield_strength -= 1
      enemies.remove(enemies[hit])
      if shield_strength == 0:
        powerup3 = False

  #shield limits
  if shield_strength > 5:
    score += 50
    shield_strength == 5
        
    #game over
  if player.life == 0:
    game_state = 2
     
      
  #create explosion
  for explosion in explosions:
    explosion.animate()
    explosion.life -= 1
    if explosion.life == 0:
      explosions.remove(explosion)

  #when bullet hit powerup
  for powerup in powerups:
    hit = powerup.collidelist(bullets)
    if hit != -1:
      powerup.y -= 40
      powerup.image = random.choice(powerup_images)
      bullets.remove(bullets[hit])

  #when player hit powerup
  hit = player.collidelist(powerups)
  if hit != -1 and game_state > 0:
    if powerups[hit].image == 'bullet':
      powerup1 += 1
      FPS += 400
      
    elif powerups[hit].image == 'drone':
      powerup2 += 1
      FPS += 300
      
    elif powerups[hit].image == 'shield':
      powerup3 = True
      shield_strength += 1
      FPS += 300
      
    elif powerups[hit].image == 'pill_blue':
      powerup4 = True
      player.life += 1
      FPS += 1

    elif powerups[hit].image == 'speed':
      powerup5 = True
      speed += 5
      FPS3 += 200

    elif powerups[hit].image == 'slow':
      powerup6 = True
      slow += 3
      FPS3 += 200

    elif powerups[hit].image == 'small_bomb1':
      powerup7 = True
      FPS2 += 1
      
    else:
      score += 50
      
    powerups.remove(powerups[hit])

  #when timer runs out
  if FPS == 0:
    powerup1 = 0
    powerup2 = 0
    powerup3 = False
    shield_strength == 0
    speed == 0
    powerup4 = False
    slow == 0
    
  if FPS2 == 0:
    powerup7 = False

  if FPS3 == 0:
    powerup5 = False
    powerup6 = False

  #slow limits
  if slow > 3:
    slow == 3

  #drone limits
  if powerup2 > 2:
    score += 100
    powerup2 = 2

  #bullet limits
  if powerup1 > 4:
    score += 100
    powerup1 = 4

  #When powerup7 is true
  if powerup7:
    score += meteors * 20
    del enemies [:]
    meteors == 0

def draw():
  screen.clear()
  if game_state == 1:
    for background in backgrounds:
      background.draw()
    for explosion in explosions:
      explosion.draw()
    for enemy in enemies:
      enemy.draw()
  if game_state == 1:
    player.draw()
    cursor.draw()
  for bullet in bullets:
    bullet.draw()
  
  if score > 100:
   for powerup in powerups:
    powerup.draw()
    if powerup2:
      drone.draw()
    if powerup3:
      shield.draw()
    if powerup7:
      nuke.draw()
     
  screen.draw.text("Score: " + str(score), (10, 25), color=(255,255,255), fontsize=40)
  screen.draw.text("HP: " + str(player.life), (10, 0), color=(255,255,255), fontsize=40)
  screen.draw.text("Timer: " + str(FPS + FPS2 + FPS3), (10, 50), color=(255,255,255), fontsize=40)
  if game_state == 2:
    game_over.draw()
    screen.draw.text("Credits: Nicho og internett", (10, 25), color=(255,255,255), fontsize=40)
    
  if game_state == 3:
    victory.draw()
    screen.draw.text("Credits: Nicho og internett", (10, 25), color=(255,255,255), fontsize=40)
    
  if game_state == 0:
    start.draw()
    button.draw()
    test.draw()
    cursor.draw()
    screen.draw.text("Y: " + str(cursor.y), (10, 25), color=(255,255,255), fontsize=40)
    screen.draw.text("X: " + str(cursor.x), (10, 0), color=(255,255,255), fontsize=40)
    
  if game_state == 4:
    for background in backgrounds:
      background.draw()
    for bullet in bullets:
      bullet.draw()
    for explosion in explosions:
      explosion.draw()
    for enemy in enemies:
      enemy.draw()
      
    if score > 100:
     for powerup in powerups:
      powerup.draw()
      if powerup2:
        drone.draw()
      if powerup3:
        shield.draw()
      if powerup7:
        nuke.draw()
  if game_state == 4:
    player.draw()
    cursor.draw()
    screen.draw.text("Score: " + str(score), (10, 0), color=(255,255,255), fontsize=40)
    screen.draw.text("HP: " + str(player.life), (10, 25), color=(255,255,255), fontsize=40)

pygame.display.flip()
clock.tick(60)

pgzrun.go() 