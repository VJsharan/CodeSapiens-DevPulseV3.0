FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install a simple static server
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the static server serving current directory
CMD ["serve", "-s", ".", "-l", "3000"]
