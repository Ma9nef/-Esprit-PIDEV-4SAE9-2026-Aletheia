pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'
        maven 'maven3'
    }

    environment {
        DOCKER_USER = "manef99"
        K8S_DIR = "k8s/aletheia"
        NAMESPACE = "aletheia"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Services') {
            steps {
                script {
                    def services = [
                        'backend/ApiGateway',
                        'backend/config-server',
                        'backend/eureka',
                        'backend/microservices/courses',
                        'backend/microservices/user-service',
                        'backend/microservices/library'
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
                        [name: 'user-service', path: 'backend/microservices/user-service'],
                        [name: 'library', path: 'backend/microservices/library'],
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
                            'user-service',
                            'library',
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
                sh "kubectl apply -f ${K8S_DIR}/namespace.yaml || true"

                sh "kubectl apply -f ${K8S_DIR}/eureka.yaml"
                sh "kubectl rollout status deployment/eureka -n ${NAMESPACE} --timeout=240s"

                sh "kubectl apply -f ${K8S_DIR}/config-server.yaml"
                sh "kubectl rollout status deployment/config-server -n ${NAMESPACE} --timeout=240s"

                sh "kubectl apply -f ${K8S_DIR}/mysql-courses.yaml"
                sh "kubectl rollout status deployment/mysql-courses -n ${NAMESPACE} --timeout=240s"

                sh "kubectl apply -f ${K8S_DIR}/mysql-user.yaml"
                sh "kubectl rollout status deployment/mysql-user -n ${NAMESPACE} --timeout=240s"

                sh "kubectl apply -f ${K8S_DIR}/mysql-library.yaml"
                sh "kubectl rollout status deployment/mysql-library -n ${NAMESPACE} --timeout=240s"
            }
        }

        stage('Deploy Backend Services') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/courses.yaml"
                sh "kubectl rollout restart deployment/courses -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/courses -n ${NAMESPACE} --timeout=300s"

                sh "kubectl apply -f ${K8S_DIR}/user-service.yaml"
                sh "kubectl rollout restart deployment/user-service -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/user-service -n ${NAMESPACE} --timeout=300s"

                sh "kubectl apply -f ${K8S_DIR}/library.yaml"
                sh "kubectl rollout restart deployment/library -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/library -n ${NAMESPACE} --timeout=300s"
            }
        }

        stage('Deploy Gateway and Frontend') {
            steps {
                sh "kubectl apply -f ${K8S_DIR}/api-gateway.yaml"
                sh "kubectl rollout restart deployment/api-gateway -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/api-gateway -n ${NAMESPACE} --timeout=300s"

                sh "kubectl apply -f ${K8S_DIR}/frontend.yaml"
                sh "kubectl rollout restart deployment/frontend -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/frontend -n ${NAMESPACE} --timeout=300s"
            }
        }

        stage('Show Kubernetes Status') {
            steps {
                sh "kubectl get pods -n ${NAMESPACE}"
                sh "kubectl get svc -n ${NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo "All selected services deployed successfully."
        }

        failure {
            echo "Pipeline failed. Check the failed stage logs."
            sh "kubectl get pods -n ${NAMESPACE} || true"
        }
    }
}