pipeline {
    agent {
        docker {
            image 'node:22-alpine'
        }
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Working directory:"
                    pwd

                    echo "Project files:"
                    ls -la
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing backend dependencies..."
                    cd backend
                    npm install

                    echo "Installing frontend dependencies..."
                    cd ../frontend
                    npm install
                '''
            }
        }

        stage('Frontend Lint') {
            steps {
                sh '''
                    cd frontend
                    npm run lint
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    cd frontend
                    npm run build
                '''
            }
        }
    }

    post {
        success {
            echo 'Expense Tracker CI pipeline completed successfully!'
        }

        failure {
            echo 'Expense Tracker CI pipeline failed!'
        }
    }
}