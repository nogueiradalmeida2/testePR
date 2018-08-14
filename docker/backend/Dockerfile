FROM node:8
MAINTAINER SuporteInfraAplicacoes <suporte-infra-aplicacoes@bndes.gov.br>

RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_auth


RUN \
# Update the apt packet repos
    apt-get update && \ 
# Install supervisor
    apt-get install -yq \
        supervisor syslog-ng && \ 
# Clean up and set timezone
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5 && \
    echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list && \
    apt-get update && \
    apt-get install -y mongodb-org


#RUN npm config set proxy ${http_proxy} && \
#    npm config set https-proxy ${https_proxy} && \
# RUN npm config set registry http://nexus.bndes.net:8180/nexus/repository/npmjs-registry/ && \
#    npm config set @bndes:registry http://nexus.bndes.net:8180/nexus/repository/npm-snapshot/ && \
#   npm config set _auth ${npm_auth} && \
#   npm config set always-auth true

# RUN npm -g install truffle

COPY ./rootfs/ /

# Build info
RUN echo "$(sed -n 's/PRETTY_NAME="\(.*\)"/\1/p' /etc/os-release) image. ($(uname -r))" >> /root/.built && \
    echo "- with $(java -version 2>&1 | awk 'NR == 2')" >> /root/.built

# backend
EXPOSE 8080

ENTRYPOINT ["/usr/local/sbin/init"]




