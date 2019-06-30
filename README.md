# API

- [Create User](#create-user)
- [Login](#login)
- [Budgets](#budgets)

### Create User

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

#### Success Response

**Code** : `201 CREATED`

### Login

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

#### Success Response

**Code** : `200 OK`

**Example**

```json
{
  "accessToken": "4eb92fd7691096a79ba1db311e8358a28f0a6f913c57c3993fd714148620309d259a8438d082824582c6f4a36616abf40023efa574ac8c78e162d87fe565a8c3"
}
```

## Buggets

### Get All Budgets

**URL** : `/budgets`

**Method** : `GET`

**Auth Required** : Yes

#### Success Response

**Code** : `200 OK`

**Example**

```json
[
  {
    "id": "e5074faa-d901-488c-97a2-7538536d3ec1",
    "budget": "My Budget"
  },
  {
    "id": "1f597704-90e2-404d-b9af-36040f40f30b",
    "budget": "Shared Budget"
  }
]
```

### Get Budget

**URL** : `/budgets/:budgetId`

**Method** : `GET`

**Auth Required** : Yes

#### Success Response

**Code** : `200 OK`

**Example**

```json
{
  "id": "e5074faa-d901-488c-97a2-7538536d3ec1",
  "name": "My Budget",
  "groups": [
    {
      "id": "4062bbb7-45cc-4f91-8d9c-0c82ccdda83c",
      "name": "Housing",
      "categories": [
        {
          "id": "92a58074-f1c1-4373-8f4d-b07a25a1672a",
          "name": "Rent"
        },
        {
          "id": "5814aeca-94e2-436e-bd0a-2014010af190",
          "name": "Electric"
        },
        {
          "id": "365b9a03-f733-402d-87e1-e3a53c24c58d",
          "name": "Gas"
        },
        {
          "id": "60e4f997-a94f-4e4a-82a7-796367e2d3a7",
          "name": "Internet"
        }
      ]
    },
    {
      "id": "0107c797-8aa2-4218-8ad8-51cbc5a66a77",
      "name": "Food",
      "categories": [
        {
          "id": "517bb198-a091-4c1f-a7c4-465eac242a6c",
          "name": "Dining"
        },
        {
          "id": "f23c0e3c-a596-48e3-a24d-061b970c2f0b",
          "name": "Snacks"
        },
        {
          "id": "38b9fee0-d24d-432b-8045-6448fbb9a502",
          "name": "Groceries"
        }
      ]
    }
  ]
}
```
