FROM node:17-alpine
WORKDIR /usr/app

# node_modules周り
# ソースコピー -> npm i周り

ENTRYPOINT ["/bin/sh", "-c", "while :; do sleep 10; done"]
