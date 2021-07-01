import kaboom from 'kaboom';

kaboom({
	global: true,
  fullscreen: true,
	scale: 2
});

loadRoot("http://localhost:8080/");
loadSprite("birdy", "assets/images/birdy.png");

scene("main", () => {
	const birdy = add([
		sprite("birdy"),
	]);
});

start("main");