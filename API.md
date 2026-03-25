# 🏨 API Hôtel - Documentation Complète

## 📋 Table des Matières

- Vue d'ensemble
- Installation & Démarrage
- Authentification
- Rôles et Permissions
- Endpoints
  - Établissements
  - Chambres
  - Galeries
  - Réservations
  - Utilisateurs
- Matrice de Permissions
- Codes d'erreur

---

## 🎯 Vue d'ensemble

**Base URL:** http://localhost:3000/api

Framework: Next.js 16.1.7
Langage: TypeScript
Base de données: MySQL avec Drizzle ORM
Authentification: Session basée

Cette API gère une plateforme de réservation d'hôtels avec trois niveaux d'accès : utilisateur, gestionnaire et administrateur.

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- MySQL

### Installation

```
git clone <repo-url>
cd hotel-ac-rf-ma

npm install

cp .env.example .env

npm run db:push

npm run dev
```


Le serveur démarre sur http://localhost:3000

---

## 🔐 Authentification

L'API utilise une authentification basée sur les sessions avec Better Auth.

### Comment s'authentifier

1. Créer un compte via l'endpoint d'authentification
2. Se connecter pour recevoir une session
3. Inclure la session dans les cookies de chaque requête protégée

### En-têtes requis pour les routes protégées

Cookie: [session_cookie]

### Réponses d'authentification

- 401: Non authentifié - Session manquante ou expirée
- 403: Authentifié mais non autorisé - Permissions insuffisantes

---

## 👥 Rôles et Permissions

L'API propose 3 rôles avec des permissions différentes :

**user** (Client)
- Consulter les hôtels
- Créer et gérer ses réservations

**manager** (Gestionnaire)
- Gérer chambres et galeries de son établissement
- Voir réservations de son établissement

**admin** (Administrateur)
- Accès complet à toutes les ressources

---

## 📡 Endpoints

### ÉTABLISSEMENTS

**GET /establishments**
Récupère la liste de tous les établissements avec filtrage optionnel.

Permissions: ✅ Public

Query Parameters:
- region (string): Filtrer par région
- people (number): Capacité minimale requise
- startAt (ISO 8601): Date de début du séjour
- finishAt (ISO 8601): Date de fin du séjour

Exemples:
```
GET /api/establishments

GET /api/establishments?region=Provence&people=2

GET /api/establishments?startAt=2024-06-01&finishAt=2024-06-05&people=3
```


Réponse (200):
```json
[
  {
    "id": 1,
    "name": "Hotel Paradise",
    "description": "Un bel hôtel en montagne",
    "image_path": "/images/hotel.jpg",
    "address": "123 Rue de la Montagne",
    "region": "Provence",
    "city": "Nice",
    "manager_id": "user-123"
  }
]
```


---

**GET /establishments/[id]**
Récupère les détails d'un établissement spécifique.

Permissions: ✅ Public

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/establishments/1
```


Réponse (200):
```json
{
  "id": 1,
  "name": "Hotel Paradise",
  "description": "Un bel hôtel en montagne",
  "image_path": "/images/hotel.jpg",
  "address": "123 Rue de la Montagne",
  "region": "Provence",
  "city": "Nice",
  "manager_id": "user-123"
}
```


Erreur (404):
```json
{ "error": "Établissement 1 non trouvé" }
```


---

**POST /establishments**
Crée un nouvel établissement.

Permissions: 🔐 Admin uniquement

Body:
```json
{
  "name": "Hotel Paradise",
  "description": "Un bel hôtel en montagne",
  "address": "123 Rue de la Montagne",
  "region": "Provence",
  "city": "Nice",
  "image_path": "/images/hotel.jpg",
  "manager_id": "user-123"
}
```


Champs obligatoires: name, description, address, region, city
Champs optionnels: image_path, manager_id

Exemple:
```
curl -X POST http://localhost:3000/api/establishments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Paradise",
    "description": "Un bel hôtel en montagne",
    "address": "123 Rue de la Montagne",
    "region": "Provence",
    "city": "Nice"
  }'
```


Réponse (201):
```json
{
  "id": 1,
  "name": "Hotel Paradise",
  "description": "Un bel hôtel en montagne",
  "image_path": null,
  "address": "123 Rue de la Montagne",
  "region": "Provence",
  "city": "Nice",
  "manager_id": null
}
```


Erreur (401): { "error": "Non authentifié" }
Erreur (403): { "error": "Accès refusé" }

---

**PUT /establishments/[id]**
Modifie les informations d'un établissement.

Permissions: 🔐 Admin uniquement

URL Parameters:
- id (number) - Requis

Body (tous les champs optionnels):
```json
{
  "name": "Hotel Paradise Updated",
  "description": "Un bel hôtel mis à jour",
  "address": "456 Rue Nouvelle",
  "region": "Côte d'Azur",
  "city": "Cannes",
  "image_path": "/images/new.jpg"
}
```


Exemple:
```
curl -X PUT http://localhost:3000/api/establishments/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Hotel Paradise Updated"}'
```


Réponse (200):
```json
{ "success": true }
```


---

**DELETE /establishments/[id]**
Supprime un établissement.

Permissions: 🔐 Admin uniquement

Conditions: Aucune réservation active ou future ne doit exister

URL Parameters:
- id (number) - Requis

Exemple:
```
curl -X DELETE http://localhost:3000/api/establishments/1
```


Réponse (200):
```json
{ "success": true }
```


Erreur (409):
```json
{ "error": "Impossible de supprimer cet établissement car des réservations en cours ou futures existent" }
```


---

**PATCH /establishments/[id]/manager**
Assigne ou retire un gestionnaire d'un établissement.

Permissions: 🔐 Admin uniquement

URL Parameters:
- id (number) - Requis

Body:
```json
{
  "manager_id": "user-123"
}
```


Pour retirer un gestionnaire, utiliser null:
```json
{
  "manager_id": null
}
```


Exemple:
```
curl -X PATCH http://localhost:3000/api/establishments/1/manager \
  -H "Content-Type: application/json" \
  -d '{"manager_id": "user-123"}'
```


Réponse (200):
```json
{ "success": true }
```


Erreur (400):
```json
{ "error": "L'utilisateur sélectionné n'est pas un gérant" }
```


---

**GET /establishments/[id]/reservation**
Récupère les réservations d'un établissement.

Permissions: 🔐 Authentifié (Admin ou Manager de l'établissement)

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/establishments/1/reservation
```


Réponse (200):
```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "room_id": 1,
    "startAt": "2024-06-01T00:00:00Z",
    "finishAt": "2024-06-05T00:00:00Z",
    "person_number": 2,
    "status": "pending"
  }
]
```


---

**GET /establishments/[id]/rooms**
Récupère la liste des chambres d'un établissement.

Permissions: ✅ Public

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/establishments/1/rooms
```


Réponse (200):
```json
[
  {
    "id": 1,
    "name": "Suite Royale",
    "description": "Une belle suite avec vue sur la mer",
    "image_path": "/images/room.jpg",
    "capacity": 2,
    "price": 150.50,
    "establishment_id": 1
  }
]
```


Erreur (404):
```json
{ "error": "Établissement non trouvé" }
```


---

### CHAMBRES

**GET /rooms**
Récupère la liste complète de toutes les chambres.

Permissions: 🔐 Admin uniquement

Exemple:
```
GET /api/rooms
```


Réponse (200):
```json
[
  {
    "id": 1,
    "name": "Suite Royale",
    "description": "Une belle suite avec vue sur la mer",
    "image_path": "/images/room.jpg",
    "capacity": 2,
    "price": 150.50,
    "establishment_id": 1
  }
]
```


---

**GET /rooms/[id]**
Récupère les détails d'une chambre spécifique.

Permissions: ✅ Public

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/rooms/1
```


Réponse (200):
```json
{
  "id": 1,
  "name": "Suite Royale",
  "description": "Une belle suite avec vue sur la mer",
  "image_path": "/images/room.jpg",
  "capacity": 2,
  "price": 150.50,
  "establishment_id": 1
}
```


---

**POST /rooms**
Crée une nouvelle chambre.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

Body:
```json
{
  "name": "Suite Royale",
  "description": "Une belle suite avec vue sur la mer",
  "establishment_id": 1,
  "capacity": 2,
  "price": 150.50,
  "image_path": "/images/room.jpg"
}
```


Champs obligatoires: name, description, establishment_id
Champs optionnels: capacity, price, image_path

Exemple:
```
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Suite Royale",
    "description": "Une belle suite avec vue sur la mer",
    "establishment_id": 1,
    "capacity": 2,
    "price": 150.50
  }'
```


Réponse (201):
```json
{
  "id": 1,
  "name": "Suite Royale",
  "description": "Une belle suite avec vue sur la mer",
  "image_path": null,
  "capacity": 2,
  "price": 150.50,
  "establishment_id": 1
}
```


---

**PUT /rooms/[id]**
Modifie une chambre.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

URL Parameters:
- id (number) - Requis

Body (tous les champs optionnels):
```json
{
  "name": "Suite Royale Deluxe",
  "price": 200.00,
  "capacity": 3
}
```


Exemple:
```
curl -X PUT http://localhost:3000/api/rooms/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 200.00}'
```


Réponse (200):
```json
{ "success": true }
```


---

**DELETE /rooms/[id]**
Supprime une chambre.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

Conditions: Aucune réservation active ou future

URL Parameters:
- id (number) - Requis

Exemple:
```
curl -X DELETE http://localhost:3000/api/rooms/1
```


Réponse (200):
```json
{ "success": true }
```


Erreur (409):
```json
{ "error": "Impossible de supprimer cette chambre car des réservations en cours ou futures existent" }
```


---

### GALERIES

**GET /rooms/[id]/galleries**
Récupère toutes les images d'une chambre.

Permissions: ✅ Public

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/rooms/1/galleries
```


Réponse (200):
```json
[
  {
    "id": 1,
    "image_path": "/images/room1.jpg",
    "room_id": 1
  },
  {
    "id": 2,
    "image_path": "/images/room2.jpg",
    "room_id": 1
  }
]
```


---

**POST /rooms/[id]/galleries**
Ajoute une image à une chambre.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

URL Parameters:
- id (number) - Requis

Body:
```json
{
  "image_path": "/images/room-new.jpg"
}
```


Exemple:
```
curl -X POST http://localhost:3000/api/rooms/1/galleries \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/images/room-new.jpg"}'
```


Réponse (201):
```json
{
  "id": 3,
  "image_path": "/images/room-new.jpg",
  "room_id": 1
}
```


---

**GET /galleries/[id]**
Récupère les détails d'une image.

Permissions: ✅ Public

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/galleries/1
```


Réponse (200):
```json
{
  "id": 1,
  "image_path": "/images/room1.jpg",
  "room_id": 1
}
```


---

**PUT /galleries/[id]**
Modifie une image.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

URL Parameters:
- id (number) - Requis

Body:
```json
{
  "image_path": "/images/room1-updated.jpg"
}
```


Exemple:
```
curl -X PUT http://localhost:3000/api/galleries/1 \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/images/room1-updated.jpg"}'
```


Réponse (200):
```json
{ "success": true }
```


---

**DELETE /galleries/[id]**
Supprime une image.

Permissions: 🔐 Admin & Manager (sa chambre uniquement)

URL Parameters:
- id (number) - Requis

Exemple:
```
curl -X DELETE http://localhost:3000/api/galleries/1
```


Réponse (200):
```json
{ "success": true }
```


---

### RÉSERVATIONS

**GET /reservations**
Récupère les réservations selon le rôle de l'utilisateur.

Permissions: 🔐 Authentifié
- User: ses réservations uniquement
- Manager: réservations de son établissement
- Admin: toutes les réservations

Query Parameters:
- userId (string): Filtrer par utilisateur (Admin uniquement)

Exemples:
```
GET /api/reservations

GET /api/reservations?userId=user-123
```


Réponse (200):
```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "room_id": 1,
    "startAt": "2024-06-01T00:00:00Z",
    "finishAt": "2024-06-05T00:00:00Z",
    "person_number": 2,
    "status": "pending"
  }
]
```


---

**POST /reservations**
Crée une nouvelle réservation.

Permissions: 🔐 Utilisateurs authentifiés

Body:
```json
{
  "room_id": 1,
  "startAt": "2024-06-01T00:00:00Z",
  "finishAt": "2024-06-05T00:00:00Z",
  "person_number": 2
}
```


Champs obligatoires: room_id, startAt, finishAt
Champs optionnels: person_number

Exemple:
```
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": 1,
    "startAt": "2024-06-01T00:00:00Z",
    "finishAt": "2024-06-05T00:00:00Z",
    "person_number": 2
  }'
```


Réponse (201):
```json
{
  "id": 1,
  "user_id": "user-123",
  "room_id": 1,
  "startAt": "2024-06-01T00:00:00Z",
  "finishAt": "2024-06-05T00:00:00Z",
  "person_number": 2,
  "status": "pending"
}
```


Erreur (409):
```json
{ "error": "Cette chambre n'est pas disponible pour les dates sélectionnées" }
```


---

**GET /reservations/[id]**
Récupère une réservation spécifique.

Permissions: 🔐 Propriétaire, Manager (de l'établissement), Admin

URL Parameters:
- id (number) - Requis

Exemple:
```
GET /api/reservations/1
```


Réponse (200):
```json
{
  "id": 1,
  "user_id": "user-123",
  "room_id": 1,
  "startAt": "2024-06-01T00:00:00Z",
  "finishAt": "2024-06-05T00:00:00Z",
  "person_number": 2,
  "status": "pending"
}
```


---

**PUT /reservations/[id]**
Modifie une réservation.

Permissions: 🔐 Propriétaire, Admin

URL Parameters:
- id (number) - Requis

Body:
```json
{
  "person_number": 3
}
```


Exemple:
```
curl -X PUT http://localhost:3000/api/reservations/1 \
  -H "Content-Type: application/json" \
  -d '{"person_number": 3}'
```


Réponse (200):
```json
{ "success": true }
```


---

**DELETE /reservations/[id]**
Annule une réservation.

Permissions: 🔐 Propriétaire (délai 3 jours), Manager & Admin

Conditions:
- User: doit annuler au moins 3 jours avant le séjour
- Manager/Admin: peut annuler à tout moment

URL Parameters:
- id (number) - Requis

Exemple:
```
curl -X DELETE http://localhost:3000/api/reservations/1
```


Réponse (200):
```json
{ "success": true }
```


Erreur (409):
```json
{ "error": "L'annulation doit être faite au moins 3 jours avant le séjour" }
```


---

### UTILISATEURS

**GET /users**
Récupère la liste des utilisateurs.

Permissions: 🔐 Admin & Manager

Query Parameters:
- role (string): Filtrer par rôle (user, manager, admin)

Exemples:
```
GET /api/users

GET /api/users?role=manager
```


Réponse (200):
```json
[
  {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "emailVerified": true,
    "image": null
  }
]
```


---

**GET /users/[id]**
Récupère les détails d'un utilisateur.

Permissions: 🔐 Soi-même, Manager, Admin

URL Parameters:
- id (string) - Requis

Exemple:
```
GET /api/users/user-123
```


Réponse (200):
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "emailVerified": true,
  "image": null
}
```


---

**PUT /users/[id]**
Modifie les informations d'un utilisateur.

Permissions: 🔐 Soi-même (son profil), Admin

URL Parameters:
- id (string) - Requis

Body:
```json
{
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "image": "/images/profile.jpg"
}
```


Exemple:
```
curl -X PUT http://localhost:3000/api/users/user-123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```


Réponse (200):
```json
{ "success": true }
```


Erreur (409):
```json
{ "error": "Cet email est déjà utilisé" }
```


---

**DELETE /users/[id]**
Supprime un utilisateur.

Permissions: 🔐 Soi-même (son compte), Admin

URL Parameters:
- id (string) - Requis

Exemple:
```
curl -X DELETE http://localhost:3000/api/users/user-123
```


Réponse (200):
```json
{ "success": true }
```


---

**PUT /users/[id]/role**
Modifie le rôle d'un utilisateur.

Permissions: 🔐 Admin uniquement

Conditions: Ne peut pas modifier son propre rôle

URL Parameters:
- id (string) - Requis

Body:
```json
{
  "role": "manager"
}
```


Rôles valides: user, manager, admin

Exemple:
```
curl -X PUT http://localhost:3000/api/users/user-123/role \
  -H "Content-Type: application/json" \
  -d '{"role": "manager"}'
```


Réponse (200):
```json
{ "success": true }
```


Erreur (400):
```json
{ "error": "Rôle invalide" }
```


---

## 📊 Matrice de Permissions

```
Endpoint                          User    Manager Admin
GET /establishments               ✅      ✅      ✅
GET /establishments/[id]          ✅      ✅      ✅
POST /establishments              ❌      ❌      ✅
PUT /establishments/[id]          ❌      ❌      ✅
DELETE /establishments/[id]       ❌      ❌      ✅
PATCH /establishments/[id]/mgr    ❌      ❌      ✅
GET /establishments/[id]/rooms    ✅      ✅      ✅
GET /rooms                        ❌      ❌      ✅
GET /rooms/[id]                   ✅      ✅      ✅
POST /rooms                       ❌      ✅ OWN  ✅
PUT /rooms/[id]                   ❌      ✅ OWN  ✅
DELETE /rooms/[id]                ❌      ✅ OWN  ✅
GET /rooms/[id]/galleries         ✅      ✅      ✅
GET /galleries/[id]               ✅      ✅      ✅
POST /rooms/[id]/galleries        ❌      ✅ OWN  ✅
PUT /galleries/[id]               ❌      ✅ OWN  ✅
DELETE /galleries/[id]            ❌      ✅ OWN  ✅
GET /reservations                 ✅ OWN  ✅ ESTAB ✅
GET /reservations/[id]            ✅ OWN  ✅ ESTAB ✅
POST /reservations                ✅      ❌      ✅
PUT /reservations/[id]            ✅ OWN  ❌      ✅
DELETE /reservations/[id]         ✅ 3j   ✅      ✅
GET /users                        ❌      ✅      ✅
GET /users/[id]                   ✅ OWN  ✅      ✅
PUT /users/[id]                   ✅ OWN  ✅      ✅
DELETE /users/[id]                ✅ OWN  ❌      ✅
PUT /users/[id]/role              ❌      ❌      ✅

Légende:
✅ = Autorisé
❌ = Refusé
OWN = Sa propre ressource
ESTAB = Son établissement
3j = Délai de 3 jours avant le séjour
```


---

## 🚨 Codes d'erreur

Code | Signification | Exemple
200 | Succès | Opération complétée
201 | Créé | Ressource créée avec succès
400 | Mauvaise requête | Paramètres invalides ou manquants
401 | Non authentifié | Session manquante ou expirée
403 | Non autorisé | Authentifié mais permissions insuffisantes
404 | Non trouvé | Ressource inexistante
409 | Conflit | Chambre déjà réservée, email existant
500 | Erreur serveur | Problème interne du serveur

---

## 💡 Conseils d'utilisation

### Flux de création de réservation

```
1. Consulter les hôtels
GET /api/establishments?region=Provence&people=2

2. Voir les chambres de l'hôtel
GET /api/establishments/1/rooms

3. Créer une réservation (authentifié)
POST /api/reservations \
  -d '{"room_id": 1, "startAt": "2024-06-01", "finishAt": "2024-06-05"}'
```


### Flux de gestion d'un établissement (Manager)

```
1. Voir ses réservations
GET /api/reservations

2. Ajouter une chambre
POST /api/rooms \
  -d '{"name": "Suite", "description": "...", "establishment_id": 1}'

3. Ajouter des images
POST /api/rooms/1/galleries \
  -d '{"image_path": "/images/room.jpg"}'
```


### Flux d'administration (Admin)

```
1. Créer un établissement
POST /api/establishments

2. Assigner un gestionnaire
PATCH /api/establishments/1/manager

3. Voir toutes les chambres
GET /api/rooms

4. Modifier les rôles des utilisateurs
PUT /api/users/user-123/role
```


---

## 📚 Technologies utilisées

- Backend: Next.js 16.1.7
- Language: TypeScript
- ORM: Drizzle ORM 0.45.1
- Base de données: MySQL 3.20.0
- Authentification: Better Auth 1.5.5
- Styling: Tailwind CSS 4.2.1
- Validation: ESLint

---

Dernière mise à jour: Mars 2024
Version API: 1.0.0
Statut: Production