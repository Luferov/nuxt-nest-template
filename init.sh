#!/bin/bash

yarn
cd server && cp .env.example .env && cd ..
cd client && cp .env.example ../.env && cd ..

ln -s ./server/.env .env

echo 'Input this secret key in server/.env file'
echo 'SECRET_KEY =' "$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")"
