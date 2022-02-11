FROM nginx

COPY ./dist /usr/share/nginx/html/

COPY ./src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]