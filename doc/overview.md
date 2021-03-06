Goals:
===

- Work with multiple accounts (ownership, access, usage, financial control)
- Ensure security and compliance across accounts
- Manage access at scale
- Ensure agility for teams 
 
How: use workflows to provision new accounts that scale well

the [Dream](dream.md)
===

Workshop:
===

- organized into modules
- module 1: preparation and pre-requisites
- module 2: organization, accounts, and organizational units
- module 3: automation
- module 4: logging account (illustrated with CloudTrail)
- module 5: identity account (illustrated with Cross Account Manager)
 
Concepts and principles:
===

- AWS Organizations: organization, organizational units (OU), accounts, and Service Control Policies (SCP)
- Cross-account access with IAM roles ("OrganizationAccountAccessRole")
- IAM: roles and policies
- automation: 
  - recurring actions with CloudWatch Scheduled Events, Lambda functions, and SNS topics 
  - build projects in CodeBuild to provision CloudFormation stacks on one or more target accounts
- Cross Account Manager: 
  - to standardize roles and policies across accounts
  - federation, "accountgroup"
  - Groups in Active Directory are assigned to IAM roles

module 1: [preparation and pre-requisites](instructions/module_1/steps.md)
===

- Use any AWS account
- install the dependencies locally, or alternatively, provision an EC2 instance using the template for ```workshop-instance```
- setup the bucket for artifacts
- (provision scheduled function to) create the role for CodeBuild
- provision a CloudFormation template for "essentials"
- familiarize yourself with the automation
- use "rake tasks" to implement the workshop
- milestones: 
  - ability to run the workshop automation, either locally or from EC2 instance
  - S3 bucket provisioned for artifacts 
  - deployed CloudFormation stack ```CodeBuild-role```
  - deployed CloudFormation stack ```essentials```
  - git repository in CodeCommit with source code for workshop
  - build project in CodeBuild
  - SNS topic

module 2: [organization, accounts, and organizational units](instructions/module_2/steps.md)
===

- display accounts
- create organization
- create accounts: "control accounts", "functional accounts"
- create organizational units
- move accounts to organizational units
- milestones:
  - organization, organizational units, and accounts under organizational units
  - "control accounts" are created (named "logging", "identity", and "publishing")
  - one or more "functional accounts" are created (suggestion: name them after some of planet Saturn's satellites)
  - navigate to any of the accounts from the console using the ```OrganizationAccountAccessRole```

module 3: [automation](instructions/module_3/steps.md)
===

- (provision scheduled function to) trigger builds in CodeBuild
- milestone:
  - deployed CloudFormation stack ```trigger-builds-listener```

module 4: [logging account (illustrated with CloudTrail)](instructions/module_4/steps.md)
===

- (provision scheduled function to) create common bucket to receive logs, owned by "logging" account
- (provision scheduled function to) ensure bucket policy allows logging by CloudTrail from multiple accounts
- (provision scheduled function to) create CloudTrail on all accounts to write logs to common bucket
- (optional, not illustrated for now) use Service Control Policies to restrict use of logging account
- (optional, not illustrated for now) use CloudFormation update policy to restrict who can make changes to CloudFormation stacks
- add new accounts, and verify that CloudTrail is enabled and logging to common bucket
- milestones:
  - deployed CloudFormation stack ```CloudTrail-bucket-on-logging```
  - deployed CloudFormation stack ```CloudTrail-bucket-policy```
  - deployed CloudFormation stack ```CloudTrail-on-all```
  - navigate to any of the accounts (other than logging account) and verify CloudTrail is provisioned
  - navigate to logging account and verify CloudTrail logs from multiple accounts are being written
  - add a new account to the organization, and verify that CloudTrail is similarly provisioned

module 5: [identity account (illustrated with Cross Account Manager)](instructions/module_5/steps.md)
===

- (provision scheduled function to) setup Active Directory in the "identity account" (other alternatives are available)
- enable access to the AWS Management Console via federation
- create users and groups in Active Directory (using EC2 SSM for the workshop)
- (provision scheduled function to) setup the Cross Account Manager component in the "identity account"
- generate and copy account information, roles, and policies to Cross Account Manager
- (provision scheduled function to) setup the Cross Account Manager component in all of the other accounts
- assign groups in Active Directory to roles
- user access to AWS accounts for the assigned role via federation to the console
- milestones:
  - deployed CloudFormation stack ```active-directory-on-identity```
  - deployed CloudFormation stack ```cam-on-identity```
  - deployed CloudFormation stack ```cam-on-sub-accounts```
  - verify DynamoDB tables in identity account for accounts and roles applied (look for ```active``` status)
  - access some account as the designated role

Not illustrated here:
=== 
 
- Service Control Policies to restrict actions on AWS accounts
- Using update policy with CloudFormation stacks 
- Trigger provisioning actions using an alternative mechanism
- Federation using alternatives to Active Directory
- "publishing account" best practice with Service Catalog and launch constraints

Known issues:
===

- Accounts created using the Organizations API cannot be deleted (for now)
- Account name not returned from list-accounts for some time after creation
- Cross Account Manager does not process accounts when an account number begins with zero
- error creating accounts: "Exceeded allowed number of accounts"
