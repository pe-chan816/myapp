FROM nginx:1.18

RUN apt-get update -qq && \
    apt-get install -y vim && \
    apt-get clean
RUN rm -f /etc/nginx/conf.d/*
COPY ./containers/nginx/myapp.conf /etc/nginx/conf.d/myapp.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
EXPOSE 80
