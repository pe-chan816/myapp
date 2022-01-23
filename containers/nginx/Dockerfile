FROM nginx:1.18

RUN apt-get update -qq && \
    apt-get install -y vim && \
    apt-get clean
RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/*
COPY ./containers/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./containers/nginx/develop.conf /etc/nginx/conf.d/develop.conf
COPY ./containers/nginx/production.conf /etc/nginx/conf.d/production.conf
COPY ./frontend/myapp/ /myapp/react/
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
EXPOSE 80
