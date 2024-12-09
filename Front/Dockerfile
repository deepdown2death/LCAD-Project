FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 3300

RUN yarn global add serve

CMD ["serve", "-s", "dist", "-p", "3300"]
