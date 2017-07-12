/*

 Given a purpose, and an optional control account,
 Publish one or more events to a topic
 To eventually trigger the build project with the corresponding purpose and target account id

 */

exports.handler = function (event, context) {

    var destinationTopicArn = process.env.DESTINATION_TOPIC_ARN;
    var controlAccount = process.env.CONTROL_ACCOUNT;
    var buildProjectName = process.env.BUILD_PROJECT;
    var purpose = process.env.PURPOSE;
    var excludeAccount = process.env.EXCLUDE_ACCOUNT || "none";
    var capabilityIAMNeeded = process.env.CAPABILITY_IAM_NEEDED || false;
    var capabilityNamedIAMNeeded = process.env.CAPABILITY_NAMED_IAM_NEEDED || false;
    var recreateStack = process.env.RECREATE_STACK || false;

    var AWS = require('aws-sdk');
    var organizations = new AWS.Organizations();
    organizations.describeOrganization({}, function (err, data) {
        if (err) {
            console.log("Error describing organization");
            console.log(err, err.stack);
        } else {
            var organizationId = data.Organization.Id;
            var masterAccountId = data.Organization.MasterAccountId;

            var loggingAccountId = null;
            var identityAccountId = null;
            var publishingAccountId = null;
            var allAccounts = {};

            organizations.listAccounts({}, function (err, data) {
                if (err) {
                    console.log("Error listing accounts");
                    console.log(err, err.stack);
                } else {
                    data.Accounts.forEach(function (account) {
                        var accountId = account.Id;
                        var accountName = account.Name;
                        allAccounts[accountName] = accountId;
                    });

                    loggingAccountId = allAccounts["logging"];
                    identityAccountId = allAccounts["identity"];
                    publishingAccountId = allAccounts["publishing"];

                    var accounts = {
                        "master": masterAccountId,
                        "logging": loggingAccountId,
                        "identity": identityAccountId,
                        "publishing": publishingAccountId,
                        "all": allAccounts
                    };

                    if ((controlAccount === "all") || (excludeAccount !== "none")) {
                        for (var accountName in allAccounts) {
                            if (accountName === excludeAccount) {
                                console.log("Skipping account", excludeAccount);
                                continue;
                            }

                            var sns = new AWS.SNS();
                            var perAccountMessageBody = {
                                "default": {
                                    Purpose: purpose,
                                    TargetAccountId: allAccounts[accountName],
                                    IdentityAccountId: identityAccountId,
                                    OrganizationId: organizationId,
                                    BuildProjectName: buildProjectName,
                                    CapabilityIAMNeeded: capabilityIAMNeeded,
                                    CapabilityNamedIAMNeeded: capabilityNamedIAMNeeded,
                                    RecreateStack: recreateStack
                                }
                            };
                            var perAccountMessage = JSON.stringify(perAccountMessageBody);
                            var sendSNSParams = {
                                Message: perAccountMessage,
                                TopicArn: destinationTopicArn
                            };

                            sns.publish(sendSNSParams, function (err, data) {
                                if (err) {
                                    console.log("Error publishing notification to topic")
                                    console.log(err, err.stack);
                                }
                                else {
                                    console.log("Sent message successfully to individual account");
                                }
                            });
                        }
                    } else {
                        var messageBody = {
                            "default": {
                                Purpose: purpose,
                                TargetAccountId: accounts[controlAccount],
                                IdentityAccountId: identityAccountId,
                                OrganizationId: organizationId,
                                BuildProjectName: buildProjectName,
                                CapabilityIAMNeeded: capabilityIAMNeeded,
                                CapabilityNamedIAMNeeded: capabilityNamedIAMNeeded,
                                RecreateStack: recreateStack
                            }
                        };
                        var Message = JSON.stringify(messageBody);
                        var sns = new AWS.SNS();
                        var params = {
                            Message: Message,
                            TopicArn: destinationTopicArn
                        };

                        sns.publish(params, function (err, data) {
                            if (err) {
                                console.log("Error publishing notification to topic")
                                console.log(err, err.stack);
                            }
                            else {
                                console.log("Sent message successfully to control account");
                            }
                        });
                    }
                }
            })
        }
    });
}