pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Eureka') {
            steps {
                dir("${BACKEND_DIR}/eureka") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Config Server') {
            steps {
                dir("${BACKEND_DIR}/config-server") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build API Gateway') {
            steps {
                dir("${BACKEND_DIR}/ApiGateway") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Courses Service') {
            steps {
                dir("${BACKEND_DIR}/microservices/courses") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'docker compose build'
                }
            }
        }

        stage('Start Containers') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'docker compose up -d'
                }
            }
        }

        stage('Show Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Backend pipeline completed successfully.'
        }

        failure {
            echo 'Backend pipeline failed. Check the failed stage logs.'
        }
    }
}
