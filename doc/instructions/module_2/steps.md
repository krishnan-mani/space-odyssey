- Creating an AWS account requires an email address that is unique (across AWS). In the workshop, we will follow a convention for the email address to register multiple accounts as described below:
  - choose Email (say, ```mailbox@domain```)
  - choose Group (say, ```group```)

Account email address: ```mailbox+group-account@domain```

For example, if you choose a base email address of "bob@example.com", and a Group of "group", an account with name "publishing" will be created with email address "bob+group-publishing@example.com"   

- Create control accounts

```bash
$ cd workshop/
workshop $ rake create_control_accounts["mailbox@domain","group"]

```

- Create some accounts

```bash
workshop $ rake create_account["dione","mailbox@domain","group"]
workshop $ rake create_account["enceladus","mailbox@domain","group"]
workshop $ rake create_account["iapetus","mailbox@domain","group"]
workshop $ rake create_account["rhea","mailbox@domain","group"]
workshop $ rake create_account["mimas","mailbox@domain","group"]
workshop $ rake create_account["tethys","mailbox@domain","group"]
workshop $ rake create_account["titan","mailbox@domain","group"]

```

- Create some organizational units

```bash
workshop $ rake create_organizational_unit["saturn"]

```

- Add some accounts to an organizational unit

```bash
workshop $ rake add_account_to_ou["dione","saturn"]

```

- Navigate to an account from the console

```bash
workshop $ rake navigate["dione"]

```