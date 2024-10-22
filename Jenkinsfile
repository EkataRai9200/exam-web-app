pipeline {
    agent any
    
    environment {
        git_credential = "bitbucket_pesslab_secret_password"
        aws_credential = "awscreds"
        repo_url = "https://pesslab@bitbucket.org/pesslab/test_repo.git"
        bucket = "onlinetestpanel-exam-app"
        region = "ap-south-1"
        notify_text = "code uploaded to s3"
    }

    stages {

        stage('Checkout') { 
            steps {
                git credentialsId: "${git_credential}", branch: 'main', url: "${repo_url}"
            }
        }
    
        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'Node20') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'Node20') {
                    sh 'npm run build'
                }
            }
        }
        
        stage("Upload"){
            steps{
                withAWS(region: "${region}", credentials: "${aws_credential}"){
                    s3Upload(file:"./dist", bucket:"${bucket}")
                }    
            }
            post {
                success{
                    echo "Exam App Deployed"
                }
                failure{
                    echo "Exam App Build Failed"
                }
            }
        }
        
    }
}