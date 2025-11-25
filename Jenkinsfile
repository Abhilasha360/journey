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
            echo "Journey App successfully deployed using Jenkins + Docker (Windows)!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
