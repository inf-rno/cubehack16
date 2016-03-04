FROM node:5.6

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
RUN npm install --production --no-optional

# Copy code
COPY . /app

# Switch to non root user
RUN useradd -ms /bin/bash node && \
	chown -R node /app
USER node

# Start the server
CMD [ "npm", "start" ]