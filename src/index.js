import kaboom from 'kaboom';

kaboom({
	global: true,
  fullscreen: true,
	scale: 2 // scale up the canvas
});

// load sprite
loadRoot("http://localhost:8080/assets/");
loadSprite("birdy", "images/birdy.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");

// load sound
loadSound("die", "sounds/sfx_die.wav");
loadSound("hit", "sounds/sfx_hit.wav");
loadSound("point", "sounds/sfx_point.wav");
loadSound("swoosh", "sounds/sfx_swooshing.wav");
loadSound("wing", "sounds/sfx_wing.wav");

// define scene
scene("main", () => {
  
  layers([
		"game",
		"ui",
	], "game");
  
  // add background sprite
  add([
		sprite("bg"),
    scale(width() / 240, height() / 240),
		origin("topleft")
	]);

  // add bird sprite
	const birdy = add([
		sprite("birdy"), // load sprite
    pos(80, 80), // position sprite
    body() // gravity sprite
	]);

  const JUMP_FORCE = 320;

  // press space to jump
	keyPress("space", () => {
		birdy.jump(JUMP_FORCE);
    play("wing")
	});

  const FALL_ANGLE = 50;
  const JUMP_ANGLE = -50;

  // if bird fall, restart the game
  birdy.action(() => {
		if (birdy.pos.y >= height()) {
      go("gameover", score.value);
      play("hit")
		}
    if (birdy.pos.y <= 0) {
      go("gameover", score.value);
      play("hit")
		}

    // check if bird is falling
    if(birdy.falling()) {
      birdy.angle = FALL_ANGLE
    }
    else {
      birdy.angle = JUMP_ANGLE
    }
	});

  // if bird collides with pipe, restart the game
  birdy.collides("pipe", () => {
    go("gameover", score.value);
    play("hit")
	});

  const PIPE_OPEN = 120;
  const PIPE_SPEED = 90;

  loop(1.5, () => {

    // random height
    const pipePos = rand(0, height() - PIPE_OPEN);

    // add top pipe
		add([
			sprite("pipe"),
			origin("bot"),
			pos(width(), pipePos),
			"pipe",
		]);

    // add bottom pipe
		add([
			sprite("pipe"),
			pos(width(), pipePos + PIPE_OPEN),
			scale(1, -1),
			origin("bot"),
			"pipe",
      { passed: false, },
		]);

	});

  // add pipe action
  action('pipe', (pipe) => {
    pipe.move(-PIPE_SPEED, 0)

    // if bird position passed the pipe position + width , set the score
    if (pipe.pos.x + pipe.width <= birdy.pos.x && pipe.passed === false) {
			score.value++;
			score.text = score.value;
			pipe.passed = true;
      play("point")
		}

    // destroy pipe that out of frame
    if (pipe.pos.x + pipe.width < 0) {
			destroy(pipe);
		}
  })

  const score = add([
		pos(12, 12),
		text("0", 32),
    layer("ui"),
		{
			value: 0,
		},
	]);


});

// add gameover scene
scene("gameover", (score) => {

  // add background black
  add([
    rect(width(), height()),
		color(0),
	]);

  // add text score
	add([
		text(`score: ${score}`, 24),
		pos(width() / 2, height() / 2),
		origin("center"),
	]);

  add([
		text('Press <space> to play again'),
		pos(width() / 2, (height() / 2) + 50),
		origin("center"),
	]);

  // go back to main
	keyPress("space", () => {
		go("main");
	});

});

// start scene
start("main");