- Use manifest to provision the function for ```trigger-logging-CloudTrail-bucket```

```
workshop $ cp manifest.yml.step-3.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```

- Use manifest to provision the function for ```create-CloudTrail-bucket-policy```

```
workshop $ cp manifest.yml.step-4.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```
           
- Use manifest to provision the function for ```trigger-all-CloudTrail```

```
workshop $ cp manifest.yml.step-5.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```   

- Navigate to the logging account and verify that the bucket is created and a bucket policy is applied that allows other accounts to write CloudTrail logs to the bucket

```
workshop $ rake navigate["logging"]

# Copy the URL and use the AWS Management console to verify
 
```

- Navigate to some functional account and verify that CloudTrail is provisioned and is logging to the common bucket

```
workshop $ rake navigate["enceladus"]

```