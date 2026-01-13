#!/bin/bash

docker build  -t benten.ca-img -f- . <<'EOF'
FROM node:24-slim
RUN apt-get update && apt-get install -y openssh-server sudo && \
    mkdir /var/run/sshd && \
    echo 'root:devpassword' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
WORKDIR /app
COPY . .
EXPOSE 8000 22
CMD service ssh start && /bin/bash
EOF

docker run -it --rm \
  -p 8000:8000 \
  -p 2222:22 \
  -v ".:/app" \
  -v /app/node_modules \
  -e NODE_ENV=development \
  benten.ca-img
