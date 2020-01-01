import {useState, useCallback} from 'react'
import {TETROMINOS,randomTetromino} from './tetrominos'
import {STAGE_WIDTH, checkCollision} from './gameHelpers'

// Custom Hook to handle Player
export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: {x: 0, y: 0},
    tetromino: TETROMINOS[0].shape,
    collided: false
  })

  // update player position
  const updatePlayerPos = ({x,y,collided}) => {
    setPlayer(prevState => ({
      ...prevState,
      pos: {x: (prevState.pos.x +=x), y: (prevState.pos.y +=y)},
      collided
    }))
  }

  // Rotate tetromino
  const rotate = (matrix, dir) => {
    // array transpose
    const rotatedTetro = matrix.map((_, i) => matrix.map(col => col[i]))

    // reverse each row
    if (dir > 0) {
      return rotatedTetro.map(row => row.reverse())
    }

    return rotatedTetro.reverse()
  }

  // Rotate Player and handle collision
  const rotatePlayer = (stage, dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player))
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir)
    
    const pos = clonedPlayer.pos.x
    let offset = 1
    while (checkCollision(clonedPlayer, stage, {x:0, y:0})) {
      clonedPlayer.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))

      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir)
        clonedPlayer.pos.x = pos
        return
      }
    }
    setPlayer(clonedPlayer)
  }

  // reset player for new tetromino
  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: {x:STAGE_WIDTH/2 -2, y:0},
      collided: false,
      tetromino: randomTetromino().shape
    })
  }, [])

  return [player, updatePlayerPos, resetPlayer, rotatePlayer]
}