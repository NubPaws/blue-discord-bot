FROM node:23-slim

WORKDIR /app

# Update the repositories and install curl.
# After download yt-dlp.
RUN apt-get update && apt-get install -y curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD [ "npm",  "run", "start" ]
