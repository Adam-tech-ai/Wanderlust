# Use Node.js as the Backend runtime:
FROM node:26

# Set the working directory inside the container:
WORKDIR /app

# Copy package files first:
COPY package*.json ./

# Install Backend dependencies:
RUN npm ci

# Copy the Backend source code:
COPY . .

# Expose Backend port:
EXPOSE 4000

# Start the Backend:
CMD ["npm", "start"]