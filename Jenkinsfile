pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'ayoubbelgacem'
    }
    
    stages {
        stage('Hello') {
            steps {
                echo '?? Pipeline Aletheia CI/CD avec SonarQube'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-local') {
                    script {
                        // Analyse Eureka
                        dir('backend/eureka') {
                            sh 'mvn clean compile -DskipTests'
                            sh 'mvn sonar:sonar -Dsonar.projectKey=eureka -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes'
                        }
                        // Analyse Config Server
                        dir('backend/config-server') {
                            sh 'mvn clean compile -DskipTests'
                            sh 'mvn sonar:sonar -Dsonar.projectKey=config-server -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes'
                        }
                        // Analyse ApiGateway
                        dir('backend/ApiGateway') {
                            sh 'mvn clean compile -DskipTests'
                            sh 'mvn sonar:sonar -Dsonar.projectKey=ApiGateway -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes'
                        }
                        // Analyse User Service
                        dir('backend/microservices/user-service') {
                            sh 'mvn clean compile -DskipTests'
                            sh 'mvn sonar:sonar -Dsonar.projectKey=user-service -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes'
                        }
                        // Analyse Events (avec tests)
                        dir('backend/microservices/events') {
                            sh 'mvn clean compile -DskipTests'
                            sh 'mvn test -Dmaven.test.failure.ignore=false'
                            sh 'mvn sonar:sonar -Dsonar.projectKey=events -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes'
                        }
                    }
                }
            }
        }
        
        stage('Build & Push Docker') {
            parallel {
                stage('Eureka') { steps { dir('backend/eureka') { sh 'mvn clean package -DskipTests && docker build -t ayoubbelgacem/aletheia-eureka:latest . && docker push ayoubbelgacem/aletheia-eureka:latest' } } }
                stage('Config Server') { steps { dir('backend/config-server') { sh 'mvn clean package -DskipTests && docker build -t ayoubbelgacem/aletheia-config-server:latest . && docker push ayoubbelgacem/aletheia-config-server:latest' } } }
                stage('ApiGateway') { steps { dir('backend/ApiGateway') { sh 'mvn clean package -DskipTests && docker build -t ayoubbelgacem/aletheia-api-gateway:latest . && docker push ayoubbelgacem/aletheia-api-gateway:latest' } } }
                stage('User Service') { steps { dir('backend/microservices/user-service') { sh 'mvn clean package -DskipTests && docker build -t ayoubbelgacem/aletheia-user-service:latest . && docker push ayoubbelgacem/aletheia-user-service:latest' } } }
                stage('Events') { steps { dir('backend/microservices/events') { sh 'mvn clean package -DskipTests && docker build -t ayoubbelgacem/aletheia-events:latest . && docker push ayoubbelgacem/aletheia-events:latest' } } }
            }
        }
    }
    
    post {
        success { echo '?? Pipeline r?ussi !' }
        failure { echo '? Pipeline ?chou? !' }
    }
}
