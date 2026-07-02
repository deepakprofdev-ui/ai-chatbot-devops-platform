pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "lapai-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "lapai-frontend:${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh 'git --version'
                sh 'docker --version'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "Building backend image: ${BACKEND_IMAGE}"
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE} ."
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "Building frontend image: ${FRONTEND_IMAGE}"
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE} ."
                }
            }
        }

        stage('List Built Images') {
            steps {
                sh 'docker images | grep lapai'
            }
        }
    }

    post {
        success {
            echo "✅ Both images built successfully: ${BACKEND_IMAGE}, ${FRONTEND_IMAGE}"
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        always {
            echo "Build #${env.BUILD_NUMBER} finished."
        }
    }
}
