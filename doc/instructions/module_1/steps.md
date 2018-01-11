Install dependencies to run workshop automation
===

Step 1: Alternative A: Run locally 
=====

- Use the AWS-CLI and configure a profile with credentials for a user with 'Administrator' privileges
- Install Ruby and the necessary dependencies to run the automation as part of the workshop
 
Step 1: Alternative B: Run from an EC2 instance
=====
   
- See [instructions](launch_instance.md)

NOTE: Regardless of the alternative you choose, clone this repository and switch to the ```master``` branch 

```bash
$ cd /my/path/to/cloned/space-odyssey
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

```

Begin the workshop
===

- Create the organization (assumption: the current account will be the parent account in the organization). Display currrent accounts in the organization. If the organization already exists, you will see a message listing the organization information and accounts in the organization, else you will see an Error message 

```bash

# Display current accounts in the organisation
workshop $ rake display_accounts
Error: Your account is not a member of an organization.

workshop $ rake create_organization

```

- Setup the S3 bucket and any other supporting resources needed

```bash

workshop $ rake setup
# displays bucket name

```

- Create a manifest to provision the Lambda function for ```CodeBuild-role```

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

workshop $ cd ../templates/bootstrap/essentials/
essentials $ aws cloudformation create-stack \
                    --stack-name essentials \
                    --template-body file://template.json
essentials $ aws cloudformation wait stack-create-complete --stack-name essentials                    
```

- Configure the git remote for the repository (created in CodeCommit as part of the ```essentials``` stack) and push changes to the ```master``` branch

```bash

$ git config credential.helper '!aws codecommit credential-helper $@'
$ git config credential.UseHttpPath true
$ git remote add cc https://git-codecommit.us-east-1.amazonaws.com/v1/repos/space-odyssey
$ git push cc master

```
