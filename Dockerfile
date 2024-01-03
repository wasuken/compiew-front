FROM node:20-alpine
WORKDIR /usr/app

COPY . .
RUN npm i

# ENTRYPOINT ["/bin/sh", "-c", "while :; do sleep 10; done"]
CMD ["npm", "start"]
