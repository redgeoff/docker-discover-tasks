#!/bin/bash

# Adaptation of https://docs.docker.com/engine/admin/multi-service_container/

# Start the first process
/discover-tasks.sh &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start discover-tasks: $status"
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
  PROCESS_1_STATUS=$(ps aux |grep -q discover_tasks |grep -v grep)
  PROCESS_2_STATUS=$(ps aux |grep -q base_process | grep -v grep)
  # If the greps above find anything, they will exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit -1
  fi
  sleep 60
done
