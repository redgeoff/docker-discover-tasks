FROM redgeoff/redgeoff-couchdb-docker

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - \
  && apt-get install -y nodejs \
  && npm install npm -g

# TODO: or need to use supervisord
# RUN apt-get install -y systemd
# RUN apt-get install -y supervisor

# TODO: install docker-discover-tasks
# RUN npm install docker-discover-tasks

COPY base-process.sh /base-process.sh
COPY discover-tasks.sh /discover-tasks.sh
COPY wrapper.sh /wrapper.sh

#ENTRYPOINT ["tini", "--", "/wrapper.sh"]
#CMD ["/home/couchdb/couchdb/bin/couchdb"]
CMD ["/wrapper.sh"]
