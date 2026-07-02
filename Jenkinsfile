pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "lapai-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "lapai-frontend:${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh 'git --version'
                sh 'docker --version'
            }
        }

        stage('Project Structure') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                    python3 -m pip install --upgrade pip
                    pip3 install -r requirements.txt
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                    npm install
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

    }

    post {
        success {
            echo '✅ Pipeline completed successfully.'
        }

        failure {
            echo '❌ Pipeline failed.'
        }
    }
}