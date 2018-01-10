Contains instructions to launch an EC2 instance that has the tools to run the workshop

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

# Configure AWS CLI to use "us-east-1"
$ aws configure set region us-east-1

# Establish that the CLI is working and has the credentials configured
$ aws sts get-caller-identity
```
