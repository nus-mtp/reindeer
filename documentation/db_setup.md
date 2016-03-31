# Database setup

**MySQL** is been used as the database

To setup database on local machine, first download and install MySQL locally

### 1. Setup database account

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

### 2. Create database

Create a database with name `sample_database_name`


### 3. Add database configuration to `config.json`

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
