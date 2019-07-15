
### Start

`$ npm start`

starts the app on port 3001. Runs in bin/www


### Build

`$ npm run build`

should return 4 files:

```
  mixer.js
  mixer-min.js
  vendor.js
  vendor-min.js
```

use it to build your own library

### Docs

`$ npm run docs`

Should build a whole lot of documents from the references in the code. Then copies that into the /public/docs/reference/ directory


### Generators

Generator are experimental. Be careful, in some scenarios you might be generating files under a different account then the app is running in.

With Generators you can bootstrap your mixers and controllers. It creates a set of files

```
  $ npm run generate_mixer my_new_mixer
  [...]
  writing  ./views/compositions/my_new_mixer.jade
  writing  ./public/compositions/my_new_mixer.js
  writing  ./public/stylesheets/compositions/my_new_mixer.sass

  $ npm run remove_mixer my_new_mixer
  [...]
  removing  ./views/compositions/my_new_mixer.jade
  removing  ./public/compositions/my_new_mixer.js
  removing  ./public/stylesheets/compositions/my_new_mixer.sass

  $ npm run generate_controller my_new_controller TODO
  $ npm run remove_controller my_new_controller TODO
```
