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
                sh 'trivy --version'
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

        stage('Trivy Scan - Backend') {
            steps {
                echo "Scanning ${BACKEND_IMAGE} for vulnerabilities..."
                sh """
                    trivy image --format template \
                    --template '@/usr/local/share/trivy/templates/html.tpl' \
                    --output backend-trivy-report.html \
                    --severity HIGH,CRITICAL \
                    --exit-code 0 \
                    ${BACKEND_IMAGE}
                """
            }
        }

        stage('Trivy Scan - Frontend') {
            steps {
                echo "Scanning ${FRONTEND_IMAGE} for vulnerabilities..."
                sh """
                    trivy image --format template \
                    --template '@/usr/local/share/trivy/templates/html.tpl' \
                    --output frontend-trivy-report.html \
                    --severity HIGH,CRITICAL \
                    --exit-code 0 \
                    ${FRONTEND_IMAGE}
                """
            }
        }

        stage('Publish Security Reports') {
            steps {
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'backend-trivy-report.html',
                    reportName: 'Trivy Report - Backend'
                ])
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'frontend-trivy-report.html',
                    reportName: 'Trivy Report - Frontend'
                ])
            }
        }
    }

    post {
        success {
            echo "✅ Build, scan, and reports complete: ${BACKEND_IMAGE}, ${FRONTEND_IMAGE}"
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        always {
            echo "Build #${env.BUILD_NUMBER} finished."
        }
    }
}
