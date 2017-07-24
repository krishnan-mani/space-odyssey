- Create control accounts

```bash
$ cd workshop/
workshop $ rake create_control_accounts["REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
```

- Create some accounts

```bash
workshop $ rake create_account["dione","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["enceladus","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["iapetus","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["rhea","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["mimas","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["tethys","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
workshop $ rake create_account["titan","REPLACE-WITH-YOUR-EMAIL-ADDRESS","space-odyssey-01"]
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