pipeline {

    agent any

    environment {
        APP_NAME = "nodejs-app"
        DOCKER_IMAGE = "dmanoj/nodejs-app"
        SONAR_PROJECT = "nodejs-app"
        SONARQUBE = "Sonar"
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh '''
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    npm test
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {

                script {

                    withSonarQubeEnv("${SONARQUBE}") {

                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'

                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT} \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'

                sh """
                    docker build \
                    -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                    -t ${DOCKER_IMAGE}:latest \
                    .
                """
            }
        }

        stage('Docker Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {

                echo 'Pushing Docker image to DockerHub...'

                sh """
                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy') {
            steps {

                echo 'Deploying application...'

                sh '''
                    echo "Pulling latest Docker image..."

                    docker pull dmanoj/nodejs-app:latest

                    echo "Stopping old container..."

                    docker rm -f nodejs-container 2>/dev/null || true

                    echo "Starting new container..."

                    docker run -d \
                        --name nodejs-container \
                        -p 3000:3000 \
                        --restart unless-stopped \
                        dmanoj/nodejs-app:latest

                    echo "Waiting for application..."

                    sleep 5

                    echo "Checking container..."

                    docker ps --filter "name=nodejs-container"

                    echo "Checking application health..."

                    curl -f http://localhost:3000/health

                    echo "Deployment successful!"
                '''
            }
        }
    }

    post {

        success {
            echo '''
            =========================================
            CI/CD PIPELINE SUCCESSFUL
            =========================================
            '''
            echo "Build Number: ${BUILD_NUMBER}"
            echo "Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }

        failure {
            echo '''
            =========================================
            CI/CD PIPELINE FAILED
            =========================================
            '''
            echo "Build Number: ${BUILD_NUMBER}"
        }

        always {
            echo "Pipeline completed."
        }
    }
}
