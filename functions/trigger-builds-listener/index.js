exports.handler = function (event, context) {

    var message = event.Records[0].Sns.Message;
    var jsonMessage = JSON.parse(message);

    var projectName = jsonMessage["default"]["BuildProjectName"];
    var targetAccountId = jsonMessage["default"]["TargetAccountId"];
    var identityAccountId = jsonMessage["default"]["IdentityAccountId"] || "not-available";
    var organizationId = jsonMessage["default"]["OrganizationId"];
    var purpose = jsonMessage["default"]["Purpose"];
    var capabilityIAMNeeded = jsonMessage["default"]["CapabilityIAMNeeded"] || "false";
    var capabilityNamedIAMNeeded = jsonMessage["default"]["CapabilityNamedIAMNeeded"] || "false";
    var recreateStack = jsonMessage["default"]["RecreateStack"] || "false";

    var buildParams = {
        projectName: projectName,
        artifactsOverride: {
            type: 'NO_ARTIFACTS'
        },
        environmentVariablesOverride: [
            {
                name: 'TARGET_ACCOUNT_ID',
                value: targetAccountId
            },
            {
                name: 'IDENTITY_ACCOUNT_ID',
                value: identityAccountId
            },
            {
                name: 'ORGANIZATION_ID',
                value: organizationId
            },
            {
                name: 'PURPOSE',
                value: purpose
            },
            {
                name: 'CAPABILITY_IAM_NEEDED',
                value: capabilityIAMNeeded
            },
            {
                name: 'CAPABILITY_NAMED_IAM_NEEDED',
                value: capabilityNamedIAMNeeded
            },
            {
                name: 'RECREATE_STACK',
                value: recreateStack
            }
        ]
    };

    var AWS = require('aws-sdk');
    var codebuild = new AWS.CodeBuild();
    codebuild.startBuild(buildParams, function (err, data) {
        if (err) {
            console.log("Error starting build", projectName);
            console.log(err, err.stack);
        } else {
            console.log(JSON.stringify(data));
        }
    });
}