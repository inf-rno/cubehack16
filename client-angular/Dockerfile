FROM node:5.6

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ["./package.json", "./bower.json", "./.bowerrc", "/app/"]
RUN npm install --no-optional --unsafe-perm

# Copy code
COPY . /app

# build the app into the build dir
CMD [ "npm", "run", "build" ]