Step 10: install dependencies to run workshop automation
====

Alternative A: Run the steps for the workshop locally 
=====

- Use the AWS-CLI and configure a profile with credentials for a user with 'Administrator' privileges
- Install Ruby and the necessary dependencies to run the automation (```rake``` tasks) 
 
Alternative B: Run the steps for the workshop from an EC2 instance
=====
   
- Provision the CloudFormation template for stack ```workshop-instance```

```

workshop-instance $ aws cloudformation create-stack \
                            --stack-name workshop-instance \
                            --template-body file://template.json \
                            --parameters ParameterKey=KeyName,ParameterValue=km \
                            --capabilities CAPABILITY_IAM

```

- Grab the public IP address for the instance, and whitelist SSH access so you can login
- Login to the instance as the ```ec2-user```

```
$ ssh ec2-user@$HOST

$ cd /opt/space-odyssey

$ git branch
* master

$ aws configure set region us-east-1

$ aws ec2 describe-instances
# output listing EC2 instances 

$ rvm current
ruby-2.4.0@workshop

$ gem install bundler
$ bundle install --binstubs
$ cd workshop
workshop $ rake display_accounts
# displays organization and accounts information

```

- Create the artifacts bucket

```
workshop $ rake setup
# displays bucket name

```

- Create a manifest to provision the function for ```CodeBuild-role```

```
workshop $ cp manifest.yml.step-1.example manifest.yml
workshop $ rake process_manifest[true] # dry-run
workshop $ rake process_manifest
workshop $ rake describe_manifest_status
CodeBuild-role: CREATE_COMPLETE

```

- Provision the CloudFormation stack for ```essentials```

```
essentials $ aws cloudformation create-stack \
                    --stack-name essentials \
                    --template-body file://template.json

```

- Configure the git remote for the repository in CodeCommit and push changes to the ```master``` branch

```
$ git config --global credential.helper '!aws codecommit credential-helper $@'
$ git config --global credential.UseHttpPath true
$ git remote add cc https://git-codecommit.us-east-1.amazonaws.com/v1/repos/space-odyssey
$ git push cc master

```