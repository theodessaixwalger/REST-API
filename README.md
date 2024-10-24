# REST-API

Ce projet est une API REST permettant de gérer des items et des catégories dans une base de données MySQL. Il utilise Express.js et interagit avec MySQL via des requêtes CRUD (Create, Read, Update, Delete). Il faudra créer 2 bases de données sur PHPMyAdmin. Pour tester et simuler le programme on utilisera l'application Postman.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (v14+) (aide d'installation en dessous)

- **MySQL** (v5.7+) (aide d'installation en dessous)

- **Mamp** (application)

## Structure des fichiers

- **.gitignore** : Permet de dire quel fichier/dossier doit être ignorés

- **index.js** : Fichier principal qui contient toutes les routes et la connexion à la base de données

- **README.md** : Permet de comprendre le projet, d'avoir le procédé d'installation et d'utilisation

## Installation

Pour installer ce projet, suivez ces étapes :

- Ouvrez le terminal de votre éditeur de code

Tapez cette commande pour cloner le dossier sur votre ordinateur :
- git clone git@github.com:theodessaixwalger/REST-API.git

Allez dans le dossier où vous avez clone le dossier puis tapez ces commandes :
- npm i express
- npm i nodemon
- npm i mysql

Une fois que tout est installé tapez la commande :
- npm start

## Test

- Dans Postman créer un url en fonction de la requête voulu (get, post, update, delete)
- Dans l'url mettre "http://localhost:3000/NOM_DE_LA_ROUTE"
