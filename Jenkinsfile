pipeline {
    agent any

    environment {
        EC2_IP = "54.89.167.115"
        EC2_USER = "ubuntu"
    }

    stages {

        stage('Deploy Frontend Ec2 Machine') {

            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "
                    export PATH=/home/ubuntu/.nvm/versions/node/v24.15.0/bin:\$PATH
                    mkdir -p Frontend
                    cd Frontend
                    rm -rf Local_Services_Fronted
                    git clone https://github.com/Nav-2003/Local_Services_Fronted.git
                    cd Local_Services_Fronted
                    node -v
                    npm -v
                    npm install
                    npm run build
                    sudo rm -rf /var/www/html/*
                    sudo cp -r dist/* /var/www/html/
                    sudo systemctl restart nginx
                "
                '''
            }
        }
    }
}