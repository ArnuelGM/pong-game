((d) => {
  M = Math
  AEL = 'addEventListener'
  FS  = 'fillStyle'
  BP  = 'beginPath'
  CP  = 'closePath'
  let lienzo = d.querySelector('#lienzo')
  let ctx = lienzo.getContext('2d')
  let canvasW         = 1000
  let canvasH         = canvasW/1.7777
  let ballColor       = '#1976d2'
  let playersColor    = 'blue'
  let boardColor      = '#222'
  // Borra el lienzo
  bc = () => {
    lienzo.width = canvasW
    lienzo.height = canvasH
  }
  bc()
  let ballSize          = 7
  let middleBall        = ballSize/2
  let ballSpeedX        = 2
  let ballSpeedY        = 1
  let ballX             = 0
  let ballY             = 0
  let ballIsMoving      = 0
  let playerLength      = 60
  let leftSpeed         = 5
  let rightSpeed        = 5
  let leftTop           = (canvasH/2)-(playerLength/2)
  let rightTop          = leftTop
  let leftMoving        = 0
  let rightMoving       = 0
  let turn              = 'l'
  let stop              = 0
  d[AEL]('keydown', (t) => {
    k = t.keyCode
    // Poner en movimiento la bola
    // Tecla espaciadora
    if(k==32){ballIsMoving = 1; stop = 0; return;}
    if(k==66){ballIsMoving = 0; stop = 1; return;}
    // Player left top
    // Tecla w
    if(k==87){leftMoving = 1; leftSpeed = -M.abs(leftSpeed); return;}
    // Player left bottom
    // Tecla s
    if(k==83){leftMoving = 1; leftSpeed = M.abs(leftSpeed); return;}
    // Player right top
    // Flecha arriba
    if(k==38){rightMoving = 1; rightSpeed  = -M.abs(rightSpeed); return;}
    // Player right bottom
    // Flecha abajo
    if(k==40){rightMoving = 1; rightSpeed  = M.abs(rightSpeed); return;}
  })
  d[AEL]('keyup', (t) => {
    k = t.keyCode
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
    ctx.rect(0,0,canvasW,canvasH)
    ctx.fill()
  }
  // Pintar la posicion de los jugadores
  pj = () => {
    ctx[FS] = playersColor
    // Player left
    ctx[BP]()
    ctx.rect(10, leftTop, 3, playerLength)
    ctx.fill()
    ctx[CP]()
    // Player right
    ctx[BP]()
    ctx.rect(canvasW-14, rightTop, 3, playerLength)
    ctx.fill()
    ctx[CP]()
  }
  // Mover jugadores
  mp = () => {
    // Mover jugador de la izquierda
    if( leftMoving ) {
      leftTop += leftSpeed
      // Impedir que se salga por arriba
      if( leftTop - M.abs(leftSpeed) < 1 ) leftTop = 1
      // Impedir que se salga por abajo
      if( leftTop + M.abs(leftSpeed) + playerLength > canvasH - 2 ) leftTop = canvasH - playerLength - 2
    }
    // Mover jugador de la derecha
    if( rightMoving ) {
      rightTop += rightSpeed
      // Impedir que se salga por arriba
      if( rightTop - M.abs(rightSpeed) < 1 ) rightTop = 1
      // Impedir que se salga por abajo
      if( rightTop + M.abs(rightSpeed) + playerLength > canvasH - 2 ) rightTop = canvasH - playerLength - 2
    }
  }
  // Pintar la posicion de la bola
  pb = () => {
    ctx[FS] = ballColor
    ctx[BP]()
    ctx.arc(ballX, ballY, ballSize, 0, 2 * M.PI)
    ctx.fill()
    ctx[CP]()
  }
  // Mover la bola por el tablero
  bm = () => {
    if( ballIsMoving ) {
      ballX += ballSpeedX
      ballY += ballSpeedY
      if( (ballX + (middleBall) >= canvasW - 1) || (ballX + (middleBall) >= (canvasW - 20) && ballY > rightTop && ballY < rightTop+playerLength ) ) ballSpeedX = -M.abs(ballSpeedX)
      else if((ballX - (middleBall) <= 0) || (ballX - (middleBall) <= 18 && ballY > leftTop && ballY < leftTop+playerLength )) ballSpeedX = M.abs(ballSpeedX)
      if( ballY + (middleBall) + 2 >= canvasH - 2 ) ballSpeedY = -M.abs(ballSpeedY)
      else if( ballY - (middleBall) < 5 ) ballSpeedY = M.abs(ballSpeedY)
    }
    else if( !stop ) {
      if( turn == 'l' ) {
        ballX = 10 + 3 + ballSize
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
      ballSpeedX = M.abs(ballSpeedX)
    }
  }
  // Check right lost
  crl =  () => {
    if( ballX + middleBall > canvasW-14 ) {
      turn = 'r'
      ballIsMoving = 0
      ballSpeedX = -M.abs(ballSpeedX)
    }
  }
  // Bucle principal del Juego
  setInterval(() => {bc();pt();mp();pj();bm();pb();cll();crl();}, 6.66)
})(document)