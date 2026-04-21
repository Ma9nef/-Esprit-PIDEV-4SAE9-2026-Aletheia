# Jenkins CI/CD – Library Microservice Setup Guide

## 1. Start the DevOps Infrastructure

```bash
# From the project root
docker compose -f docker-compose.jenkins.yml up -d
```

| Service    | URL                       | Default credentials |
|------------|---------------------------|---------------------|
| Jenkins    | http://localhost:8080     | see step 2          |
| SonarQube  | http://localhost:9000     | admin / admin       |

---

## 2. Unlock Jenkins (first boot)

```bash
docker exec aletheia-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Copy the password → open http://localhost:8080 → paste it → click **Install suggested plugins**.

---

## 3. Install Required Jenkins Plugins

**Manage Jenkins → Plugins → Available plugins**, search and install:

| Plugin | Purpose |
|--------|---------|
| **Pipeline** | Declarative pipeline support |
| **Git** | SCM checkout |
| **SonarQube Scanner** | Sonar analysis & quality gate |
| **JUnit** | Publish test results |
| **HTML Publisher** | Publish JaCoCo HTML report |
| **Docker Pipeline** | `docker.build` / `docker.push` DSL |
| **Credentials Binding** | Inject secrets into env vars |

---

## 4. Configure Global Tools

**Manage Jenkins → Tools**

### JDK
- Name: `JDK-17`
- Install automatically → **Eclipse Temurin 17**

### Maven
- Name: `Maven-3.9`
- Install automatically → version **3.9.x**

---

## 5. Configure SonarQube Server

**Manage Jenkins → Configure System → SonarQube servers**

- Name: `SonarQube`
- Server URL: `http://aletheia-sonarqube:9000`  *(container name, both on devops-net)*
- Authentication token: generate one in SonarQube → My Account → Security → Generate Token

---

## 6. Add Docker Hub Credentials

**Manage Jenkins → Credentials → System → Global credentials → Add**

- Kind: **Username with password**
- ID: `DOCKERHUB_CREDENTIALS`
- Username: your Docker Hub username
- Password: your Docker Hub access token

---

## 7. Create the Pipeline Job

1. **New Item** → name: `aletheia-library` → **Multibranch Pipeline**
2. Branch Sources → **Git**
   - Repository URL: `https://github.com/YOUR_ORG/YOUR_REPO.git`
   - Credentials: add GitHub token if private
3. Build Configuration:
   - Mode: **by Jenkinsfile**
   - Script Path: `Jenkinsfile`
4. Scan Multibranch Pipeline Triggers → every **5 minutes** (or use webhook)
5. **Save** → Jenkins will scan branches and trigger the first build

---

## 8. Pipeline Stages Overview

```
📥 Checkout  →  🔧 Build  →  🧪 Unit Tests  →  📦 Package
                                    ↓
                           🔍 SonarQube Analysis
                                    ↓
                           🚦 Quality Gate (pass/fail)
                                    ↓
                           🐳 Docker Build  →  📤 Docker Push
                                    ↓
                           🚀 Deploy Staging  (Library_managment only)
```

---

## 9. SonarQube Quality Gate

The default gate **Sonar way** requires:
- Coverage on new code ≥ 80 %
- No new Blocker / Critical bugs
- No new Security Hotspots

Adjust in SonarQube → Quality Gates → Aletheia Library.

---

## 10. Useful Commands

```bash
# View Jenkins logs
docker logs -f aletheia-jenkins

# View SonarQube logs
docker logs -f aletheia-sonarqube

# Run Maven pipeline stages locally
cd backend/microservices/Library
./mvnw clean verify                   # build + tests + JaCoCo
./mvnw sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>               # manual sonar scan

# Build Docker image locally
docker build -t aletheia/library:dev .
```

---

## 11. Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot connect to Docker daemon` | Add Jenkins user to `docker` group, or run container as root with socket mount |
| `SonarQube Quality Gate timed out` | Increase webhook timeout; add SonarQube webhook: http://jenkins:8080/sonarqube-webhook/ |
| `JaCoCo report not found` | Run `mvnw verify` (not just `test`); report is generated in `verify` phase |
| `Maven wrapper not executable` | `git update-index --chmod=+x backend/microservices/Library/mvnw` |
