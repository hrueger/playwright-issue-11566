FROM mcr.microsoft.com/playwright:focal

WORKDIR /app
COPY . ./
RUN npm install 
EXPOSE 8080
CMD    ["npm", "run", "production"]