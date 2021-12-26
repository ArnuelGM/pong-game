((d) => {
  Ab               = Math.abs
  L              = 'addEventListener'
  S               = 'fillStyle'
  B               = 'beginPath'
  C               = 'closePath'
  R                = 'rect'
  F                = 'fill'
  K               = 'keyCode'
  let ctx          = li.getContext('2d') // li = canvas (view id in html)
  let canvasW      = 1e3
  let canvasH      = 564.97;
  let ballColor    = '#1976d2'
  let playersColor = 'blue'
  let boardColor   = '#222'
  let ballSize     = 7
  let middleBall   = ballSize/2
  let ballSpeedX   = 2
  let ballSpeedY   = 1
  let ballX        = 0
  let ballY        = 0
  let ballIsMoving = 0
  let playerLength = 60
  let leftSpeed    = 5
  let rightSpeed   = 5
  let leftTop      = (canvasH/2)-(playerLength/2)
  let rightTop     = leftTop
  let leftMoving   = 0
  let rightMoving  = 0
  let turn         = 'l'
  d[L]('keydown', (t) => {
    k = t[K]
    z = k==38 || k==87 ? -1 : 1
    // Poner en movimiento la bola
    // Tecla espaciadora
    if(k==32) ballIsMoving = 1
    // Player left move
    if(k==87 || k==83){leftMoving = 1; leftSpeed = (Ab(leftSpeed) * z);}
    // player roght move
    if(k==38 || k==40){rightMoving = 1; rightSpeed  = (Ab(rightSpeed) * z);}
  })
  d[L]('keyup', (t) => {
    k = t[K]
    // Player left stop moving
    if(k==87 || k==83) leftMoving = 0
    // Player right stop moving
    if(k==38 || k==40) rightMoving = 0
  })
  // Bucle principal del Juego
  setInterval(() => {
    // Borra el lienzo
    li.width   = canvasW
    li.height  = canvasH

    // Pinta el tablreo con los parametros por defecto
    ctx[S] = boardColor
    ctx[R](0,0,canvasW,canvasH)
    ctx[F]()

    // Mover jugadores
    // Mover jugador de la izquierda
    if( leftMoving ) {
      leftTop += leftSpeed
      // Impedir que se salga por arriba
      if( leftTop - Ab(leftSpeed) < 0 ) leftTop = 0
      // Impedir que se salga por abajo
      if( leftTop + Ab(leftSpeed) + playerLength > canvasH - 2 ) leftTop = canvasH - playerLength - 2
    }
    // Mover jugador de la derecha
    if( rightMoving ) {
      rightTop += rightSpeed
      // Impedir que se salga por arriba
      if( rightTop - Ab(rightSpeed) < 0 ) rightTop = 0
      // Impedir que se salga por abajo
      if( rightTop + Ab(rightSpeed) + playerLength > canvasH - 2 ) rightTop = canvasH - playerLength - 2
    }

    // Pintar la posicion de los jugadores
    ctx[S] = playersColor
    // Player left
    ctx[B]()
    ctx[R](0, leftTop, 6, playerLength)
    ctx[F]()
    ctx[C]()
    // Player right
    ctx[B]()
    ctx[R](canvasW-6, rightTop, 6, playerLength)
    ctx[F]()
    ctx[C]()
    
    // Mover la bola por el tablero
    if( ballIsMoving ) {
      ballX += ballSpeedX
      ballY += ballSpeedY
      if( (ballX + (middleBall) >= canvasW) || (ballX + (middleBall) > (canvasW - 6) && ballY > rightTop && ballY < rightTop+playerLength ) ) ballSpeedX = -Ab(ballSpeedX)
      else if((ballX - (middleBall) <= 0) || (ballX - (middleBall) < 6 && ballY > leftTop && ballY < leftTop+playerLength )) ballSpeedX = Ab(ballSpeedX)
      if( ballY + (middleBall) >= canvasH ) ballSpeedY = -Ab(ballSpeedY)
      else if( ballY - (middleBall) <= 0 ) ballSpeedY = Ab(ballSpeedY)
    }
    else if( turn == 'l' ) {
      ballX = ballSize + 6
      ballY = leftTop + (playerLength/2)
    }
    else {
      ballX = canvasW - ballSize - 6
      ballY = rightTop + (playerLength/2)
    }

    // Pintar la posicion de la bola
    ctx[S] = ballColor
    ctx[B]()
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI)
    ctx[F]()
    ctx[C]()

    // Check if left lost
    if( ballX - middleBall < 4 ) {
      turn = 'l'
      ballIsMoving = 0
      ballSpeedX = Ab(ballSpeedX)
    }

    // Check if right lost
    if( ballX + middleBall > canvasW-4 ) {
      turn = 'r'
      ballIsMoving = 0
      ballSpeedX = -Ab(ballSpeedX)
    }
  }, 6.66)
})(document)