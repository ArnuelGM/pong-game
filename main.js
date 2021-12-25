((d) => {
  Ab               = Math.abs
  AEL              = 'addEventListener'
  FS               = 'fillStyle'
  BP               = 'beginPath'
  CP               = 'closePath'
  R                = 'rect'
  F                = 'fill'
  KC               = 'keyCode'
  let ctx          = li.getContext('2d') // li = canvas (view id in html)
  let canvasW      = 1e3
  let canvasH      = 564.97;
  // Borra el lienzo
  (bc = () => {
    li.width   = canvasW
    li.height  = canvasH
  })()
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
  d[AEL]('keydown', (t) => {
    k = t[KC]
    // Poner en movimiento la bola
    // Tecla espaciadora
    if(k==32){ballIsMoving = 1; return;}
    // Player left top
    // Tecla w
    if(k==87){leftMoving = 1; leftSpeed = -Ab(leftSpeed); return;}
    // Player left bottom
    // Tecla s
    if(k==83){leftMoving = 1; leftSpeed = Ab(leftSpeed); return;}
    // Player right top
    // Flecha arriba
    if(k==38){rightMoving = 1; rightSpeed  = -Ab(rightSpeed); return;}
    // Player right bottom
    // Flecha abajo
    if(k==40){rightMoving = 1; rightSpeed  = Ab(rightSpeed); return;}
  })
  d[AEL]('keyup', (t) => {
    k = t[KC]
    // Player left top
    if(k==87){leftMoving = 0; return;}
    // Player left bottom
    if(k==83){leftMoving = 0; return;}
    // Player right top
    if(k==38){rightMoving = 0; return;}
    // Player right bottom
    if(k==40){rightMoving = 0; return;}
  })
  // Pinta el tablreo con los parametros por defecto
  pt = () => {
    ctx[FS] = boardColor
    ctx[R](0,0,canvasW,canvasH)
    ctx[F]()
  }
  // Pintar la posicion de los jugadores
  pj = () => {
    ctx[FS] = playersColor
    // Player left
    ctx[BP]()
    ctx[R](10, leftTop, 3, playerLength)
    ctx[F]()
    ctx[CP]()
    // Player right
    ctx[BP]()
    ctx[R](canvasW-14, rightTop, 3, playerLength)
    ctx[F]()
    ctx[CP]()
  }
  // Mover jugadores
  mp = () => {
    // Mover jugador de la izquierda
    if( leftMoving ) {
      leftTop += leftSpeed
      // Impedir que se salga por arriba
      if( leftTop - Ab(leftSpeed) < 1 ) leftTop = 1
      // Impedir que se salga por abajo
      if( leftTop + Ab(leftSpeed) + playerLength > canvasH - 2 ) leftTop = canvasH - playerLength - 2
    }
    // Mover jugador de la derecha
    if( rightMoving ) {
      rightTop += rightSpeed
      // Impedir que se salga por arriba
      if( rightTop - Ab(rightSpeed) < 1 ) rightTop = 1
      // Impedir que se salga por abajo
      if( rightTop + Ab(rightSpeed) + playerLength > canvasH - 2 ) rightTop = canvasH - playerLength - 2
    }
  }
  // Pintar la posicion de la bola
  pb = () => {
    ctx[FS] = ballColor
    ctx[BP]()
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI)
    ctx[F]()
    ctx[CP]()
  }
  // Mover la bola por el tablero
  bm = () => {
    if( ballIsMoving ) {
      ballX += ballSpeedX
      ballY += ballSpeedY
      if( (ballX + (middleBall) >= canvasW - 1) || (ballX + (middleBall) >= (canvasW - 20) && ballY > rightTop && ballY < rightTop+playerLength ) ) ballSpeedX = -Ab(ballSpeedX)
      else if((ballX - (middleBall) <= 0) || (ballX - (middleBall) <= 18 && ballY > leftTop && ballY < leftTop+playerLength )) ballSpeedX = Ab(ballSpeedX)
      if( ballY + (middleBall) + 2 >= canvasH - 2 ) ballSpeedY = -Ab(ballSpeedY)
      else if( ballY - (middleBall) < 5 ) ballSpeedY = Ab(ballSpeedY)
    }
    else {
      if( turn == 'l' ) {
        ballX = 13 + ballSize
        ballY = leftTop + (playerLength/2)
        return
      }
      ballX = canvasW - 10 - 4 - ballSize
      ballY = rightTop + (playerLength/2)
    }
  }
  // Check left lost
  cll =  () => {
    if( ballX - middleBall < 10 ) {
      turn = 'l'
      ballIsMoving = 0
      ballSpeedX = Ab(ballSpeedX)
    }
  }
  // Check right lost
  crl =  () => {
    if( ballX + middleBall > canvasW-14 ) {
      turn = 'r'
      ballIsMoving = 0
      ballSpeedX = -Ab(ballSpeedX)
    }
  }
  // Bucle principal del Juego
  setInterval(() => {bc();pt();mp();pj();bm();pb();cll();crl();}, 6.66)
})(document)