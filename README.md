# API

- [Create User](#create-user)
- [Login](#login)
- [OAuth](#oauth)
  - [Register OAuth Client](#register-oauth-client)

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

**Code** : `200 OK`

**Example**

```json
{
  "accessToken": "4eb92fd7691096a79ba1db311e8358a28f0a6f913c57c3993fd714148620309d259a8438d082824582c6f4a36616abf40023efa574ac8c78e162d87fe565a8c3"
}
```

## OAuth

### Register OAuth Client

**URL** : `/oauth/clients`

**Method** : `POST`

**Auth Required** : Yes

**Body**

| Field             | Type     | Required | Description                                                              |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------ |
| `applicationName` | String   | ✓        | Name of the application.                                                 |
| `description`     | String   | ✓        | Description of the app.                                                  |
| `redirectUris`    | String[] | ✓        | List of all approved URIs to redirect to upon successful authentication. |
| `website`         | String   | ✓        | Homepage of the application.                                             |

**Body Example**

```json
{
  "applicationName": "budget",
  "description": "Financial Independence and Retirement Budget",
  "redirectUris": [
    "https://rudget.com/login/redirect"
  ],
  "website": "https://rudget.com""
}
```

### Success Response

**Code** : `201 CREATED`

**Example**

```json
{
  "id": "687cf1579e0af68a",
  "secret": "813efdbaff2d6da06ce441d8f40123ce8014e997d40305519c3df7cf7ebaa521"
}
```
