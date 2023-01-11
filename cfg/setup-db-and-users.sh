#!/usr/bin/env bash

if [ ! -f /data/mongo-replicaset-init.flag ]; then

  echo "**********************************************"
  echo "Creating database: \"$DATABASE_NAME\" and users: \"${ROOT_USERNAME}\", \"${NON_ROOT_USERNAME}\" .."
  echo create-db-users.sh time now: `date +"%T" `

  mongo --host "$REPLICA_SET_NAME/$PRIMARY_HOST,$SECONDARY_HOST,$TERTIARY_HOST" <<EOF

  var rootUser = '$ROOT_USERNAME';
  var rootPassword = '$ROOT_PASSWORD';
  var user = '$NON_ROOT_USERNAME';
  var passwd = '$NON_ROOT_PASSWORD';

  db.createUser({
   user: rootUser,
   pwd: rootPassword,
   roles: [
     { role: "root",                 db: "admin" },
     { role: "userAdminAnyDatabase", db: "admin" },
     { role: "dbAdminAnyDatabase",   db: "admin" },
     { role: "readWriteAnyDatabase", db: "admin" },
     { role: "clusterAdmin",         db: "admin" }
   ]
  });

  db.createUser({
    user: user,
    pwd: passwd,
    roles: [ { role: "readWrite", db: "${DATABASE_NAME}" } ]
  });

EOF

  echo "Done creating users."
  echo "**********************************************"

else
  echo "Replicaset already initialized"
fi
