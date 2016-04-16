# Database setup

**MySQL** is been used as the database, we only support default port, which is 3306

To setup database on local machine, first download and install MySQL locally

### 1. Install MySQL
Ubuntu

```
$bash sudo apt-get install mysql-server
```
OSX
```
$bash brew install mysql
$bash mysql.server start
```
Windows please follow instruction on MySQL official site
https://dev.mysql.com/downloads/windows/


### 2. Setup database account

Create a new user for accessing the database. run the following 3 command:

```
CREATE USER 'sample_username'@'localhost' IDENTIFIED BY 'sample_password';
```

Grant user privilege:

```
GRANT ALL PRIVILEGES ON * . * TO 'sample_username'@'localhost';
```

Update database privilege

```
FLUSH PRIVILEGES;
```

the `sample_username` and `sample_password` would be used in the config.json for accessing the database

### 3. Create database

Create a database with name `sample_database_name`
```
CREATE DATABASE sample_database_name
```


### 4. Add database configuration to `config.json`

add the following things to config.json

``` json
config.json
------------------

{
  ...

  "db-host": "127.0.0.1",
  "db-dialect": "mysql",
  "db-name": "sample_database_name",
  "db-username": "sample_username",
  "db-password": "sample_password",
}

```
