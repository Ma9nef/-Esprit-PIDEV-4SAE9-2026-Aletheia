pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'ayoubbelgacem'
    }
    
    stages {
        stage('Hello') {
            steps {
                echo 'Hello from Aletheia pipeline!'
                echo "Workspace: ${env.WORKSPACE}"
            }
        }
        
        stage('Docker Login') {
            steps {
                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
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
    }
    
    post {
        success {
            echo 'Pipeline r?ussi !'
        }
        failure {
            echo 'Pipeline ?chou? !'
        }
    }
}
