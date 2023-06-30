# ft_transcendence
Final Common Core Project at 1337 (42_cursus)

## Description

The aim of the project is to create a web application that will allow users to chat and play the PingPong game with eachothers.

## Stack

* Programming language : TypeScript
* Frontend : ReactJS
* Backend : NestJS
* Database : PostgreSQL

## Components

We focussed on three areas while working on this project:

### User Account

* Authentication using the OAuth system of 42 intranet
* Unique usernames
* Ability to edit the username and avatar
* Two-Factor authentication using an authenticator app such as `Google Authenticator`
* Friends management: add, remove, block
* Stats such as wins, losses, achievements and a match history

### Chat

* Chat rooms: public, private and password protected
* Direct messages
* Different user roles in channels: owner, administrator and standard user
 - channel owner: change channel type, set new administrators
 - administrator: can kick, ban or mute other users.
* Game invitation from chat interface

### Game

* Play live PingPong games with other players
* Matchmaking system
* Multiple maps and achievements

## Usage

Clone this repo, then copy `env.example` to `.env` and modify it.

```sh
git clone https://github.com/hrhirha/ft_transcendence.git
cd ft_transcendence
cp srcs/env.example srcs/.env
```

Make sure `docker` and `docker-compose` are intalled.

Finally run the following command:

```sh
docker-compose up --build
```

## Screenshots
[TODO]

## Demo
[TODO]

## Team

This work has been done by [Aimad Bahdir](https://github.com/AimadBahdir), [Walid Ben Said](https://github.com/wben-sai), [Ismail Bouhiri](https://github.com/ismailbouhiri) and [myself](https://github.com/hrhirha)
