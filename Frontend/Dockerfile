# Use Node.js to build the Frontend:
FROM node:26

# Set the working directory inside the container:
WORKDIR /app

# Copy package files first:
COPY package*.json ./

# Install Frontend dependencies:
RUN npm ci

# Copy the Frontend source code:
COPY . .

# Build the React application:
RUN npm run build

# Expose Vite preview port:
EXPOSE 4173

# Run the built Frontend:
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]