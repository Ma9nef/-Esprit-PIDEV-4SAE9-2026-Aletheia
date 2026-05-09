pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'ayoubbelgacem'
    }
    
    stages {
        stage('Hello') {
            steps {
                echo '?? D?marrage du pipeline Aletheia CI/CD'
                echo "Workspace: ${env.WORKSPACE}"
            }
        }
        
        stage('Build All Microservices') {
            parallel {
                stage('Eureka') {
                    steps {
                        dir('backend/eureka') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ayoubbelgacem/aletheia-eureka:latest .'
                            sh 'docker push ayoubbelgacem/aletheia-eureka:latest'
                        }
                    }
                }
                
                stage('Config Server') {
                    steps {
                        dir('backend/config-server') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ayoubbelgacem/aletheia-config-server:latest .'
                            sh 'docker push ayoubbelgacem/aletheia-config-server:latest'
                        }
                    }
                }
                
                stage('ApiGateway') {
                    steps {
                        dir('backend/ApiGateway') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ayoubbelgacem/aletheia-api-gateway:latest .'
                            sh 'docker push ayoubbelgacem/aletheia-api-gateway:latest'
                        }
                    }
                }
                
                stage('User Service') {
                    steps {
                        dir('backend/microservices/user-service') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ayoubbelgacem/aletheia-user-service:latest .'
                            sh 'docker push ayoubbelgacem/aletheia-user-service:latest'
                        }
                    }
                }
                
                stage('Events') {
                    steps {
                        dir('backend/microservices/events') {
                            sh 'mvn clean package -DskipTests'
                            sh 'docker build -t ayoubbelgacem/aletheia-events:latest .'
                            sh 'docker push ayoubbelgacem/aletheia-events:latest'
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '?? Pipeline r?ussi ! Tous les microservices ont ?t? mis ? jour sur Docker Hub'
        }
        failure {
            echo '? Pipeline ?chou? ! Consultez les logs'
        }
    }
}
