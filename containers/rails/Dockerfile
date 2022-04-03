FROM ruby:2.6.6
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && \
    apt-get install -y apt-utils \
            build-essential \
            default-mysql-client \
            nodejs \
            vim \
            yarn && \
    apt-get clean
RUN yarn install --check-files
RUN yarn upgrade
WORKDIR /myapp
COPY ./backend/Gemfile /myapp/Gemfile
COPY ./backend/Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY ./backend /myapp
RUN mkdir -p /myapp/tmp/sockets
EXPOSE 3000
