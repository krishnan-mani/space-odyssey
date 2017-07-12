- Use manifest to provision the function for ```trigger-identity-active-directory```

```bash
$ cd workshop/
workshop $ cp manifest.yml.step-6.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status
```

*NOTE*: Perform the following steps with Active Directory later (since provisioning Active Directory is time-consuming and these steps are independent of the subsequent steps)

- Configure Active Directory to set a unique access URL (hint: use organization Id), and enabled single sign-on
- Configure Active Directory to enable access to the ```AWS Management Console```

- Use manifest to provision the functions for ```trigger-identity-cam```

```bash
workshop $ cp manifest.yml.step-7.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status
```

- Generate the accounts file and inspect the same

```bash
workshop $ rake generate_accounts_file
# see file: account/account.yaml
```

- Visually inspect the roles and policies
- Upload the accounts file, roles, and policies for Cross Account Manager

```bash
workshop $ rake navigate["identity"]
# navigate to identity account

workshop $ rake upload_account_files
# navigate to identity account
# verify files were processed 
```

- Use manifest to provision the functions for ```trigger-other-sub-account-cam```

```bash
workshop $ cp manifest.yml.step-8.example manifest.yml
workshop $ rake process_manifest
workshop $ rake describe_manifest_status
```

- Assign roles to the groups in Active Directory
