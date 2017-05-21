FROM redgeoff/redgeoff-couchdb-docker

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - \
  && apt-get install -y nodejs \
  && npm install npm -g

RUN npm install -g docker-discover-tasks

COPY base-process.sh /base-process.sh
COPY discover-process.sh /discover-process.sh
COPY wrapper.sh /wrapper.sh

CMD ["/wrapper.sh"]
