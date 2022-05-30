FROM nginx:1.18

RUN apt-get update -qq && \
    apt-get install -y vim && \
    apt-get clean
RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/*
COPY ./containers/nginx-front/nginx.conf /etc/nginx/nginx.conf
COPY ./containers/nginx-front/front.conf /etc/nginx/conf.d/front.conf
COPY ./frontend/myapp/ /myapp/react/
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
