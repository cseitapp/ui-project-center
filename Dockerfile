FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY ./package.json /app/

## Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . /app
COPY .env.production .env

# Build the application
RUN npm run build



# Define environment variables
ENV HOST=0.0.0.0 NODE_ENV=production
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 2000

# Start the application
CMD ["npm", "run", "start"]