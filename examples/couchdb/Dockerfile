FROM klaemo/couchdb:latest

# Install nodejs & systemd
# RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - \
#  && apt-get install -y nodejs \
#  && npm install npm -g

# TODO: or need to use supervisord
# RUN apt-get install -y systemd
# RUN apt-get install -y supervisor

# TODO: install docker-discover-tasks
# RUN npm install docker-discover-tasks

COPY ./cmd.sh /cmd.sh

ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
CMD ["/opt/couchdb/bin/couchdb"]
# CMD ["/cmd.sh"]

# CMD ["echo", "foo"]
