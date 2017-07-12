exports.handler = function (event, context) {

    var AWS = require('aws-sdk');
    var organizations = new AWS.Organizations();

    organizations.describeOrganization({}, function (err, data) {
        if (err) {
            console.log("Error describing organization");
            console.log(err, err.stack);
        } else {
            var organizationId = data.Organization.Id;
            organizations.listAccounts({}, function (err, data) {
                if (err) {
                    console.log("Error listing accounts");
                    console.log(err, err.stack);
                } else {
                    var accounts = data.Accounts;
                    var loggingAccountId = null;
                    var bucketName = "cloudtrail-logs-" + organizationId;
                    var resources = [];
                    accounts.forEach(function (account) {
                        if (account.Name === "logging") {
                            loggingAccountId = account.Id;
                            console.log("Obtained logging account Id", loggingAccountId);
                        }

                        var accountResource = "arn:aws:s3:::" + bucketName + "/AWSLogs" + "/" + account.Id + "/*";
                        resources.push(accountResource);
                    })

                    var bucketPolicy = {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Sid": "AWSCloudTrailAclCheck",
                                "Effect": "Allow",
                                "Principal": {
                                    "Service": "cloudtrail.amazonaws.com"
                                },
                                "Action": "s3:GetBucketAcl",
                                "Resource": "arn:aws:s3:::" + bucketName
                            },
                            {
                                "Sid": "AWSCloudTrailWrite",
                                "Effect": "Allow",
                                "Principal": {
                                    "Service": "cloudtrail.amazonaws.com"
                                },
                                "Action": "s3:PutObject",
                                "Resource": resources,
                                "Condition": {
                                    "StringEquals": {
                                        "s3:x-amz-acl": "bucket-owner-full-control"
                                    }
                                }
                            }
                        ]
                    };

                    var roleArn = "arn:aws:iam::" + loggingAccountId + ":role/OrganizationAccountAccessRole";
                    var roleSessionName = "bucket-policy-" + loggingAccountId;
                    var roleParams = {
                        RoleArn: roleArn,
                        RoleSessionName: roleSessionName
                    };

                    var sts = new AWS.STS();
                    sts.assumeRole(roleParams, function (err, data) {
                        if (err) {
                            console.log("error assuming role");
                            console.log(err, err.stack);
                        } else {
                            var accessKeyId = data["Credentials"]["AccessKeyId"];
                            var secretAccessKey = data["Credentials"]["SecretAccessKey"];
                            var sessionToken = data["Credentials"]["SessionToken"];

                            var s3 = new AWS.S3({
                                accessKeyId: accessKeyId,
                                secretAccessKey: secretAccessKey,
                                sessionToken: sessionToken
                            });

                            var bucketPolicyParams = {
                                Bucket: bucketName,
                                Policy: JSON.stringify(bucketPolicy)
                            };

                            s3.putBucketPolicy(bucketPolicyParams, function (err, data) {
                                if (err) {
                                    console.log("Error putting bucket policy");
                                    console.log(err, err.stack);
                                } else {
                                    console.log("Success putting bucket policy");
                                }
                            });
                        }
                    })
                }
            });
        }
    });
}