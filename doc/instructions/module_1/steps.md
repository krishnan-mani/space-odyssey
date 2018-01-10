Install dependencies to run workshop automation
===

Alternative A: Run the steps for the workshop locally 
=====

- Use the AWS-CLI and configure a profile with credentials for a user with 'Administrator' privileges
- Install Ruby and the necessary dependencies to run the automation (```rake``` tasks) 
 
Alternative B: Run the steps for the workshop from an EC2 instance
=====
   
See [instructions](launch_instance.md)

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

- Display currrent accounts in the organization

```bash
# Display current accounts in the organisation
workshop $ rake display_accounts

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

- (OPTIONAL) Configure the git remote for the repository in CodeCommit and push changes to the ```master``` branch

```bash
$ git config --global credential.helper '!aws codecommit credential-helper $@'
$ git config --global credential.UseHttpPath true
$ git remote add cc https://git-codecommit.us-east-1.amazonaws.com/v1/repos/space-odyssey
$ git push cc master
```
