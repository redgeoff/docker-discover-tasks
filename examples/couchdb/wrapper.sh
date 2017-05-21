#!/bin/bash

# Adaptation of https://docs.docker.com/engine/admin/multi-service_container/

# Start the first process
/discover-process.sh &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start discover-process: $status"
  exit $status
fi

# Start the base process
/base-process.sh &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start base-process: $status"
  exit $status
fi

# Naive check runs checks once a minute to see if either of the processes exited. The container will
# exit with an error

while /bin/true; do
  DISCOVER_STATUS=$(ps aux | grep discover-process | grep -v grep | wc -l)
  BASE_STATUS=$(ps aux | grep base-process | grep -v grep | wc -l)
  # If the greps above find anything, they will exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $DISCOVER_STATUS -ne 1 ]; then
    echo "discover-process has already exited."
    exit -1
  fi
  if [ $BASE_STATUS -ne 1 ]; then
    echo "base-processes has already exited."
    exit -1
  fi
  sleep 30
done
