# build dist folder
FROM node:trixie as build
WORKDIR /src/fe/
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# get nginx executable + dist folder + add custom config + remove default config
FROM nginx:trixie as final
COPY --from=build /src/fe/dist /usr/share/nginx/html
# remove default config
RUN rm /etc/nginx/conf.d/default.conf
# add custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
