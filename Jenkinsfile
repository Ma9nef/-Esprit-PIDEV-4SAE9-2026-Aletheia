// Pipeline CI — Aletheia (monorepo Angular + Spring Boot)
// Compatible agent Windows (bat) ou Linux (sh). Exige JDK 17, Maven, Node 20 sur l'agent.

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds(abortPrevious: true)
    }

    environment {
        // Décommente et adapte si Maven n'est pas dans le PATH du service Jenkins :
        // MVN = 'C:\\\\apache-maven-3.9.6\\\\bin\\\\mvn.cmd'
        MVN = 'mvn'
        // Wagon = HTTP Maven vers Central (réseau lent / Wi‑Fi) — timeouts en millisecondes
        MAVEN_OPTS = '-Dmaven.wagon.http.connectionTimeout=1200000 -Dmaven.wagon.http.readTimeout=1200000 -Dmaven.wagon.http.retryHandler.count=5'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build backend — infrastructure') {
            steps {
                script {
                    buildMaven('backend/eureka')
                    buildMaven('backend/config-server')
                    buildMaven('backend/ApiGateway')
                }
            }
        }

        stage('Build backend — microservices') {
            steps {
                script {
                    buildMaven('backend/microservices/user-service')
                    buildMaven('backend/microservices/courses')
                    buildMaven('backend/microservices/Library')
                    buildMaven('backend/microservices/offer')
                    buildMaven('backend/microservices/events')
                    buildMaven('backend/microservices/ResourceManagement')
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline terminé avec succès.'
        }
        failure {
            echo 'Pipeline en échec — voir les logs des stages ci-dessus.'
        }
    }
}

void buildMaven(String path) {
    // repackage skip en CI : évite téléchargements lourds (buildpack) + JAR "fat" inutile pour "compile OK".
    // L’image Docker reconstruit un package complet dans son propre `docker build`.
    def mvnArgs = '-B -U -DskipTests package -Dspring-boot.repackage.skip=true'
    dir(path) {
        if (isUnix()) {
            sh "${MVN} ${mvnArgs}"
        } else {
            bat "${MVN} ${mvnArgs}"
        }
    }
}
