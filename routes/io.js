var express = require('express');
var router = express.Router();

router.setIo = function(_io ) {
  router.io = _io
}

var myObj = {"foo":"bar"}

var sheets = [
  [
    [  1, 15,  0,  0,  0,  0,  0  ],    // 1 | MIX04 POD 00 | MIX04 MIX 03 | MIX04 BLN 02 | ..... ... .. |
    [  0,  0,  0,  0,  0,  0,  0  ],    // 2 | ..... ... .. | ..... ... .. | ..... ... .. | ..... ... .. |
    [  0,  0,  0,  0,  0,  0,  0  ],    // 3 | ..... ... .. | ..... ... .. | MIX04 BLN 01 | ..... ... .. |
    [  0,  0,  0,  0,  0,  0,  0  ],    // 4 | ..... ... .. | ..... ... .. | ..... ... .. | ..... ... .. |

    

    [  0, 16,  0,  0,  0,  0,  0  ],    //     SWI01 TGL   0
    [  0,  0,  0,  0,  0,  0,  0  ],    //     BPM00 SET 128
    [  0,  0,  0,  0,  0,  0,  0  ],    //     FIL02 CHG
    [  0,  0,  0,  0,  0,  0,  0  ],    //     GIF02 CHG

    [  2, 15,  0,  0,  0,  0,  0  ],    //     SOL02 RGB FFF
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],

    [  0, 15,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],
    [  0, 15,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],

    // ----------------------------

    [  1, 15,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],

    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],

    [  2, 15,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],

    [  0, 15,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0, 16,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ]
  ]
]

/*
app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
});
*/

/* Return data for io. */
router.post('/', function (req, res) {
  // uipdate sheetsres.send('POST request to the homepage')
  // something something res
  console.log("got post,", req.body)

  sheets = JSON.parse( req.body.sheets )
  //sheets = req.body.sheets
  router.io.emit('command', {'command': 'updatesheets', "payload": req.body })
  res.send("ok")
})

router.get('/', function(req, res, next) {

  //  console.log(msg)
    //$('#messages').append($('<li>').text(msg));
  router.io.emit('command', 'ping')
  console.log('this is io')
  //console.log( express )



  res.send(sheets)
  /*
  res.render( 'io', {
    title: 'IO EXPRESS'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
  */
});


module.exports = router;
