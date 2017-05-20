#!/bin/bash

while /bin/true; do
  echo "nice $@" >> /tmp.log
  sleep 60
done
