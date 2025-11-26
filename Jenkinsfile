pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Abhilasha360/journey.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat "docker-compose -f %DOCKER_COMPOSE_FILE% build"
            }
        }

        stage('Stop Existing Containers') {
            steps {
                bat "docker-compose -f %DOCKER_COMPOSE_FILE% down"
            }
        }

        stage('Run Containers') {
            steps {
                bat "docker-compose -f %DOCKER_COMPOSE_FILE% up -d"
            }
        }
    }

    post {
        success {
            slackSend(channel: '#social', message: "✅ SUCCESS: Journey App deployed! Job: ${env.JOB_NAME} | Build: #${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(channel: '#social', message: "❌ FAILED: Deployment failed! Job: ${env.JOB_NAME} | Build: #${env.BUILD_NUMBER}")
        }
    }
}
