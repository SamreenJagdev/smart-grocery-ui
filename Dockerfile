FROM node:16.14-alpine3.14
WORKDIR /tmp/project/smart-grocery-ui
COPY . /tmp/project/smart-grocery-ui
# ENTRYPOINT UI-APP=/tmp/project/smart-grocery-ui/package.json npm install
RUN npm install
ENTRYPOINT npm start

