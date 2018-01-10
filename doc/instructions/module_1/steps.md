Install dependencies to run workshop automation
====

Alternative A: Run the steps for the workshop locally 
=====

- Use the AWS-CLI and configure a profile with credentials for a user with 'Administrator' privileges
- Install Ruby and the necessary dependencies to run the automation (```rake``` tasks) 
 
Alternative B: Run the steps for the workshop from an EC2 instance
=====
   
- Provision the CloudFormation template for stack ```workshop-instance```
- Ensure you have an **existing Keypair in `us-east-1` before launching this stack**
- Clone this repository to have access to the assets. Navigate to the repository folder, before launching Cloudformation stack below

```bash
$ cd /my/path/to/cloned/space-odyssey
space-odyssey $ cd templates/bootstrap/workshop-instance/
```

```bash
# Assuming public key name is MyKey

$ aws cloudformation create-stack \
                            --stack-name workshop-instance \
                            --template-body file://template.json \
                            --parameters ParameterKey=KeyName,ParameterValue=MyKey \
                            --capabilities CAPABILITY_IAM \
                            --region us-east-1
```

- Grab the public IP address for the instance, and whitelist SSH access so you can login
- Login to the instance as the ```ec2-user```

```bash
# Obtain public IP address for instance, say p.q.r.s
$ ssh -i /path/to/private/key ec2-user@p.q.r.s

# Change into cloned repository
$ cd /opt/space-odyssey

# Ensure you are on the right branch
$ git branch
* master

# Configure AWS CLI to use "us-east-1"
$ aws configure set region us-east-1

# Establish that the CLI is working and has the credentials configured
$ aws sts get-caller-identity

# Change into the "workshop" folder containing the rake tasks
$ cd workshop
workshop $ rvm current
ruby-2.4.0@workshop
workshop $ gem install bundler --no-ri --no-rdoc
workshop $ bundle install --binstubs

# Display current accounts in the organisation
workshop $ rake display_accounts
# displays organization and accounts information

```

- Create the artifacts bucket

```
workshop $ rake create_organization
workshop $ rake setup
# displays bucket name

```

- Create a manifest to provision the function for ```CodeBuild-role```

```bash
workshop $ cp manifest.yml.step-1.example manifest.yml
workshop $ rake process_manifest[true] # dry-run
workshop $ rake process_manifest
workshop $ rake describe_manifest_status
CodeBuild-role: CREATE_COMPLETE
```

- Provision the CloudFormation stack for ```essentials```
- Move to essentials folder which is two levels up before launching Cloudformation stack below

```bash
cd ../templates/bootstrap/essentials/
```

```bash
essentials $ aws cloudformation create-stack \
                    --stack-name essentials \
                    --template-body file://template.json
```

- Configure the git remote for the repository in CodeCommit and push changes to the ```master``` branch

```bash
$ git config --global credential.helper '!aws codecommit credential-helper $@'
$ git config --global credential.UseHttpPath true
$ git remote add cc https://git-codecommit.us-east-1.amazonaws.com/v1/repos/space-odyssey
$ git push cc master
```
