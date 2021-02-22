FROM node:12

WORKDIR /app

RUN npm install -g lerna

COPY package.json /app
COPY package-lock.json /app
COPY lerna.json /app

# COPY packages/client/package.json /app/packages/client/
# COPY packages/client/package-lock.json /app/packages/client/

COPY packages/contract/package.json /app/packages/contract/
COPY packages/contract/package-lock.json /app/packages/contract/

COPY packages/search/package.json /app/packages/search/
COPY packages/search/package-lock.json /app/packages/search/

COPY packages/landing/package.json /app/packages/landing/
COPY packages/landing/package-lock.json /app/packages/landing/

COPY packages/index/package.json /app/packages/index/
COPY packages/index/package-lock.json /app/packages/index/

# RUN lerna bootstrap 

COPY packages/client/package.json /app/packages/client/
COPY packages/client/package-lock.json /app/packages/client/
COPY packages/client/craco.config.js /app/packages/client/

# RUN lerna link

# WORKDIR /app/packages/client

# RUN lerna la
# ignore fsevents error
RUN lerna bootstrap --hoist -- --no-optional; exit 0

# RUN lerna add contract packages/client
# RUN lerna add landing packages/client
# RUN lerna add search packages/client

# RUN lerna bootstrap --hoist -- --no-optional



# Copies everything over to Docker environment
COPY . /app
 
# Uses port which is used by the actual application

# WORKDIR /app/package/client

RUN cd packages/client && npm run start
# CMD [ "npm", "start" ]



# RUN cd packages/client && npm run start


# RUN npm install -f --no-optional


# COPY package.json lerna.json package-lock.json /app/
# COPY packages/contract /app/packages/contract
# COPY packages/index /app/packages/index
# COPY packages/landing /app/packages/landing
# COPY packages/search /app/packages/search

# WORKDIR /app/packages/client

# RUN npm install -f --no-optional

# WORKDIR /app

# RUN lerna bootstrap

# COPY packages/client /app/packages/client

# npx lerna clean -y && npx lerna bootstrap --hoist


# WORKDIR /app/packages/client

# RUN npm install --no-optional

# WORKDIR /app

# RUN lerna bootstrap --hoist

# COPY . /home/app/
# RUN cd packages/alice && npm run build

