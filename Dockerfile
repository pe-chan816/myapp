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
WORKDIR /myapp_test
COPY Gemfile /myapp_test/Gemfile
COPY Gemfile.lock /myapp_test/Gemfile.lock
RUN bundle install
COPY . /myapp_test
RUN mkdir -p /myapp_test/tmp/sockets
EXPOSE 3000
