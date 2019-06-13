# API

- [Create User](#create-user)

## Create User

**URL** : `/user`

**Method** : `POST`

**Auth Required** : No

**Body**

```json
{
  "email": "[email of the user]",
  "password": "[password in plain text]",
  "firstName": "[users first name]",
  "lastName": "[users last name]"
}
```

**Body Example**

```json
{
  "email": "john@gmail.com",
  "password": "thePassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Success Response

**Code** : `201 CREATED`
