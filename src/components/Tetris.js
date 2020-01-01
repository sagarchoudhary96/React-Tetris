import React, {useState} from 'react'
import styled from 'styled-components'

// styled components
import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'
import background from '../img/bg.png'

// custom hooks and utils
import {usePlayer} from '../utils/usePlayer'
import {useStage} from '../utils/useStage'
import {useInterval} from '../utils/useInterval'
import {useGameStatus} from '../utils/useGameStatus'
import {createStage, checkCollision} from '../utils/gameHelpers'

const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${background}) #000;
  background-size: cover;
  overflow: hidden;
`

const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;

  aside {
    width: 100%;
    max-width: 200px;
    display: block;
    padding: 0 20px;
  }
`
// Tetris Component
const Tetris = () => {
  const [dropTime, setDropTime] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer()
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

  // move player tetromino (left/right)
  const movePlayer = dir => {
    if (!checkCollision(player, stage, {x: dir, y: 0})) {
      updatePlayerPos({x:dir, y:0})
    }
  }

  // Start new game
  const startGame = () => {
    setStage(createStage())
    resetPlayer()
    setGameOver(false)
    setDropTime(1000)
    setRows(0)
    setScore(0)
    setLevel(0)
  }

  // Drop tetromino to Bottom
  const drop = () => {
    // increase level when 10 rows are cleared
    if (rows > (level+1) * 10) {
      setLevel(prev => prev + 1)
      setDropTime(1000/(level+1) + 200)
    }

    // checks for collision    
    if (!checkCollision(player,stage, {x:0, y:1})) {
      updatePlayerPos({x: 0, y: 1, collided: false})
    } else {
      // checks if game area is filled to top
      if (player.pos.y < 1) {
        setGameOver(true)
        setDropTime(null)
      }
      updatePlayerPos({x: 0,y: 0, collided: true})
    }
  }

  //player drop using down arrow key
  const dropPlayer = () =>  {
    // clear timeInterval
    setDropTime(null)
    drop()
  }

  // Player release the Down arrow key
  const keyUp = ({keyCode}) => {
    if (!gameOver && keyCode === 40) {
      // start Time Interval Again
      setDropTime(1000/(level+1) + 200)
    }
  }

  // Handle Player keyboard Movement
  const move = ({keyCode}) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1)
      } else if (keyCode === 39) {
        movePlayer(1)
      } else if (keyCode === 40) {
        dropPlayer()
      } else if (keyCode === 38) {
        rotatePlayer(stage, 1)
      }
    }
  }

  useInterval(() => {
    drop()
  }, dropTime)

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={e => keyUp(e)}>
      <StyledTetris>
      <Stage stage={stage}/>
      <aside>
        {gameOver ? 
          <Display gameOver={gameOver} text="Game Over"/> :
          <div>
            <Display text={`Score: ${score}`}/>
            <Display text={`Rows: ${rows}`}/>
            <Display text={`Level: ${level}`}/>
          </div>
        }
        <StartButton callback={startGame}/>
      </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  )
}

export default Tetris