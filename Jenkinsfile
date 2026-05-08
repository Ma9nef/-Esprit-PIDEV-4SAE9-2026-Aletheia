pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'ayoubbelgacem'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Récupération du code depuis GitHub'
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-local') {
                    dir('backend') {
                        sh 'mvn sonar:sonar -Dsonar.projectKey=Aletheia -Dsonar.host.url=http://sonarqube:9000'
                    }
                }
            }
        }
        
        stage('Build & Push Docker Images') {
            parallel {
                stage('Eureka') {
                    steps {
                        dir('backend/eureka') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ${DOCKER_USERNAME}/aletheia-eureka:latest .'
                            sh 'docker push ${DOCKER_USERNAME}/aletheia-eureka:latest'
                        }
                    }
                }
                stage('Config Server') {
                    steps {
                        dir('backend/config-server') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ${DOCKER_USERNAME}/aletheia-config-server:latest .'
                            sh 'docker push ${DOCKER_USERNAME}/aletheia-config-server:latest'
                        }
                    }
                }
                stage('ApiGateway') {
                    steps {
                        dir('backend/ApiGateway') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ${DOCKER_USERNAME}/aletheia-api-gateway:latest .'
                            sh 'docker push ${DOCKER_USERNAME}/aletheia-api-gateway:latest'
                        }
                    }
                }
                stage('User Service') {
                    steps {
                        dir('backend/microservices/user-service') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ${DOCKER_USERNAME}/aletheia-user-service:latest .'
                            sh 'docker push ${DOCKER_USERNAME}/aletheia-user-service:latest'
                        }
                    }
                }
                stage('Events') {
                    steps {
                        dir('backend/microservices/events') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ${DOCKER_USERNAME}/aletheia-events:latest .'
                            sh 'docker push ${DOCKER_USERNAME}/aletheia-events:latest'
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline réussi ! Toutes les images ont été mises à jour sur Docker Hub'
        }
        failure {
            echo '❌ Pipeline échoué ! Consultez les logs'
        }
    }
}
