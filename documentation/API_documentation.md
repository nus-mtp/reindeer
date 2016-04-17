# API Documentation

We have provided offline static API documentation HTML server for developers.

To use the API documentation, please read the following instructions.


* Install [JSdoc](https://www.npmjs.com/package/jsdoc) globally.
```bash
$ npm install -g jsdoc
```

* Install the development dependencies under project root (finalhandler and serve-static).
```bash
$ npm install
```

* Run compilation under project root and serve the page.
```bash
$ npm run docs
```

* API documentation page will be served at port 8080.

* Now you may visit http://localhost:8080 to view the API documentations.
