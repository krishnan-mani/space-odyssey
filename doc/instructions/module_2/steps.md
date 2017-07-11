- Create an organization

```
workshop $ rake create_organization

```

- Create control accounts

```
workshop $ rake create_control_accounts["krishman@amazon.com","space-odyssey-01"]

```

- Create some accounts

```
workshop $ rake create_account["dione","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["enceladus","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["iapetus","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["rhea","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["mimas","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["tethys","krishman@amazon.com","space-odyssey-01"]
workshop $ rake create_account["titan","krishman@amazon.com","space-odyssey-01"]

```

- Create some organizational units

```
workshop $ rake create_organizational_unit["saturn"]

```

- Add some accounts to an organizational unit

```
workshop $ rake add_account_to_ou["dione","saturn"]

```

- Navigate to an account from the console

```
workshop $ rake navigate["dione"]

```