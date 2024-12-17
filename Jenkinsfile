pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build ENV') {
            steps {
                script {
                    sh """
                    echo "NEXT_PUBLIC_API_BASE_URL=https://api.shakecode.net" >> .env
                    """
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'GHCR', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login ghcr.io --username $username --password-stdin
                        docker build -f Dockerfile -t ghcr.io/$username/shakecode_front .
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'GHCR', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker push ghcr.io/$username/shakecode_front
                        """
                    }
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'GHCR', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker ps
                        docker stop shakecode_front || true
                        docker rm shakecode_front || true
                        docker pull ghcr.io/$username/shakecode_front
                        docker run -it -d --name shakecode_front --restart always -p 9008:3000 ghcr.io/$username/shakecode_front
                        docker image prune -f
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}