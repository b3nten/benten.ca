FROM node:20-slim

# Install OpenSSH server
RUN apt-get update && apt-get install -y openssh-server sudo && \
    mkdir /var/run/sshd && \
    echo 'root:devpassword' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000 22

# Start SSH and then your app
CMD service ssh start && npm run dev
