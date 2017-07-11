var AWS = require('aws-sdk');

exports.handler = function (event, context) {
    var organizations = new AWS.Organizations();

    var masterAccountId = "";
    organizations.describeOrganization({}, function (err, data) {
        if (err) {
            console.log("Error describing organization");
            console.log(err, err.stack);
        } else {
            masterAccountId = data.Organization.MasterAccountId;
            if (err) {
                console.log("Error listing accounts");
                console.log(err, err.stack);
            } else {

                organizations.listAccounts({}, function (err, data) {
                    if (err) {
                        console.log("Error listing accounts");
                        console.log(err, err.stack);
                    } else {
                        var accounts = [];
                        data.Accounts.forEach(function (account) {
                            var accountId = account.Id;
                            var accountName = account.Name;
                            if (accountId === masterAccountId) {
                                return;
                            }
                            accounts.push({Id: account.Id, Name: account.Name});
                        })

                        var resources = [];
                        accounts.forEach(function (account) {
                            var accountId = account.Id;
                            var roleArn = "arn:aws:iam::" + accountId + ":role/OrganizationAccountAccessRole";
                            resources.push(roleArn);
                        })

                        var permissionsPolicyDocument = {
                            "Version": "2012-10-17",
                            "Statement": {
                                "Effect": "Allow",
                                "Action": "sts:AssumeRole",
                                "Resource": resources
                            }
                        }

                        var roleName = "CodeBuild-CrossAccount-ServiceRole";
                        var roleExists = false;

                        var iam = new AWS.IAM();
                        iam.getRole({RoleName: roleName}, function (err, data) {
                            if (err) {
                                console.log("Error describing role");
                                console.log(err, err.stack);
                                roleExists = false;
                            } else {
                                roleExists = true;
                            }
                        });

                        if (!roleExists) {
                            var assumeRolePolicyDocument = {
                                "Version": "2012-10-17",
                                "Statement": [
                                    {
                                        "Effect": "Allow",
                                        "Action": "sts:AssumeRole",
                                        "Principal": {"Service": "codebuild.amazonaws.com"},
                                    }
                                ]
                            };

                            var createRoleParams = {
                                AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyDocument),
                                RoleName: roleName
                            };

                            iam.createRole(createRoleParams, function (err, data) {
                                if (err) {
                                    console.log("Error creating role");
                                    console.log(err, err.stack);
                                } else {
                                    console.log("Create role succeeded")
                                }
                            });
                        }

                        var putRolePolicyParams = {
                            PolicyDocument: JSON.stringify(permissionsPolicyDocument),
                            PolicyName: "assume-role-on-accounts",
                            RoleName: roleName
                        };

                        iam.putRolePolicy(putRolePolicyParams, function (err, data) {
                            if (err) {
                                console.log("Error putting role policy", "assume-role-on-accounts");
                                console.log(err, err.stack);
                            } else {
                                console.log("Put role policy succeeded")
                            }
                        });

                        var codeBuildBasicPolicyDocument = {
                            "Version": "2012-10-17",
                            "Statement": [
                                {"Effect": "Allow", "Resource": "*", "Action": "*"}
                            ]
                        };

                        var putCodeBuildPolicyParams = {
                            PolicyDocument: JSON.stringify(codeBuildBasicPolicyDocument),
                            PolicyName: "CodeBuild-basic-policy",
                            RoleName: roleName
                        };

                        iam.putRolePolicy(putCodeBuildPolicyParams, function (err, data) {
                            if (err) {
                                console.log("Error putting role policy", "CodeBuild-basic-policy");
                                console.log(err, err.stack);
                            } else {
                                console.log("Put role policy succeeded")
                            }
                        });
                    }
                });
            }
        }
    })
}
