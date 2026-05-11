pipeline {
    agent any

    environment {
        DOCKER_USER = "ayoubbelgacem"
        K8S_DIR = "k8s/aletheia"
        NAMESPACE = "aletheia"
        SONAR_SERVER = "sonarqube-local"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Compile & Test') {
            parallel {
                stage('Eureka Compile') {
                    steps {
                        dir('backend/eureka') {
                            sh 'mvn clean compile -DskipTests'
                        }
                    }
                }
                stage('Config Server Compile') {
                    steps {
                        dir('backend/config-server') {
                            sh 'mvn clean compile -DskipTests'
                        }
                    }
                }
                stage('ApiGateway Compile') {
                    steps {
                        dir('backend/ApiGateway') {
                            sh 'mvn clean compile -DskipTests'
                        }
                    }
                }
                stage('User Service Compile') {
                    steps {
                        dir('backend/microservices/user-service') {
                            sh 'mvn clean compile -DskipTests'
                        }
                    }
                }
                stage('Events Compile & Test') {
                    steps {
                        dir('backend/microservices/events') {
                            sh 'mvn clean compile'
                            sh 'mvn test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONAR_SERVER}") {
                    script {
                        def services = [
                            [key: 'eureka', path: 'backend/eureka'],
                            [key: 'config-server', path: 'backend/config-server'],
                            [key: 'api-gateway', path: 'backend/ApiGateway'],
                            [key: 'user-service', path: 'backend/microservices/user-service'],
                            [key: 'events', path: 'backend/microservices/events']
                        ]

                        for (svc in services) {
                            echo "Running SonarQube analysis for ${svc.key}"
                            dir(svc.path) {
                                sh """
                                    mvn sonar:sonar \
                                    -Dsonar.projectKey=${svc.key} \
                                    -Dsonar.host.url=http://sonarqube:9000 \
                                    -Dsonar.java.binaries=target/classes
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def images = [
                        [name: 'api-gateway', path: 'backend/ApiGateway'],
                        [name: 'config-server', path: 'backend/config-server'],
                        [name: 'eureka', path: 'backend/eureka'],
                        [name: 'user-service', path: 'backend/microservices/user-service'],
                        [name: 'events', path: 'backend/microservices/events'],
                        [name: 'frontend', path: 'frontend']
                    ]

                    for (img in images) {
                        echo "Building ${DOCKER_USER}/${img.name}:latest"
                        sh "docker build -t ${DOCKER_USER}/${img.name}:latest ${img.path}"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    script {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'

                        def imageNames = [
                            'api-gateway',
                            'config-server',
                            'eureka',
                            'user-service',
                            'events',
                            'frontend'
                        ]

                        for (name in imageNames) {
                            echo "Pushing ${DOCKER_USER}/${name}:latest"
                            sh "docker push ${DOCKER_USER}/${name}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy Infrastructure') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/eureka.yaml || true"
                sh "kubectl apply -f ${K8S_DIR}/config-server.yaml || true"
            }
        }

        stage('Deploy Backend Services') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/user-service.yaml || true"
                sh "kubectl apply -f ${K8S_DIR}/events.yaml || true"
            }
        }

        stage('Deploy Gateway and Frontend') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/api-gateway.yaml || true"
                sh "kubectl apply -f ${K8S_DIR}/frontend.yaml || true"
            }
        }

        stage('Show Kubernetes Status') {
            steps {
                sh "kubectl get pods -n ${NAMESPACE} || true"
                sh "kubectl get svc -n ${NAMESPACE} || true"
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs."
        }
    }
}
