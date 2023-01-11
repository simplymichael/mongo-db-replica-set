# MongoDB Replica Set

Setup a MongoDB Replica Set.

## Tech stack 
- Node v16.15.1
- NPM 8.12.1
- Docker Compose 

## Prerequisites 
- Make sure you have Docker and Docker Compose installed
- Install dependencies by running `npm install`
- Copy and edit the **.env.example** file to **.env** file

## Running
- **Via NPM:** `npm run db:up`
- **Via direct docker command:** `docker-compose up -d`


## Logging into the docker containers and the DB
- **Via NPM:**
    - Run `npm run db:login <target_container> [command]`
      This will log you into the home directory of the container specified by the `target_container` argument. 
      Available target containers are `primary`, `secondary`, and `tertiary`. 
  
      The `primary` container acts as the primary (or master) for the replica set.
      The `secondary` and `tertiary` containers are the secondary (or slave) for the replica set.

      Once inside the container, run `mongo` to log into the database.
      Then, from inside the database run `use DB_NAME`, 
      where `DB_NAME` is the database name specified in the *.env* file.
      If you'd rather log directly into the database, specify `mongo` as the `[command]` option: <br />
      `npm run db:login <target_container> mongo`. 

      Supported commands are `bash` (the default) and `mongo`.
      The `mongo` command does not work for the `proxy` container. 
      Since it only serves to help us connect to the other containers 
      for initial setup of the replica set and for subsequent tasks such as backing up the DB, 
      we did not expose its port to the outside world. 

      **NOTE:** In place of *primary*, *secondary*, *tertiary*, and *proxy*, 
      you can use *1*, *2*, *3*, and *4* respectively instead.
      The default is *primary*, the replica set master.

## Stopping the containers 
- **Via NPM:**
    - Stop the services but preserve the containers and data directory: `npm run db:stop`
    - Stop the services and delete the containers: `npm run db:destroy`
- **Via direct docker commands:** 
    - Stop the services but preserve the containers and data directory: `docker-compose stop`
    - Stop the services and delete the containers: `docker-compose down`

There's no equivalent for deleting the data directory. 
To delete the data directory, use the NPM commands as stated above 
or manually delete the `.data` directory.

## To view logs
- Run `docker-compose logs -f [OPTIONAL_SERVICE_NAME]`


## Important notes
To start completely afresh,
delete the **/.data/mongodb/** directory directory.
