FROM nginx


##################################
# Corrigir timezone
##################################
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


ADD nginx.conf /etc/nginx/
ADD default.conf /etc/nginx/conf.d/

COPY ./www /usr/share/nginx/html

#Expondo as portas necessárias
EXPOSE 8000

