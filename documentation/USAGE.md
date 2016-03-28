## Usage
* NPM Install node modules under project root
  ```bash
  $ npm install --save
  ```

* NPM Install [forever](https://www.npmjs.com/package/forever)
  ```bash
  $ npm install -g forever
  ```

* Databse setup
  see [db_setup.md](db_seteup.md)

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
    "server-ip": -your server ip or host name,
    "server-port": -your server port,
    "apikey": -IVLE API Key,
    "db-host": -your database host,
    "db-dialect": 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',
    "db-name": -your database name,
    "db-username": -your database username,
    "db-password": -your database password,
    "jwt-secret": -your jwt secret
  }
  ```
