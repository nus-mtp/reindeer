## Usage
* NPM Install node modules under project root
  ```bash
  $ npm install --save
  ```
	
* NPM Install [forever](https://www.npmjs.com/package/forever)
  ```bash
  $ npm install -g forever
  ```
  
* Start the server
  ```bash
  $ cd etutorial/
  $ forever start -c "npm --c=config.json start" ./
  ```
  
* Stop the server
  ```bash
  $ forever stop -c "npm --c=config.json start" ./
  ```
  
* Start within console line
  ```bash
  $ npm start
  ```
  
* Start with arguments & configuration file

  with json configuration file
  ```bash
  $ npm --c=xxx.json start
  ```
  
  current configuration included
  ```
  {
    "server-ip":"localhost",
    "express-port":3000
  }
  ```