FROM node:5.6

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
COPY ./bower.json /app
COPY ./.bowerrc /app

RUN npm install --no-optional

# Copy gulpfiles
COPY ./gulpfile.js /app
COPY ./gulptasks /app/gulptasks