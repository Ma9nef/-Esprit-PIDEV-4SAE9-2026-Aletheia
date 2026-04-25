# Jenkins — Installation Windows + pipeline Aletheia

Ce guide suit le déroulé type **Atelier 1 / 2** et **Activité Pipeline (Jenkinsfile)** du cours DevOps.

## 1. Prérequis sur ta machine Windows

Installe **avant** Jenkins (le service Jenkins utilisera le `PATH` système) :

| Outil | Rôle | Vérification (PowerShell) |
|--------|------|---------------------------|
| **JDK 17** (Temurin / Oracle) | Build Maven | `java -version` |
| **Maven 3.9+** | `mvn package` | `mvn -version` |
| **Node.js 20 LTS** | Build Angular | `node -version` |
| **Git** | Checkout du dépôt | `git -version` |

Redémarre le PC après installation si le `PATH` ne se met pas à jour.

## 2. Installer Jenkins (Windows)

1. Télécharge **Jenkins LTS pour Windows** : [https://www.jenkins.io/download/](https://www.jenkins.io/download/) (installeur `.msi`).
2. Lance l’installeur **en administrateur** si demandé.
3. Choisis le dossier d’installation et le compte du service Windows (souvent **Local System** pour un lab ; en entreprise on utilise un compte dédié).
4. Au premier démarrage, ouvre le navigateur sur **`http://localhost:8080`**.
5. Mot de passe administrateur initial (copie-colle depuis le fichier indiqué à l’écran), souvent :
   - `C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword`
6. Installe les **plugins suggérés** (recommended).
7. Crée ton utilisateur admin Jenkins.

Si le port 8080 est pris (autre appli), change le port dans la config Jenkins ou arrête l’autre service.

## 3. Plugins utiles (comme en cours)

Après **Gérer Jenkins → Plugins** :

- **Pipeline**
- **Git** (souvent déjà là)
- Optionnel : **Credentials Binding**, **Workspace Cleanup**

Redémarre Jenkins si l’interface le demande.

## 4. Outils dans Jenkins (optionnel mais propre)

**Gérer Jenkins → Tools** :

- Ajoute une installation **JDK** pointant vers ton JDK 17.
- Ajoute une installation **Maven** si tu n’utilises pas le Maven du `PATH`.

Dans le `Jenkinsfile`, tu peux alors remplacer `agent any` par un `tools { maven '...' jdk '...' }` si ton prof le demande.

## 5. Credentials GitHub

**Gérer Jenkins → Credentials** :

- Si le dépôt est **privé** : ajoute un identifiant du type *Username with password* (token GitHub en mot de passe) ou *SSH Username with private key*.

## 6. Créer le job Pipeline (Activité Jenkinsfile)

1. **Nouveau job** → nom : `aletheia-ci` → type **Pipeline** → OK.
2. Section **Pipeline** :
   - **Definition** : *Pipeline script from SCM*.
   - **SCM** : Git.
   - **Repository URL** : l’URL HTTPS ou SSH de ton repo GitHub.
   - **Credentials** : si besoin.
   - **Branch** : `*/test-devops` (ou `*/main` selon ta branche).
   - **Script Path** : `Jenkinsfile` (à la racine du repo).
3. Enregistre, puis **Lancer un build**.

## 7. Dépannage Windows

- **`mvn` introuvable** : Maven n’est pas dans le PATH du **service** Jenkins. Soit tu ajoutes Maven au PATH **système** et tu redémarres le service Jenkins, soit tu définis dans le `Jenkinsfile` une variable `MVN` avec le chemin complet vers `mvn.cmd`.
- **`npm` introuvable** : idem pour Node (PATH système ou chemin complet dans le stage frontend).
- **Build très long** : normal la première fois (téléchargement des dépendances Maven/npm).

## 8. Fichier livré dans le projet

- Racine du repo : **`Jenkinsfile`** — build frontend + tous les modules backend listés dans la CI GitHub du projet.

Après un build vert, garde une **capture d’écran** de la console Jenkins pour le rapport / la soutenance.
