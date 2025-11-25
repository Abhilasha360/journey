pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Abhilasha360/journey.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo "Journey App successfully deployed using Jenkins + Docker!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
