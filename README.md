# 📦 Adapi

API REST de La Remise — construite avec Node.js, Express et PostgreSQL (driver `pg`, sans ORM).

## 📝 Description

Adapi expose les données de La Remise (objets, catégories, dépôts, personnes) via une API REST en JSON. C'est le back-end qui sera repris en S15 pour AdaRemise, l'application complète avec son interface React.

## 🛠️ Technologies utilisées

- **Node.js** / **Express**
- **PostgreSQL** (driver `pg`, pas d'ORM)
- **Docker Compose** (base de données en local)
- **Client HTTP VS Code** (tests des routes)

## 📂 Structure du projet

```
adapi/
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md
├── db/
│   ├── docker-compose.yml
│   ├── migration_up.sql
│   ├── migration_down.sql
│   ├── seed.sql
│   └── queries.sql
├── requetes/
└── server/
    ├── server.js
    ├── db.js
    └── routes/
        ├── categories.js
        ├── objets.js
        ├── personnes.js
        ├── depots.js
        └── stats.js
```

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone git@github.com:Lucille-R/adapi.git
cd adapi
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Un fichier `.env.example` est fourni comme modèle. Duplique-le en `.env` à la racine du projet :

```bash
cp .env.example .env
```

Le fichier `.env` doit définir les variables suivantes :

| Variable | Description |
|---|---|
| `DB_HOST` | Hôte de la base PostgreSQL |
| `DB_PORT` | Port de la base PostgreSQL |
| `DB_USER` | Utilisateur de la base |
| `DB_PASSWORD` | Mot de passe de la base |
| `DB_NAME` | Nom de la base |
| `PORT` | Port sur lequel le serveur Express écoute |

Les valeurs correspondant à ton environnement local sont dans `db/docker-compose.yml`.

⚠️ Le fichier `.env` ne doit **jamais** être versionné (il est listé dans `.gitignore`).

### 4. Lancer la base de données

Depuis le dossier `db/` :

```bash
cd db
docker compose up -d
```

Cette commande démarre un conteneur PostgreSQL et importe automatiquement `migration_up.sql` au premier lancement (via le volume monté sur `/docker-entrypoint-initdb.d`).

### 5. Importer le jeu de données de test

Toujours depuis le dossier `db/` :

```bash
psql -h localhost -p 5436 -U lr -d adapi -f seed.sql
```

Le mot de passe demandé est celui défini dans `docker-compose.yml`.

### 6. Vérifier l'import

Le jeu de données doit contenir 79 objets, 30 dépôts et 22 personnes, dont 32 objets en rayon. Si ces nombres ne correspondent pas, l'import s'est mal passé.

### 7. Démarrer le serveur

Retour à la racine du projet :

```bash
cd ..
npm run dev
```

Le serveur démarre sur `http://localhost:3000` (ou le port défini dans `.env`).

## 📡 Routes disponibles

### Lecture

| Méthode | Route | Ce qu'elle renvoie | Paramètres attendu | Statut |
|---|---|---|---|---|
| `GET` | `/api/categories` | Liste toutes les catégories (id, libellé) | - | `200` |
| `GET` | `/api/objets` | Liste des objets, avec le libellé de leur catégorie | Filtres optionnels et cumulables : `?statut`, `?categorie_id` | `200` / `400` si `statut` invalide |
| `GET` | `/api/objets/:id` | Un objet, avec sa catégorie, son dépôt et le nom de sa donatrice | `:id` (identifiant de l'objet) | `200` / `404` |
| `GET` | `/api/depots/:id` | Un dépôt, sa donatrice, et la liste des objets qu'il contient | `:id` (identifiant du dépôt) | `200` / `404` |

### Ecriture

| Méthode | Route | Ce qu'elle renvoie | Paramètres attendu | Statut |
|---|---|---|---|---|
| `POST` | `/api/personnes` | Crée une nouvelle donatrice | Dans le body : `nom`, `prenom`, `telephone` (optionnel), `adhérente` (optionnel, `false` par défaut) | `201` / `400` |
| `POST` | `/api/depots` | Crée un nouveau dépôt | Dans le body : `personne_id`, `date_depot`, `type` | `201` / `400` |


## 🧪 Tester l'API

*(à compléter)*

## 👤 Auteure

- **Lucille** — Étudiante chez Ada Tech School

## 📄 Licence

Projet réalisé dans un cadre pédagogique — Ada Tech School.
