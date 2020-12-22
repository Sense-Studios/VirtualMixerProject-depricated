var Utils = function() {
  var _self = this

  _self.get = function( _url, _callback ) {
    // jQuery
    // $.get('//example.com', function (data) {
      // code
    // })


    // Vanilla
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function( data ) {
      // code
      if (httpRequest.readyState == 4) {
          // The request is done; did it work?
          if (httpRequest.status == 200) {
              // ***Yes, use `xhr.responseText` here***
              console.log(httpRequest)
              _callback(httpRequest.responseText);
          } else {
              // ***No, tell the callback the call failed***
              _callback(null);
          }
      }
    }
    httpRequest.open('GET', _url)
    httpRequest.send()
  }

  _self.post = function( _url, _options, _callback ) {
    // jQuery
    //$.post('//example.com', { username: username }, function (data) {
      // code
    //})

    // Vanilla
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function (data) {
      // code
      if(httpRequest.readyState === 4 && httpRequest.status === 200) {
        //console.log(httpRequest.responseText);
        _callback(data)
      }
    }

    httpRequest.open('POST', _url)
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    //httpRequest.send('username=' + encodeURIComponent(username))
    httpRequest.send(_options)
  }
}

var utils = new Utils();
