FROM  node:20.11.0
WORKDIR /app
RUN git clone https://github.com/Yupher/yupherchat.git ping
RUN cd ping
RUN npm install
RUN npm install -g pm2
ENV PORT=5000
EXPOSE 5000
CMD [ "pm2" "backend/app.js" ]