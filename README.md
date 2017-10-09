# Socket IO With HAProxy And Kong Blue/Green

The objective of this project is to use sockets to create a simple chat over 2 proxy levels and keep the connections working.

I've made some tests and for me it was proven as a possible solution to high scalable environments under high load.

This repository contains a complete solution with Node.JS and Socket.IO that can be used as reference.

I've included a simple chat that can be accessed through browser to demonstrate the funcionality.

# Architecture
The following diagram shows how the infraestructure was built. Everything can be found inside the file ```docker-compose.yml```.

![alt tag](Socket%20IO.png)

# How Can I Run?
Please follow the next steps to get ir working. First of all, be sure that you have all the recquirements:
* docker-ce;
* docker-compose;
* At least 8Gb of RAM disponible(we are starting many machines);
* The project;

The following commands will start all containers:
```
git clone git@github.com:darlanmoraes/socket.io-haproxy-kong.git
cd socket.io-haproxy-kong
docker-compose -f docker-compose.yml up
```

The following commands will create the api(blue/green) inside the Kong.

```
# create the service inside kong
curl -X POST -v \
-d "name=node-app.service" \
'http://localhost:8010/upstreams'

# create one of the servers inside the kong service
curl -X POST -v \
-d "target=node-app-1.3000" \
-d "weight=100" \
'http://localhost:8010/upstreams/node-app.service/targets'

# create another of the servers inside the kong service
curl -X POST -v \
-d "target=node-app-2:3000" \
-d "weight=100" \
'http://localhost:8010/upstreams/node-app.service/targets'

# set all hosts that can handle requests for the servers
curl -X POST -v \
-d "name=node-app-service" \
-d "hosts=www.node-app-1.com,www.node-app-2.com" \
-d "upstream_url=http://node-app.service" \
'http://localhost:8010/apis/'
```

Now we can create a little shortcut inside our SO to send requests through the correct hosts(or we can pass the headers):
```
# add the following lines to /etc/hosts file
127.0.1.1	www.node-app-1.com
127.0.1.1	www.node-app-2.com
```

After these steps, we can open the browser and access the following addresses to chat:

```
http://node-app-1.com/rooma
http://node-app-1.com/roomb
```