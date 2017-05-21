#!/bin/bash

while /bin/true; do
  docker-discover-tasks -s $SERVICE_NAME -p 3000
done
