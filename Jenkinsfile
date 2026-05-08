pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'ayoubbelgacem'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub'
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
        
        stage('Build Eureka') {
            steps {
                dir('backend/eureka') {
                    sh 'mvn clean package -DskipTests'
                    sh 'docker build -t ayoubbelgacem/aletheia-eureka:latest .'
                    sh 'docker push ayoubbelgacem/aletheia-eureka:latest'
                }
            }
        }
        
        stage('Build Config Server') {
            steps {
                dir('backend/config-server') {
                    sh 'mvn clean package -DskipTests'
                    sh 'docker build -t ayoubbelgacem/aletheia-config-server:latest .'
                    sh 'docker push ayoubbelgacem/aletheia-config-server:latest'
                }
            }
        }
        
        stage('Build ApiGateway') {
            steps {
                dir('backend/ApiGateway') {
                    sh 'mvn clean package -DskipTests'
                    sh 'docker build -t ayoubbelgacem/aletheia-api-gateway:latest .'
                    sh 'docker push ayoubbelgacem/aletheia-api-gateway:latest'
                }
            }
        }
        
        stage('Build User Service') {
            steps {
                dir('backend/microservices/user-service') {
                    sh 'mvn clean package -DskipTests'
                    sh 'docker build -t ayoubbelgacem/aletheia-user-service:latest .'
                    sh 'docker push ayoubbelgacem/aletheia-user-service:latest'
                }
            }
        }
        
        stage('Build Events') {
            steps {
                dir('backend/microservices/events') {
                    sh 'mvn clean package -DskipTests'
                    sh 'docker build -t ayoubbelgacem/aletheia-events:latest .'
                    sh 'docker push ayoubbelgacem/aletheia-events:latest'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline réussi ! Toutes les images ont ete mises a jour sur Docker Hub'
        }
        failure {
            echo 'Pipeline echoue ! Consultez les logs'
        }
    }
}