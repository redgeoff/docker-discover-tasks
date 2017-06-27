# docker-discover-tasks

[![Greenkeeper badge](https://badges.greenkeeper.io/redgeoff/docker-discover-tasks.svg)](https://greenkeeper.io/)

Distributed discovery of docker service tasks


Design
---

- Exposes the `GET <hostname>:<port>/register` API to allow a host to register their hostname and IP address in `/etc/hosts`. `register` also returns the hostname of the host running the API
- On start up, queries `<service-name>.<task-id>` to retrieve a list of all the IP addresses of the tasks. Uses the `register` API to register the local hostname and local IP address with the remote host. The returned remote hostname is registered in the local `/etc/hosts` file.
- The result is that all tasks (hosts) have an eventually consistent `/etc/hosts` file that points to all other tasks. Moreover, if a task dies and is restarted, the restarted task will eventually update all the other tasks with the latest IP address.
- All API requests are fault-tolerant and will retry if the service is not yet available
- All writes and reads to `/etc/hosts` are synchronized
