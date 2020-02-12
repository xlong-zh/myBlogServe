FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
#如果在中国环境下构建请把下面注释打开
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]