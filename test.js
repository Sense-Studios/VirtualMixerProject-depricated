const express = require('express')
const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Example app listening on port 3000! Run your tests!'))

/*
  each Source:
    check existance
      - init
      - update
      - render
    check interface
      - set src
      - play
      - pause
      - currentTime
      - currentFrame
      - duration
      - load source
*/
