FROM node:10-slim as build

# copy the app
WORKDIR /usr/src/app
COPY . /usr/src/app/

# install node modules
RUN yarn install --ignore-engines

# build the app
RUN yarn run build

# drop node modules after build
RUN rm -rf ./node_modules

# use nginx to build the second stage
FROM nginx:1.13.12-alpine

# copy default nginx configuration and replace args with the values via envsubst
COPY --from=build /usr/src/app/nginx.conf /data/conf/nginx.conf

# copy static files
COPY --from=build /usr/src/app/public /usr/share/nginx/html

# run the nginx
CMD ["nginx", "-c", "/data/conf/nginx.conf", "-g", "daemon off;"]
EXPOSE 80
