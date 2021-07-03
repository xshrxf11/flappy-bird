import kaboom from 'kaboom';
import * as c from './helpers/constants'

kaboom({
	global: true,
  fullscreen: true,
	scale: 2, // scale up the canvas
  debug: true
});

// load sprite
loadRoot(c.ASSET_URL);
loadSprite("bird-blue", "images/bird-blue.png");
loadSprite("bird-yellow", "images/bird-yellow.png");
loadSprite("bird-red", "images/bird-red.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");

// load sound
loadSound("hit", "sounds/sfx_hit.wav");
loadSound("point", "sounds/sfx_point.wav");
loadSound("wing", "sounds/sfx_wing.wav");

scene("menu", () => {
  const birds = []

  // add background sprite
  add([
    sprite("bg"),
    scale(width() / 240, height() / 240),
    origin("topleft"),
  ]);

  add([
    sprite("bird-blue"),
    pos((width() / 2) - 200, 20),
    origin("topleft"),
  ]);

  add([
    text("Flappy Bird", 30),
    pos((width() / 2) - 150, 20),
    origin("topleft"),
  ]);

  add([
    text("Player Mode", 15),
    pos((width() / 2) - 80, 60),
    color(0, 0, 0),
    origin("topleft"),
  ]);

  for (let i = 0; i < c.NUM_OF_BIRDS; i++) {
    birds.push(add([
      text(`${(i+1)} Players`, 12),
      pos(width() / 2, 100 + (i * 30)),
      origin("center"),
    ]))

    birds[i].clicks(() => {
      go("game", (i+1))
    })

    add([
      text(`P${(i + 1)} press <${c.JUMP_KEYS[i]}> to jump`),
      pos(width() / 2, (height() - 60 ) + (i * 15)),
      origin("center"),
    ])
  }
  
})

// define scene
scene("game", (numberOfBirds) => {
  
  const birds = []
  const scores = []

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

  for (let i = 0; i < numberOfBirds; i++) {

    // add birds
    birds.push(add([
      sprite(`bird-${c.COLORS[i]}`), // load sprite
      pos(100, 100 + (i * 20)), // position sprite
      body(), // gravity sprite
      scale(0.5),
      {
        dead: false,
        // passed: false,
      }, 
    ]));

    scores.push(add([
      pos(12 + (i * 200), 12),
      text(`P${(i+1)} 0`, 32),
      layer("ui"),
      {
        value: 0,
      },
    ]));

    // add jump key
    keyPress(c.JUMP_KEYS[i], () => {
      birds[i].jump(c.JUMP_FORCE);

      if(birds[i].exists()) {
        play("wing")
      }
    });

    // if bird fall, restart the game
    birds[i].action(() => {
      if (birds[i].pos.y >= height()) {
        birds[i].dead = true
        destroy(birds[i])
        health()
        play("hit")
      }
      if (birds[i].pos.y <= 0) {
        birds[i].dead = true
        destroy(birds[i])
        health()
        play("hit")
      }

      // check if bird is falling
      if(birds[i].falling()) {
        birds[i].angle = c.FALL_ANGLE
      }
      else {
        birds[i].angle = c.JUMP_ANGLE
      }
      
    });

    // if bird collides with pipe, restart the game
    birds[i].collides("pipe", () => {
      birds[i].dead = true
      destroy(birds[i])
      health()
      play("hit")
    });
	}

  function health() {
    // check all birds is alive
    const dead = birds.every(bird => bird.dead === true)

    // if all birds is dead, go to lose scene
    if (dead === true) {
      go("lose", scores)
    }
  }

  // loop every 1.5 seconds to spawn pipe
  loop(1.5, () => {

    // random height
    const pipePos = rand(0, height() - c.PIPE_OPEN);

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
			pos(width(), pipePos + c.PIPE_OPEN),
			scale(1, -1),
			origin("bot"),
			"pipe",
      { passed: [false, false, false] }, // changes items length if change number of players
		]);

	});

  // add pipe action
  action('pipe', (pipe) => {
    pipe.move(-c.PIPE_SPEED, 0)

    if(pipe.passed) {
      // if bird position passed the pipe position + width , set the score
      for (let i = 0; i < numberOfBirds; i++) {
        if(birds[i].dead === false) {
          if (pipe.pos.x + pipe.width <= birds[i].pos.x && pipe.passed[i] === false) {
            scores[i].value++;
            scores[i].text = `P${(i+1)} ${scores[i].value}`;
            pipe.passed[i] = true;
            play("point")
          }
        }
      }
    }

    // destroy pipe that out of frame
    if (pipe.pos.x + pipe.width < 0) {
			destroy(pipe);
		}
  })

});

// add lose scene
scene("lose", (scores) => {

  // add background black
  add([
    sprite("bg"),
    scale(width() / 240, height() / 240),
    origin("topleft")
  ]);

  // add text score
  scores.map((score, index) => {
    add([
      text(`P${(index + 1)} Score: ${score.value}`, 24),
      pos((width() / 2), (height() / 5) + (index * 50)),
      origin("center")
    ]);
  })

  add([
		text('Press <space> to play again'),
		pos(width() / 2, height() / 1.25),
		origin("center")
	]);

  add([
		text('Press <esc> back to menu'),
		pos(width() / 2, height() / 1.15),
		origin("center"),
	]);

  // go back to game
	keyPress("space", () => {
		go("game", scores.length);
	});

  keyPress("escape", () => {
		go("menu");
	});

});

// start scene
start("menu");