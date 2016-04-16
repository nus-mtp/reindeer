## Usage

* NPM Install node modules under project root
  ```bash
  $ npm install
  ```

* NPM Install [forever](https://www.npmjs.com/package/forever)
  ```bash
  $ npm install -g forever
  ```
* Install package dependency

  `Ubuntu`
  ```bash
  $ sudo apt-get -qq update
  $ sudo apt-get install -y imagemagick --fix-missing
  $ sudo apt-get install -y ghostscript
  $ sudo apt-get install -y poppler-utils
  ```

  `OSX`
  ```bash
  $ brew install imagemagick
  $ brew install ghostscript
  $ brew install poppler
  ```

* Databse setup
  see [db_setup.md](db_setup.md)

* Put the config.json under app root directory,
  current configurations include
  ```json
  {
    "server-ip": "your server ip or host name",
    "server-port": "your server port",
    "apikey": "IVLE API Key",
    "db-host": "your database host",
    "db-dialect": "'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'",
    "db-name": "your database name",
    "db-username": "your database username",
    "db-password": "your database password",
    "jwt-secret": "your jwt secret"
  }
  ```

* Start within console line
  ```bash
  $ npm start
  ```

* Alternatively, you can start the server with forever
  ```bash
  $ forever start -c "npm start" ./
  ```

* Stop the server with forever
  ```bash
  $ forever stop -c "npm start" ./
  ```
