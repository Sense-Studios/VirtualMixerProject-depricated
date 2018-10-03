var express = require('express');
var router = express.Router();

/* Return data for io. */
router.get('/', function(req, res, next) {

  console.log('this is io')
  //console.log( express )

  var myObj = {"foo":"bar"}



  res.send(myObj)
  /*
  res.render( 'io', {
    title: 'IO EXPRESS'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
  */
});


module.exports = router;
