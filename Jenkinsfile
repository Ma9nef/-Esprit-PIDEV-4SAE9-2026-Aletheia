pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'
        maven 'M2_HOME'
    }

    environment {
        DOCKER_USER = "manef99"
        IMAGE_TAG = "1.0.0-${env.BUILD_NUMBER}"
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
                        echo "Building ${svc}"
                        dir(svc) {
                            sh 'mvn clean install -DskipTests'
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
                        sh "docker build -t ${DOCKER_USER}/${img.name}:${IMAGE_TAG} ${img.path}"
                        sh "docker tag ${DOCKER_USER}/${img.name}:${IMAGE_TAG} ${DOCKER_USER}/${img.name}:latest"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
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
                            sh "docker push ${DOCKER_USER}/${name}:${IMAGE_TAG}"
                            sh "docker push ${DOCKER_USER}/${name}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy Selected Services to Kubernetes') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}"
                sh "kubectl get pods -n devops"
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