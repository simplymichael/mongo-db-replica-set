#!/usr/bin/env bash

if [ ! -f /data/mongo-replicaset-init.flag ]; then
  echo "Init replicaset"
  touch /data/mongo-replicaset-init.flag
else
  echo "Replicaset already initialized"
fi
