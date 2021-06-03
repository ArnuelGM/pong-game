window.onload = function () {
  const lienzo = document.querySelector('#lienzo')
  const ctx = lienzo.getContext('2d')

  // Sonidos del juego
  const soundHitBand = new Audio('hitBand.mp3')
  const soundHitP = new Audio('hit.mp3')
  const soundWin = new Audio('win.mp3')

  // Constantes
  const canvasW         = 1500
  const canvasH         = canvasW/1.7777
  const fps             = 150
  const linesColor      = '#fff'
  const marcadorHeight  = 100
  const ballColor       = '#1976d2'
  const playersColor    = 'orange'
  const boardColor      = '#222'

  lienzo.width = canvasW
  lienzo.height = canvasH
  ctx.imageSmoothingEnabled = false

  // Propiedades de la bola 1
  let ballSize          = 7
  let ballSpeedX        = 5
  let ballSpeedY        = 3
  let ballX             = 0
  let ballY             = 0
  let ballIsMoving      = false

  // Propiedades del los jugadores
  const playerLength    = 60
  let leftSpeed         = 5
  let rightSpeed        = 5
  let leftTop           = (canvasH/2)+(marcadorHeight/2)-(playerLength/2)
  let rightTop          = (canvasH/2)+(marcadorHeight/2)-(playerLength/2)
  let leftMoving        = false
  let rightMoving       = false
  let turn              = 'left'

  // Vairables del juego
  let round             = 0
  let scoreLeft         = 0
  let scoreRight        = 0
  let stop              = false

  function line(from, to, width, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.strokeWidth = width
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x,to.y)
    ctx.stroke()
    ctx.closePath()
  }

  document.addEventListener('keydown', (tecla) => {
    console.log(tecla)
    switch( tecla.keyCode ) {
      // Poner en movimiento la bola
      // Tecla espaciadora
      case 32:
        ballIsMoving = true
        stop = false
        soundHitP.play()
        break

      case 66:
        ballIsMoving = false
        stop = true
        break

      // Player left top
      // Tecla w
      case 87:
        leftMoving = true
        leftSpeed = -Math.abs(leftSpeed)
        break

      // Player left bottom
      // Tecla s
      case 83:
        leftMoving = true
        leftSpeed = Math.abs(leftSpeed)
        break

      // Player right top
      // Flecha arriba
      case 38:
        rightMoving = true
        rightSpeed  = -Math.abs(rightSpeed)
        break

      // Player right bottom
      // Flecha abajo
      case 40:
        rightMoving = true
        rightSpeed  = Math.abs(rightSpeed)
        break
    }
  })

  document.addEventListener('keyup', (tecla) => {
    switch( tecla.keyCode ) {
      // Player left top
      case 87:
        leftMoving = false
        break

      // Player left bottom
      case 83:
        leftMoving = false
        break

      // Player right top
      case 38:
        rightMoving = false
        break

      // Player right bottom
      case 40:
        rightMoving = false
        break
    }
  })

  // Borra el lienzo
  function borraCanvas() {
    lienzo.width = canvasW
    lienzo.height = canvasH
  }

  // Pinta el tablreo con los parametros por defecto
  function pintarTablero() {
    ctx.beginPath()
    ctx.fillStyle = boardColor
    ctx.rect(0,0,canvasW,canvasH)
    ctx.fill()
    ctx.closePath()

    ctx.strokeStyle = linesColor
    ctx.lineWidth = 1
    
    // Pintamos los limites del tablero de juego
    ctx.beginPath()
    // ctx.rect(5, marcadorHeight+5, canvasW-10, canvasH-marcadorHeight-5)
    // ctx.stroke()
    line({x:0, y: marcadorHeight+5}, {x:canvasW, y:marcadorHeight+5}, 1, linesColor)
    line({x:canvasW-1, y: marcadorHeight+5}, {x:canvasW-1, y:canvasH}, 1, linesColor)
    line({x:canvasW, y: canvasH-1}, {x:0, y:canvasH-1}, 1, linesColor)
    line({x:1, y: canvasH}, {x:1, y:marcadorHeight+5}, 1, linesColor)
    ctx.closePath()

    // Pintamos la linea del centro
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(canvasW/2, marcadorHeight+5);
    ctx.lineTo(canvasW/2, canvasH);
    ctx.stroke();
    ctx.closePath()
  }

  // Pintar los puntajes
  function pintarPuntajes() {
    ctx.font = (marcadorHeight/2) + 'px monospace'
    ctx.fillStyle = linesColor

    // Score left
    ctx.fillText( `${scoreLeft}` , canvasW/4, marcadorHeight-(marcadorHeight/3))

    // Score right
    ctx.fillText( `${scoreRight}` , (canvasW/4)*3, marcadorHeight-(marcadorHeight/3))

    // Round
    ctx.font = '18px monospace'
    ctx.fillText( `Round: ${round}` , (canvasW/2)-40, marcadorHeight-(marcadorHeight/3))
  }

  // Pintar la posicion de los jugadores
  function pintarJugadores() {
    ctx.fillStyle = playersColor
    // Player left
    ctx.beginPath()
    ctx.rect(10, leftTop, 3, playerLength)
    ctx.fill()
    ctx.closePath()

    // Player right
    ctx.beginPath()
    ctx.rect(canvasW-14, rightTop, 3, playerLength)
    ctx.fill()
    ctx.closePath()
  }

  // Mover jugadores
  function movePlayers () {
    // Mover jugador de la izquierda
    if( leftMoving ) {

      leftTop += leftSpeed

      // Impedir que se salga por arriba
      if( leftTop - Math.abs(leftSpeed) < marcadorHeight + 6 ) {
        leftTop = marcadorHeight + 6
      }

      // Impedir que se salga por abajo
      if( leftTop + Math.abs(leftSpeed) + playerLength > canvasH - 2 ) {
        leftTop = canvasH - playerLength - 2
      }
      
    }
    
    // Mover jugador de la derecha
    if( rightMoving ) {
  
      rightTop += rightSpeed
  
      // Impedir que se salga por arriba
      if( rightTop - Math.abs(rightSpeed) < marcadorHeight + 6 ) {
        rightTop = marcadorHeight + 6
      }
  
      // Impedir que se salga por abajo
      if( rightTop + Math.abs(rightSpeed) + playerLength > canvasH - 2 ) {
        rightTop = canvasH - playerLength - 2
      }
      
    }
  }

  // Pintar la posicion de la bola
  function pintarBola() {
    ctx.fillStyle = ballColor
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }

  // Mover la bola por el tablero
  function ballMove() {
    if( ballIsMoving ) {

      ballX += ballSpeedX
      ballY += ballSpeedY

      if( (ballX + (ballSize/2) >= canvasW - 1) ||
        (ballX + (ballSize/2) >= (canvasW - 20) && ballY > rightTop && ballY < rightTop+playerLength )
      ) {
        ballSpeedX = -Math.abs(ballSpeedX)
        soundHitP.play()
      }
      else if( (ballX - (ballSize/2) <= 0) || 
        (ballX - (ballSize/2) <= 18 && ballY > leftTop && ballY < leftTop+playerLength )
      ) {
        ballSpeedX = Math.abs(ballSpeedX)
        soundHitP.play()
      }

      if( ballY + (ballSize/2) + 2 >= canvasH - 2 ) {
        ballSpeedY = -Math.abs(ballSpeedY)
        soundHitBand.play()
      }
      else if( ballY - (ballSize/2) < marcadorHeight + 10 ) {
        ballSpeedY = Math.abs(ballSpeedY)
        soundHitBand.play()
      }

    }
    else if( !stop ) {
      if( turn == 'left' ) {
        ballX = 10 + 3 + ballSize
        ballY = leftTop + (playerLength/2)
      }
      else if (turn == 'right' ) {
        ballX = canvasW - 10 - 4 - ballSize
        ballY = rightTop + (playerLength/2)
      }
    }

  }

  // Check left lost
  function checkLeftLost () {
    if( ballX - ballSize/2 < 10 ) {
      turn = 'left'
      ballIsMoving = false
      ballSpeedX = Math.abs(ballSpeedX)
      return true
    }
    return false
  }

  // Check right lost
  function checkRightLost () {
    if( ballX + ballSize/2 > canvasW-14 ) {
      turn = 'right'
      ballIsMoving = false
      ballSpeedX = -Math.abs(ballSpeedX)
      return true
    }
    return false
  }

  // Check lost
  function checkLost() {
    const leftLost = checkLeftLost()
    const rightLost = checkRightLost()
    if( leftLost || rightLost ) {
      soundWin.play()
      round++
    }
    if( leftLost ) {
      scoreRight++
    }
    else if( rightLost ) {
      scoreLeft++
    }
  }

  // Bucle principal del Juego
  function principal() {
    borraCanvas()
    pintarTablero()
    pintarPuntajes()
    movePlayers()
    pintarJugadores()
    ballMove()
    pintarBola()
    checkLost()
  }
  setInterval(() => principal(), 1000/fps)
  
}