FROM ruby:2.6.6
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && \
    apt-get install -y apt-utils \
            build-essential \
            default-mysql-client \
            vim
RUN curl -SL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs \
                       yarn
RUN apt-get clean
WORKDIR /myapp
COPY ./backend/Gemfile /myapp/Gemfile
COPY ./backend/Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY ./backend /myapp
RUN mkdir -p /myapp/tmp/sockets
RUN mkdir -p /myapp/tmp/pids
VOLUME ["/myapp/tmp"]
VOLUME ["/myapp/public"]
RUN yarn install --check-files
RUN yarn upgrade
