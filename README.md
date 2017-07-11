content for the space-odyssey workshop

IMPORTANT: Use ```us-east-1``` as the designated AWS region

organisation of files:

- [doc](doc): documentation including instructions
- [workshop](workshop): utility automation to run workshop
- [templates](templates): CloudFormation templates. 
  - Under [boostrap](templates/bootstrap): to be provisioned by hand
  - Under [automated](templates/automated): to be provisioned by automation
- [functions](functions): Lambda functions implementing automation  
- [executor](executor) and [build specification](buildspec.yml): code for project in CodeBuild