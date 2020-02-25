pipeline{
    agent{
        docker {
            image 'node'
            args   '-p 3000:3000'
        }
    }
    stages{
        stage("Update") {
            steps{
                echo "====++++Pulling Updates++++===="
                sh   'git pull'
            }
        }
        stage("Build"){
            steps{
                echo "========executing Build========"
                sh   'npm install'
            }
            post{
                always{
                    echo "========always========"
                }
                success{
                    echo "======== executed successfully========"
                }
                failure{
                    echo "========A execution failed========"
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}