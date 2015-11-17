# eTutorial
An online tool for conducting tutorial/recitation classes

## Application Platform
* NodeJS
* Socket.io
* WebRTC

## Team
* Bao Xiao
* Chen Di
* Huang Liuhaoran
* Huang Ziyu
* Phan Shi Yu

## Supervisor
* Wei Tsang Ooi
* Jay Chua

## Usage
* NPM Install forever
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
