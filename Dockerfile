FROM node

WORKDIR /usr/app

COPY package.json ./

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get update && apt-get install -y nodejs && npm install -g npm
RUN npm install -g yarn && apt-get update && apt-get upgrade -y

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]
