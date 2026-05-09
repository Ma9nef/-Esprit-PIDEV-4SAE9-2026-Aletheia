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
                    // Analyser uniquement les modules qui compilent
                    script {
                        def modules = ['eureka', 'config-server', 'ApiGateway', 'user-service', 'events']
                        for (module in modules) {
                            dir("backend/${module}") {
                                sh "mvn clean compile -DskipTests"
                                sh "mvn sonar:sonar -Dsonar.projectKey=${module} -Dsonar.host.url=http://sonarqube:9000 -Dsonar.java.binaries=target/classes"
                            }
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
