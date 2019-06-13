# API

- [Create User](#create-user)
- [Login](#login)

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

## Login

**URL** : `/auth`

**Method** : `POST`

**Auth Required** : No

**Body**

```json
{
  "email": "[email of the user]",
  "password": "[password in plain text]"
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

**Code** : `200 CREATED`

**Example**

```json
{
  "accessToken": "4eb92fd7691096a79ba1db311e8358a28f0a6f913c57c3993fd714148620309d259a8438d082824582c6f4a36616abf40023efa574ac8c78e162d87fe565a8c3"
}
```
