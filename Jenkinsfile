pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project') {
            steps {
                sh '''
                    echo "Repository successfully checked out."
                    echo "Project files:"
                    ls -la
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