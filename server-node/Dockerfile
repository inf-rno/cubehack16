FROM node:5.6

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
RUN npm install --production --no-optional

# Copy code
COPY . /app

# start the server
CMD [ "npm", "start" ]