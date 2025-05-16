# API de Gestion de Tâches

## Description

Cette **API NestJS** permet de gérer des tâches, des groupes de tâches, une messagerie par email et l'authentification des utilisateurs. Elle offre les fonctionnalités suivantes :

- Inscription et connexion des utilisateurs.
- Création, mise à jour, suppression et récupération de tâches et de groupes de tâches.
- Envoi d'emails avec pièces jointes, capturés et testés via **MailHog**.
- Gestion des réinitialisations de mot de passe et suppression de compte.

L'API utilise **NestJS** comme framework, **Prisma** comme ORM pour interagir avec la base de données, **JWT** pour l'authentification, **Multer** pour le téléversement de fichiers, et **MailHog** comme serveur SMTP local pour tester les emails. Les emails envoyés sont accessibles via l'interface web de MailHog.

## Fonctionnalités

- **Authentification** : Inscription, connexion, réinitialisation de mot de passe et suppression de compte.
- **Tâches** : Création, mise à jour, suppression et récupération de tâches avec association optionnelle à des groupes et des utilisateurs assignés.
- **Groupes de tâches** : Organisation des tâches en groupes avec étiquettes, descriptions et couleurs.
- **Messagerie par email** : Envoi d'emails avec prise en charge des copies (CC, Cci) et des pièces jointes, capturés par MailHog pour le test.
- **Téléversement de fichiers** : Gestion des fichiers (par exemple, `.png`, `.jpg`, `.pdf`) comme pièces jointes, stockés dans le dossier `./Uploads`.
- **Sécurité** : Authentification basée sur JWT pour les endpoints protégés et validation des entrées avec `class-validator`.

## Technologies

- **NestJS** : Framework backend.
- **Prisma** : ORM pour la gestion de la base de données.
- **JWT** : Authentification avec JSON Web Tokens.
- **Multer** : Gestion du téléversement de fichiers.
- **MailHog** : Serveur SMTP local pour tester les emails.
- **Swagger** : Documentation de l'API (accessible à `/ui`).
- **TypeScript** : Pour un développement avec typage fort.
- **Node.js** : Environnement d'exécution.

## Installation

### Pré-requis

- **Node.js** (version 16 ou supérieure)
- **PostgreSQL** (ou une autre base de données compatible avec Prisma)
- **MailHog** (pour tester les emails)
- **npm** ou **yarn**
- **Docker** (optionnel, pour installer MailHog)

### Étapes

1. **Cloner le dépôt** :

   ```bash
   git clone <url-du-dépôt>
   cd task-management-api
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :

   ```env
   DATABASE_URL="file:./dev.db"
   SECRET_KEY = "crackers dev"
   OTP_CODE = "OTP CODE"
   SERVER_URL= "http://localhost:3000"
   PORT="3000"
   MAILHOG_PORT="1025"
   MAILHOG_HOST="localhost"
   ```

4. **Configurer la base de données** :
   - Configurez votre base de données dans `prisma/schema.prisma`.
   - Exécutez les migrations pour créer le schéma de la base de données :

     ```bash
     npx prisma migrate dev
     ```

5. **Installer MailHog** :
   - **Option 1 : Avec Docker** (recommandé) :

     ```bash
     docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
     ```

     - Port `1025` : SMTP pour envoyer des emails.
     - Port `8025` : Interface web pour visualiser les emails.
   - **Option 2 : Téléchargement direct** :
     - Téléchargez la dernière version de MailHog depuis [GitHub Releases](https://github.com/mailhog/MailHog/releases).
     - Pour Linux/MacOS, rendez le fichier exécutable et lancez-le :

       ```bash
       chmod +x MailHog
       ./MailHog
       ```

     - Pour Windows, exécutez `MailHog.exe`.

6. **Démarrer MailHog** :
   - Si vous utilisez Docker, MailHog démarre automatiquement après la commande `docker run`.
   - Si vous utilisez l'exécutable, lancez :

     ```bash
     ./MailHog
     ```

   - Accédez à l'interface web de MailHog à `http://localhost:8025` pour visualiser les emails envoyés.

7. **Démarrer le serveur** :

   ```bash
   npm run start:dev
   ```

8. **Accéder à l'API** :
   - L'API est accessible à `http://localhost:3000` (ou le port spécifié dans `.env`).
   - La documentation Swagger est disponible à `http://localhost:3000/ui`.

## Endpoints de l'API

### Authentification (`/auth`)

| Méthode | Endpoint                              | Description                              | DTO                              | Authentification |
|---------|---------------------------------------|------------------------------------------|----------------------------------|------------------|
| POST    | `/auth/signup`                       | Inscrire un nouvel utilisateur           | `SignupDto`                     | Aucune           |
| POST    | `/auth/signin`                       | Connexion et obtention d'un token JWT    | `SigninDto`                     | Aucune           |
| POST    | `/auth/reset-password`               | Demander une réinitialisation de mot de passe | `ResetPasswordDemandDto`      | JWT              |
| POST    | `/auth/reset-password-confirmation`  | Confirmer la réinitialisation avec un code | `ResetPasswordConfirmationDto` | JWT              |
| DELETE  | `/auth/delete`                       | Supprimer le compte de l'utilisateur authentifié | `DeleteAccountDto`         | JWT              |

#### DTOs

- **SignupDto** :

  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string (email valide)",
    "password": "string (minimum 8 caractères)"
  }
  ```

- **SigninDto** :

  ```json
  {
    "email": "string (email valide)",
    "password": "string (minimum 8 caractères)"
  }
  ```

- **ResetPasswordDemandDto** :

  ```json
  {
    "email": "string (email valide)"
  }
  ```

- **ResetPasswordConfirmationDto** :

  ```json
  {
    "email": "string (email valide)",
    "password": "string (minimum 8 caractères)",
    "code": "string"
  }
  ```

- **DeleteAccountDto** :

  ```json
  {
    "password": "string"
  }
  ```

### Tâches (`/tasks`)

| Méthode | Endpoint                     | Description                              | DTO                              | Authentification |
|---------|------------------------------|------------------------------------------|----------------------------------|------------------|
| GET     | `/tasks`                    | Récupérer toutes les tâches              | Aucun                            | Aucune           |
| POST    | `/tasks/create`             | Créer une nouvelle tâche                 | `TaskDto`                        | JWT              |
| GET     | `/tasks/:id`                | Récupérer une tâche par ID               | Aucun                            | JWT              |
| PUT     | `/tasks/update/:id`         | Mettre à jour une tâche par ID           | `TaskDto`                        | JWT              |
| DELETE  | `/tasks/delete/:id`         | Supprimer une tâche par ID               | Aucun                            | JWT              |

#### DTO

- **TaskDto** :

  ```json
  {
    "title": "string",
    "description": "string | null",
    "dueDate": "string (date ISO) | null",
    "priority": "string | null",
    "groupId": "number | null",
    "assignedId": "number | null"
  }
  ```

### Groupes de Tâches (`/groups`)

| Méthode | Endpoint                     | Description                              | DTO                              | Authentification |
|---------|------------------------------|------------------------------------------|----------------------------------|------------------|
| GET     | `/groups`                   | Récupérer tous les groupes de tâches     | Aucun                            | Aucune           |
| POST    | `/groups/create`            | Créer un nouveau groupe de tâches        | `TaskGroupDto`                   | JWT              |
| GET     | `/groups/:id`               | Récupérer un groupe de tâches par ID     | Aucun                            | JWT              |
| PUT     | `/groups/update/:id`        | Mettre à jour un groupe de tâches par ID | `TaskGroupDto`                   | JWT              |
| DELETE  | `/groups/delete/:id`        | Supprimer un groupe de tâches par ID     | Aucun                            | JWT              |

#### DTO

- **TaskGroupDto** :

  ```json
  {
    "label": "string",
    "description": "string | null",
    "color": "string | null"
  }
  ```

### Messagerie par Email (`/mail`)

| Méthode | Endpoint                     | Description                              | DTO                              | Authentification |
|---------|------------------------------|------------------------------------------|----------------------------------|------------------|
| POST    | `/mail/create`              | Envoyer un email avec pièces jointes optionnelles | `MailDto`               | JWT              |
| GET     | `/mail/user`                | Récupérer tous les emails envoyés ou reçus par l'utilisateur | Aucun         | JWT              |
| GET     | `/mail/:id`                 | Récupérer un email par ID                | Aucun                            | JWT              |
| DELETE  | `/mail/delete/:id`          | Supprimer un email par ID                | Aucun                            | JWT              |

#### DTO

- **MailDto** (multipart/form-data) :

  ```json
  {
    "title": "string (optionnel)",
    "message": "string",
    "emailTo": "string (email valide)",
    "emailsCC": "string (emails séparés par des virgules, optionnel)",
    "emailCci": "string (emails séparés par des virgules, optionnel)"
  }
  ```

  - Les pièces jointes sont envoyées via le champ `attachements` (jusqu'à 10 fichiers, extensions supportées : `.png`, `.jpg`, `.jpeg`, `.pdf`).
  - Les emails sont capturés par MailHog et visibles à `http://localhost:8025`.

#### Téléversement de Fichiers

- Les fichiers sont stockés dans le dossier `./Uploads` avec des noms uniques (`IMG_<timestamp>_<random>.<extension>`).
- Accessibles via `http://localhost:3000/uploads/<nom-du-fichier>`.

## Authentification

- Les endpoints protégés nécessitent un **token JWT** dans l'en-tête `Authorization` sous la forme `Bearer <token>`.
- Obtenez un token via `POST /auth/signin`.

## Exemples d'Utilisation

### Inscription

```bash
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}'
```

### Connexion

```bash
curl -X POST http://localhost:3000/auth/signin \
-H "Content-Type: application/json" \
-d '{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}'
```

### Créer une Tâche

```bash
curl -X POST http://localhost:3000/tasks/create \
-H "Authorization: Bearer <votre-token-jwt>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Nouvelle Tâche",
  "description": "Description de la tâche",
  "dueDate": "2025-06-01T12:00:00Z",
  "priority": "Haute",
  "groupId": 1,
  "assignedId": 2
}'
```

### Envoyer un Email avec Pièce Jointe

```bash
curl -X POST http://localhost:3000/mail/create \
-H "Authorization: Bearer <votre-token-jwt>" \
-H "Content-Type: multipart/form-data" \
-F "title=Test Email" \
-F "message=Ceci est un message de test" \
-F "emailTo=destinataire@example.com" \
-F "attachements=@/chemin/vers/photo.jpg"
```

- Après l'envoi, consultez `http://localhost:8025` pour voir l'email dans MailHog.

## Schéma de la Base de Données

L'API utilise Prisma avec les modèles suivants :

- **User** : Stocke les informations des utilisateurs (id, firstName, lastName, email, password).
- **Task** : Stocke les tâches avec titre, description, date d'échéance, priorité, groupe et utilisateur assigné.
- **TaskGroup** : Stocke les groupes de tâches avec étiquette, description et couleur.
- **Mail** : Stocke les emails internes de l'application mais ce n'est pas encore terminé.

## Configuration de MailHog

- **Hôte et port SMTP** : Configurez votre service d'email dans l'API pour utiliser `MAILHOG_HOST=localhost` et `MAILHOG_PORT=1025`.
- **Interface web** : L'interface de MailHog est accessible à `http://localhost:8025`.

## Contribution

1. Forkez le dépôt.
2. Créez une nouvelle branche (`git checkout -b feature/votre-fonctionnalité`).
3. Effectuez vos modifications et commitez (`git commit -m "Ajouter votre fonction"`).
4. Poussez vers la branche (`git push origin feature/votre-fonctionnalité`).
5. Ouvrez une pull request.

## Licence

Ce projet est sous licence MIT.
