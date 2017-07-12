- Use manifest to provision the function for ```trigger-identity-active-directory```

```
workshop $ cp manifest.yml.step-6.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```

- Configure Active Directory to set the access URL
- Configure Active Directory to enable access to the ```AWS Management Console```

- Use manifest to provision the functions for ```trigger-identity-cam```

```
workshop $ cp manifest.yml.step-7.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```

- Generate the accounts file and inspect the same

```
workshop $ rake generate_accounts_file
# see file: account/account.yaml

```

- Visually inspect the roles and policies
- Upload the accounts file, roles, and policies for Cross Account Manager

```
workshop $ rake navigate["identity"]
# navigate to identity account

workshop $ rake upload_account_files
# navigate to identity account
# verify files were processed 

```

- Use manifest to provision the functions for ```trigger-other-sub-account-cam```

```
workshop $ cp manifest.yml.step-8.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status

```
