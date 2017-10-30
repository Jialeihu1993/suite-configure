#!groovy
def gitRepo = 'config-ui'
def branch  = env.BRANCH_NAME
//def refspec = params.refspec
//def profile = params.profile
currentBuild.displayName = '#' + BUILD_NUMBER + '-' + gitRepo + '-' + branch

if( gitRepo=='config-ui' || gitRepo=='installer-ui' || gitRepo=='config-service' ){
    slackChannel = '#suite-ui'
}else{
    slackChannel = '#cicd'
}

node('shc-jenkins-slave-09'){
    try{
        timestamps {
            ws("/opt/jenkins-slave/workspace/${gitRepo}"){
                stage 'stage #1: checkout code'
<<<<<<< HEAD
                checkout([$class: 'GitSCM', branches: [[name: "${branch}"]], 
                        extensions: [[$class: 'CleanBeforeCheckout']],
                        userRemoteConfigs: [[url: "https://github.hpe.com/SMA-RnD/${gitRepo}.git"]]])
=======
                checkout scm
>>>>>>> 86b5ea55537e2f86906804cd6376b3e62156eacc
                sh 'git rev-parse --verify HEAD --short >gitSHAShort'
                sh 'git rev-parse --verify HEAD >gitSHA'
                gitCommitShort = readFile('gitSHAShort')
                gitCommit = readFile('gitSHA')
                echo "git commit is ${gitCommit}"
                currentBuild.displayName = '#' + BUILD_NUMBER + '-' + gitRepo + '-' + gitCommitShort

                stage 'stage #2: build'
                withMaven(maven: 'M3') {
                    sh "mvn -s settings.xml -B -U clean deploy"
                }
            }
        slackSend   channel: slackChannel, 
                    color: 'good', 
                    message: "SUCCESS:${currentBuild.displayName}: ${BUILD_URL} \n GitHub: https://github.hpe.com/SMA-RnD/${gitRepo}/commit/${gitCommit}"        
        }
    }
    catch (err) {
        sendFailureMail()
        slackSend   channel: slackChannel, 
                    color: 'danger', 
                    message: "FAILURE:${currentBuild.displayName}: ${BUILD_URL} \n GitHub: https://github.hpe.com/SMA-RnD/${gitRepo}/commit/${gitCommit}"
        throw err
    }
    finally {
        echo "build finish." 
    }
}

def sendFailureMail(){
    mail body: "project build error is here: ${env.BUILD_URL}" ,
    from: 'jenkins_admin@hpe.com',
    replyTo: 'llin@hpe.com',
    subject: "${slackChannel} build #${BUILD_NUMBER} failed",
    to: 'llin@hpe.com jun.wan@hpe.com'
}