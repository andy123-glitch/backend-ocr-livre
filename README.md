# Backend OCR Livre

Il s'agit de l'API backend pour le projet OCR Livre. Développée avec Node.js et Express, cette API permet de gérer des utilisateurs (authentification) et des livres, avec un traitement d'images sans doute pensé pour l'OCR (Optical Character Recognition).

## 🚀 Technologies utilisées

- **Node.js** & **Express.js** : Framework backend.
- **MongoDB** & **Mongoose** : Base de données NoSQL.
- **Bcrypt** & **JsonWebToken (JWT)** : Sécurité et authentification des mots de passe/sessions.
- **Multer** & **Sharp** : Gestion et optimisation des uploads d'images.
- **Docker** : Conteneurisation de la base de données (MongoDB & Mongo Express).

## 📁 Structure du projet

- `app.js` : Configuration principale de l'application Express.
- `server.js` : Point d'entrée du serveur (écoute sur le port 4000 par défaut).
- `controllers/` : Logique métier de l'application (`auth`, `books`, etc.).
- `routes/` : Définition des endpoints de l'API (`/api/auth`, `/api/books`).
- `models/` : Schémas de base de données Mongoose.
- `middlewares/` : Middlewares Express (authentification, gestion des fichiers multer, etc.).
- `images/` : Dossier contenant les images uploadées.

## 🛠️ Installation et prérequis

1. **Prérequis** :
   - Node.js installé sur votre machine.
   - Docker (pour faire tourner la base de données) ou une instance MongoDB distante.

2. **Cloner le projet** et accéder au dossier racine (`backend-ocr-livre`) :
   ```bash
   cd backend-ocr-livre
   ```

3. **Installer les dépendances** :
   ```bash
   npm install
   ```

## 🔐 Variables d'environnement

Ce projet nécessite un fichier `.env` à la racine pour fonctionner.
Créez un fichier `.env` et ajoutez-y la configuration de la base de données (comme définie dans `app.js`) :
```env
PORT=4000
DATABASE_URL=mongodb://root:example@localhost:27017/nom_de_votre_bdd?authSource=admin
JWT_SECRET=votre_secret_jwt
```
Assurez-vous d'ajouter vos clés secrètes si certaines sont utilisées pour la génération du token JWT.

## 🐳 Base de données avec Docker

Le projet inclut un fichier `docker-compose.yaml` pour lancer facilement une instance MongoDB locale ainsi que son interface d'administration (Mongo Express).

1. **Lancer les conteneurs** :
   ```bash
   docker-compose up -d
   ```
2. **Accéder à Mongo Express** :
   Ouvrez votre navigateur à l'adresse `http://localhost:8081`.
   - **Identifiant** : `mongoexpressuser`
   - **Mot de passe** : `mongoexpresspass`

## ▶️ Démarrage du serveur

Pour lancer le serveur Node.js, vous pouvez utiliser la commande suivante :

```bash
# Avec Node classique
node server.js

# Ou avec npx (pour avoir le rechargement à chaud grâce à nodemon)
npx nodemon server.js
```

Le serveur sera alors accessible à l'adresse `http://localhost:4000`.

## 📡 Endpoints principaux de l'API

- **Authentification** : `/api/auth` (probablement `POST /signup`, `POST /login`)
- **Livres** : `/api/books` (CRUD pour les livres, incluant l'upload d'images de couverture/contenu avec `multer`)

---
> Ce fichier a été généré sur la base de la configuration et de la structure du projet initial.
