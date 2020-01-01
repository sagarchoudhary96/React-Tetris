export const STAGE_WIDTH = 12
export const STAGE_HEIGHT = 20

// Create new Stage (game Area)
export const createStage = () => 
  Array.from(Array(STAGE_HEIGHT), () => 
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  )

// Check Game Collision
export const checkCollision = (player, stage, {x, y}) => {
  for (let i=0; i< player.tetromino.length; i++) {
    for (let j=0; j<player.tetromino[i].length; j++) {
      // check we are on tetromino cell
      if (player.tetromino[i][j] !== 0) {
        // check movement is within game area height
        if ( !stage[i + player.pos.y + y] ||
        // check movement is withing game area width
        !stage[i + player.pos.y + y][j + player.pos.x + x] ||
        // check cell we are moving is not clear
        stage[i + player.pos.y + y][j + player.pos.x + x][1] !== 'clear') {
          return true
        }
      }
    }
  }
  return false
}