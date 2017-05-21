
TODO

docker swarm init --advertise-addr <MANAGER-IP>

docker network create \
  --driver overlay \
  --subnet 10.0.9.0/24 \
  --opt encrypted \
  couchdb-network

docker service create --replicas 2 --name couchdb --network couchdb-network \
  -p 5984:5984 \
  -e COUCHDB_COOKIE="mycookie" \
  -e COUCHDB_USER="admin" \
  -e COUCHDB_HASHED_PASSWORD="-pbkdf2-b1eb7a68b0778a529c68d30749954e9e430417fb,4da0f8f1d98ce649a9c5a3845241ae24,10" \
  -e COUCHDB_SECRET="mysecret" \
  -e NODENAME="{{.Service.Name}}{{.Task.Slot}}" \
  -e SERVICE_NAME="{{.Service.Name}}" \
  --hostname="{{.Service.Name}}{{.Task.Slot}}" \
  redgeoff/docker-discover-tasks-couchdb
