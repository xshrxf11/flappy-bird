export const ASSET_URL = process.env.NODE_ENV !== 'production' ? process.env.ASSET_DEV_URL : process.env.ASSET_PROD_URL
export const NUM_OF_BIRDS = 3
export const JUMP_FORCE = 320;
export const FALL_ANGLE = 50;
export const JUMP_ANGLE = -50;
export const PIPE_OPEN = 120;
export const PIPE_SPEED = 90;
export const COLORS = ['blue', 'red', 'yellow'] // changes items length if change number of players
export const JUMP_KEYS = ['space', 'enter', 'up'] // changes items length if change number of players