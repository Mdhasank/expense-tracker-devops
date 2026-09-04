pipeline {

    agent {
        docker {
            image 'mohd7895k/expense-tracker-jenkins-agent:1.0'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKERHUB_USERNAME = 'mohd7895k'

        BACKEND_IMAGE  = "${DOCKERHUB_USERNAME}/expense-tracker-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/expense-tracker-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Checking out latest code from repository...'

                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building backend Docker image...'

                sh '''
                    docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend
                '''

                echo 'Building frontend Docker image...'

                sh '''
                    docker build \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        echo "Pushing backend image..."

                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest

                        echo "Pushing frontend image..."

                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {

        always {
            echo 'Cleaning up dangling Docker images...'

            sh '''
                docker image prune -f || true
            '''
        }

        success {
            echo "SUCCESS: Pipeline completed successfully for build #${BUILD_NUMBER}"
        }

        failure {
            echo "FAILURE: Pipeline failed for build #${BUILD_NUMBER}"
        }
    }
}