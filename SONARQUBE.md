# SonarQube — qualité de code (Aletheia)

## 1. Démarrer SonarQube en local

Avec la stack Docker du projet :

```powershell
Set-Location "chemin\vers\le\projet"
docker compose up -d sonarqube
```

Interface : **[http://localhost:9000](http://localhost:9000)**

- Premier lancement : login `**admin` / `admin`**, puis **change le mot de passe** quand l’assistant le demande.
- Attends 1–2 minutes que la page d’accueil soit prête (SonarQube démarre Elasticsearch en arrière-plan).

> Si le conteneur redémarde en boucle : augmente la RAM Docker Desktop (≥ 4 Go) ou garde `mem_limit: 2g` dans `docker-compose.yml`.

## 2. Créer un token d’analyse

1. **Mon compte** (avatar) → **Sécurité** → **Generate Tokens**
2. Nom : `aletheia-ci`, type : **User token**
3. **Copie** le token (il ne réapparaît qu’une fois).

Ne **commit jamais** le token : utilise des variables d’environnement ou les **credentials Jenkins**.

## 3. Analyser tout le backend (Maven, monorepo)

Un POM agrégateur **[backend/pom.xml](backend/pom.xml)** enchaîne les 9 modules (Eureka, Config, Gateway, microservices).

Depuis la **racine du dépôt** :

```powershell
cd backend
mvn -B compile sonar:sonar `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.token=TON_TOKEN_ICI `
  -Dsonar.projectKey=aletheia-backend `
  -Dsonar.projectName="Aletheia Backend"
```

Sous **cmd** :

```bat
cd backend
mvn -B compile sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=TON_TOKEN -Dsonar.projectKey=aletheia-backend -Dsonar.projectName=Aletheia Backend
```

- La première analyse peut prendre **plusieurs minutes**.
- Dans l’UI Sonar : **Projects** → ouvre `**aletheia-backend`** pour voir bugs, vulnérabilités, dette, couverture (si tu ajoutes Jacoco plus tard).

### Frontend Angular (optionnel, deuxième projet)

Pour analyser le **TypeScript** du dossier `frontend/`, le plus simple est un second projet Sonar avec **SonarScanner** (CLI) et un `sonar-project.properties` dédié — à faire en extension du cours si le prof le demande. Le flux Maven ci-dessus couvre **tout le Java** de la plateforme.

## 4. Intégration Jenkins

1. **Gérer Jenkins** → **Credentials** → **Stores scoped to Jenkins** → **Global** → **Add Credentials**
  - Kind : **Secret text**  
  - **Secret** : colle le token SonarQube  
  - **ID** : exactement `**sonar-token`** (le `Jenkinsfile` utilise cet ID dans `withCredentials`).
2. Démarre **SonarQube** (`docker compose up -d sonarqube`) sur la même machine que l’agent Jenkins si tu utilises `http://localhost:9000`.
3. Lance un build du job **aletheia-ci** en cochant le paramètre `**RUN_SONAR`**.
  - Ajuste `**SONAR_HOST_URL**` si Sonar n’est pas sur `localhost:9000`.
4. Si le stage échoue avec *could not find credentials* : vérifie que l’ID du credential est bien `**sonar-token*`* (sensible à la casse).

## 5. Dépannage


| Problème                                      | Piste                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| `Not authorized`                              | Token invalide ou expiré ; régénère-en un.                                        |
| `Unable to execute Sonar` / connexion refusée | SonarQube pas démarré ou mauvais `SONAR_HOST_URL`.                                |
| Analyse vide                                  | Vérifie que `mvn compile` a bien produit des `target/classes` pour chaque module. |
| Mémoire                                       | Docker : plus de RAM pour le conteneur `sonarqube`.                               |


## 6. Fichiers concernés

- [docker-compose.yml](docker-compose.yml) — service `sonarqube` (port **9000**).
- [backend/pom.xml](backend/pom.xml) — réacteur Maven + plugin Sonar en `pluginManagement`.
- [Jenkinsfile](Jenkinsfile) — stage optionnel SonarQube.
- [.env.example](.env.example) — exemple `SONAR_HOST_URL` / `SONAR_TOKEN` (le vrai token reste local).

