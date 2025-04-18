pipeline {
    agent {
        label 'agent1'
    }

    environment {

    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run tests') {
            steps {
                sh {
                    sh 'npx playwright test'
                }
            }
        }

        stage('Generate Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'plawyright-report',
                    reportName: 'Playwright Test Report',
                    reportTitles: ''
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*'
        }
    }
}
