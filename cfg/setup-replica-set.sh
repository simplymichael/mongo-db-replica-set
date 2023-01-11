#!/usr/bin/env bash

if [ ! -f /data/mongo-replicaset-init.flag ]; then

  echo "**********************************************"
  echo "Replica set setup started.."
  echo SETUP.sh time now: `date +"%T" `

  mongo --host "${PRIMARY_HOST}" <<EOF
  var cfg = {
    "_id": "$REPLICA_SET_NAME",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "$PRIMARY_HOST",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "$SECONDARY_HOST",
            "priority": 0
        },
        {
            "_id": 2,
            "host": "$TERTIARY_HOST",
            "priority": 0
        }
    ],
    settings: {
      chainingAllowed: true
    }
  };

  rs.initiate(cfg, { force: true });
  rs.reconfig(cfg, { force: true });
  rs.secondaryOk();
  db.getMongo().setReadPref('nearest');
  db.getMongo().setSecondaryOk();
EOF

  echo "Replica set setup completed."

else

  echo "Replicaset already initialized"

fi
