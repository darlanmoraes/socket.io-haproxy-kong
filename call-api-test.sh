curl -X POST -v \
-d "name=node-app.service" \
'http://localhost:8010/upstreams'

# add two targets to the upstream
curl -X POST -v \
-d "target=node-app-1.3000" \
-d "weight=100" \
'http://localhost:8010/upstreams/node-app.service/targets'

curl -X POST -v \
-d "target=node-app-2:3000" \
-d "weight=100" \
'http://localhost:8010/upstreams/node-app.service/targets'

curl -X POST -v \
-d "name=node-app-service" \
-d "hosts=www.node-app-1.com,www.node-app-2.com" \
-d "upstream_url=http://node-app.service" \
'http://localhost:8010/apis/'

curl -X GET -v \
-H "Host: www.node-app-1.com" \
'http://kong-1:8000/rooma'

curl -v -X GET \
"http://localhost:8010/apis/www.node-app-1.com"