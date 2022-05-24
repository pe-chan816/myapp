FROM nginx:1.18

RUN apt-get update -qq && \
    apt-get install -y vim && \
    apt-get clean
RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/*
COPY ./containers/nginx-api/nginx.conf /etc/nginx/nginx.conf
COPY ./containers/nginx-api/api.conf /etc/nginx/conf.d/api.conf
COPY ./containers/nginx-api/production.conf /etc/nginx/conf.d/production.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
