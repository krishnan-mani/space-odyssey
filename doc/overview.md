Goals:

- Work with multiple accounts (ownership, access, usage, financial control)
- Ensure security and compliance across accounts
- Manage access at scale
- Ensure agility for teams 
 
How: use workflows to provision new accounts that scale well

the [Dream](dream.md)

Workshop:

- organized into modules
- module 1: preparation and pre-requisites
- module 2: organization, accounts, and organizational units
- module 3: automation
- module 4: logging account (illustrated with CloudTrail)
- module 5: identity account (illustrated with Cross Account Manager)
 
Concepts and principles:

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

module 1: preparation and pre-requisites

- Use any AWS account
- provision a CloudFormation template for "essentials"
- use "rake tasks" to implement the workshop

module 2: organization, accounts, and organizational units

- display accounts
- create organization
- create accounts: "control accounts", "functional accounts"
- create organizational units
- move accounts to organizational units 

module 3: automation

- (provision scheduled function to) create the role for CodeBuild
- (provision scheduled function to) trigger builds in CodeBuild

module 4: logging account (illustrated with CloudTrail)

- create common bucket to receive logs, owned by "logging" account
- ensure bucket policy allows logging from CloudTrail from multiple accounts
- provision CloudTrail on all accounts to write logs to common bucket
- (optional) use Service Control Policies to restrict use of logging account
- (optional) use CloudFormation update policy to restrict who can make changes to CloudFormation stacks
- add new accounts, and verify that CloudTrail is enabled and logging to common bucket

module 5: identity account (illustrated with Cross Account Manager)

- provision Active Directory in the "identity account" (other alternatives are available)
- enable access to the AWS Management Console via federation
- create users and groups in Active Directory (using EC2 SSM for the workshop)
- provision the Cross Account Manager component in the "identity account"
- generate and copy account information, roles, and policies to Cross Account Manager
- provision the Cross Account Manager component in all of the other accounts
- assign groups in Active Directory to roles
- user access to AWS accounts for the assigned role via federation to the console