pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'
        maven 'maven3'
    }

    environment {
        DOCKER_USER = "manef99"
        K8S_DIR = "k8s/aletheia"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Selected Backend Services') {
            steps {
                script {
                    def services = [
                        'backend/ApiGateway',
                        'backend/config-server',
                        'backend/eureka',
                        'backend/microservices/courses',
                        'backend/microservices/user-service'
                    ]

                    for (svc in services) {
                        echo "Packaging ${svc}"
                        dir(svc) {
                            sh 'mvn clean package -DskipTests'
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
                        [name: 'courses', path: 'backend/microservices/courses'],
                        [name: 'user-service', path: 'backend/microservices/user-service']
                    ]

                    for (img in images) {
                        echo "Building Docker image ${DOCKER_USER}/${img.name}:latest"
                        sh "docker build -t ${DOCKER_USER}/${img.name}:latest ${img.path}"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-cred',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    script {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'

                        def imageNames = [
                            'api-gateway',
                            'config-server',
                            'eureka',
                            'courses',
                            'user-service'
                        ]

                        for (name in imageNames) {
                            echo "Pushing ${DOCKER_USER}/${name}:latest"
                            sh "docker push ${DOCKER_USER}/${name}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy Selected Services to Kubernetes') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/eureka.yaml"
                sh "kubectl rollout restart deployment/eureka -n aletheia"
                sh "kubectl get pods -n aletheia"
            }
        }
    }

    post {
        success {
            echo "Selected backend services deployed successfully."
        }

        failure {
            echo "Pipeline failed."
        }
    }
}