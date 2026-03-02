#Running different containers for backend and frontend

FROM node:20

WORKDIR /app-backend

#Copy package.json + package-lock.json files from backend dir to current dir
COPY package*.json ./
RUN npm install

#copy all files from backend to current dir 
COPY ./ ./

EXPOSE 5000

CMD ["npm", "run", "start"]

#then build phase
#docker build -t <image-name> . (where your docker file is, u give that path)
#run the container with port mapping
#docker -d -p <local-machine-port>:5000 <img name>