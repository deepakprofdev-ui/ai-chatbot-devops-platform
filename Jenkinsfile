pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "lapai-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "lapai-frontend:${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                echo '🔍 Verifying installed tools...'

                sh 'git --version'
                sh 'docker --version'
                sh 'python3 --version'
                sh 'pip3 --version'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Project Structure') {
            steps {
                echo '📂 Listing project structure...'
                sh 'ls -la'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    echo '📦 Installing backend dependencies...'

                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    echo '🧪 Running backend tests...'

                    sh '''
                        . venv/bin/activate
                        PYTHONPATH=. pytest -v
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    echo '📦 Installing frontend dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo '⚛️ Building React application...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    echo '🐳 Building backend Docker image...'

                    sh """
                        docker build \
                          -t ${BACKEND_IMAGE} \
                          -t lapai-backend:latest .
                    """
                }
            }
        }

        stage('Trivy Scan - Backend') {
            steps {
                echo '🔒 Scanning backend image...'

                sh """
                    trivy image \
                    --skip-version-check \
                    --scanners vuln \
                    --severity HIGH,CRITICAL \
                    ${BACKEND_IMAGE}
                """
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    echo '🐳 Building frontend Docker image...'

                    sh """
                        docker build \
                          -t ${FRONTEND_IMAGE} \
                          -t lapai-frontend:latest .
                    """
                }
            }
        }

        stage('List Docker Images') {
            steps {
                echo '📋 Available Docker images...'
                sh 'docker images'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }

        failure {
            echo '❌ Pipeline failed. Check the console output.'
        }

        always {
            echo '✅ Jenkins pipeline execution finished.'
        }
    }
}