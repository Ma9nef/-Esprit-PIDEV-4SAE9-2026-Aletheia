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
        // Évite des PluginResolutionException si Maven Central est lent (timeouts / Wi‑Fi)
        MAVEN_OPTS = '-Dmaven.wagon.http.connectionTimeout=600000 -Dmaven.wagon.http.readTimeout=600000 -Dmaven.wagon.http.retryHandler.count=5'
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
    dir(path) {
        if (isUnix()) {
            sh "${MVN} -B -U -DskipTests package"
        } else {
            // -U force la mise à jour des dépendances / plugins (utile si cache .m2 partiel)
            bat "${MVN} -B -U -DskipTests package"
        }
    }
}
