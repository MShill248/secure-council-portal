# ECHO - Secure Council Portal

## Application Overview

This repository hosts a microservices-based application designed for the Secure Council Portal, serving both **Council** and **Residents**.

- **For Council**:  
  Council users can track requests made by residents in their borough, respond to these requests via a message, mark requests as resolved or reviewed, see data visualisations, make their own requests, update and change account information.

- **For Residents**:  
  Residents can make requests, track the status of their request and download a pdf with a report detailing their request. They also have access to data visualisations and can make changes to their account.

The system leverages multiple microservices, including APIs for the portal and data visualisation, with a centralised PostgreSQL database and Dockerised deployment for development, testing, and production environments.

## Node-API Documentation

## User

<details>
<summary> Expand / Collapse</summary>

#### GET - Index

- /user returns:

```
[
    {
        "user_id": 1,
        "username": "alicej",
        "first_name": "Alice",
        "last_name": "Johnson",
        "email": "alice.johnson@example.com",
        "password": "password123",
        "dob": "1990-05-11T23:00:00.000Z",
        "address": "12 Oak Street",
        "postcode": "E1 4AB",
        "borough": "Greenwich",
        "phone_number": "07123456789",
        "user_role": "resident"
    },
    {
        "user_id": 2,
        "username": "bobsmith",
        "first_name": "Bob",
        "last_name": "Smith",
        "email": "bob.smith@example.com",
        "password": "password123",
        "dob": "1985-08-21T23:00:00.000Z",
        "address": "34 Pine Avenue",
        "postcode": "E2 5CD",
        "borough": "Hackney",
        "phone_number": "07234567890",
        "user_role": "resident"
    },
    {
        "user_id": 3,
        "username": "charlieb",
        "first_name": "Charlie",
        "last_name": "Brown",
        "email": "charlie.brown@example.com",
        "password": "password123",
        "dob": "1992-11-03T00:00:00.000Z",
        "address": "56 Maple Road",
        "postcode": "E3 6EF",
        "borough": "Tower Hamlets",
        "phone_number": "07345678901",
        "user_role": "resident"
    }
]
```

#### GET - showId

- /user/account returns:

```
{
    "user_id": 1,
    "username": "alicej",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com",
    "password": "password123",
    "dob": "1990-05-11T23:00:00.000Z",
    "address": "12 Oak Street",
    "postcode": "E1 4AB",
    "borough": "Greenwich",
    "phone_number": "07123456789",
    "user_role": "resident"
}
```

#### GET - showUser

- /user/:id (e.g. /user/1) returns:

```
{
    "user_id": 1,
    "username": "alicej",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com",
    "password": "password123",
    "dob": "1990-05-11T23:00:00.000Z",
    "address": "12 Oak Street",
    "postcode": "E1 4AB",
    "borough": "Greenwich",
    "phone_number": "07123456789",
    "user_role": "resident"
}
```

#### PATCH - update

- /user/update
- pass in the information you want to update e.g.:

```
{
    "address": "12 New Address",
    "postcode": "23J 4HF",
    "borough": "Redbridge",
}
```

- returns:

```
{
    "user_id": 1,
    "username": "alicej",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com",
    "password": "password123",
    "dob": "1990-05-11T23:00:00.000Z",
    "address": "12 New Address",
    "postcode": "23J 4HF",
    "borough": "Redbridge",
    "phone_number": "07123456789",
    "user_role": "resident"
}
```

#### DELETE - destroy

- /user/delete

- returns nothing

## </details>

## Auth

<details>
<summary> Expand / Collapse</summary>

#### POST - register

- /auth/register, input all required information, returns:

```
{
    "username": "alicej",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com",
    "password": "password123",
    "dob": "1990-05-11T23:00:00.000Z",
    "address": "12 Oak Street",
    "postcode": "E1 4AB",
    "borough": "Greenwich",
    "phone_number": "07123456789",
    "user_role": "resident"
}

```

#### POST - login

- /auth/login input:

```
{
    "username": "alicej",
    "password": "password123",
}
```

- returns:

```
{
    "success": true,
    "message": "OTP sent to email",
    "username": "alicej"
}
```

#### POST - verifyOtp

- /auth/verify input:

```
{
    "username": "alicej",
    "otp": "123456"
}
```

- returns:

```
{
    "success": true,
    "token": "jwt",
    "user_id": 1,
    "user_role": "resident"
}
```

#### POST - sendOtp

- /auth/sendOtp input:

```
{
    "username": "alicej"
}
```

- returns:

```
{
    "success": true,
    "message": "OTP sent to email.",
    "username": "alicej"
}
```

#### POST - verifyPassword

- /auth/verifyPassword input:

```
{
    "username": alicej,
    "existingPassword": "password"
    "newPassword": "new",
    "confirmNewPassword": "new"
}
```

#### POST - sendPdf

- /auth/sendPdf
- requires:

```
{
    "username": "alicej"
    "pdfFile": "req.file.buffer"
}
```

## </details>

## Message

<details>
<summary> Expand / Collapse</summary>

#### GET - Index

- /message returns:

```
[
    {
        "message_id": 3,
        "request_id": 3,
        "sender_id": 6,
        "receiver_id": 5,
        "content": "Thanks for sending this over.",
        "timestamp": "2025-09-02T08:30:00.000Z"
    },
    {
        "message_id": 2,
        "request_id": 2,
        "sender_id": 6,
        "receiver_id": 4,
        "content": "Can you provide more details?",
        "timestamp": "2025-09-01T10:45:00.000Z"
    },
    {
        "message_id": 1,
        "request_id": 1,
        "sender_id": 6,
        "receiver_id": 2,
        "content": "Hi, I wanted to follow up on the request.",
        "timestamp": "2025-09-01T09:15:00.000Z"
    }
]
```

#### GET - getByRequestId

- /message/request/:id returns:

```
[
    {
        "message_id": 1,
        "request_id": 1,
        "sender_id": 6,
        "receiver_id": 2,
        "content": "Hi, I wanted to follow up on the request.",
        "timestamp": "2025-09-01T09:15:00.000Z"
    }
]
```

#### GET - showId

- /message/:id returns:

```
[
    {
        "message_id": 1,
        "request_id": 1,
        "sender_id": 6,
        "receiver_id": 2,
        "content": "Hi, I wanted to follow up on the request.",
        "timestamp": "2025-09-01T09:15:00.000Z"
    }
]
```

#### POST - create

- /message input:

```
[
    {
        "request_id": 1,
        "sender_id": 6,
        "receiver_id": 2,
        "content": "Hi, I wanted to follow up on the request.",
    }
]
```

#### PATCH - update

- /message/:id
- pass in the information you want to update e.g.:

```
{
    "content": "new message"
}
```

- returns:

```
[
    {
        "message_id": 1,
        "request_id": 1,
        "sender_id": 6,
        "receiver_id": 2,
        "content": "new message",
        "timestamp": "2025-09-01T09:15:00.000Z"
    }
]
```

#### DELETE - destroy

- /message/:id

- returns nothing

## </details>

## Request

<details>
<summary> Expand / Collapse</summary>

#### GET - Index

- /request returns:

```
[
    {
        "request_id": 1,
        "user_id": 1,
        "title": "Streetlight not working",
        "description": "The streetlight outside my house on Elm Street has been out for two weeks.",
        "status": "pending",
        "category": "amenities",
        "priority": 2,
        "type": "incident",
        "created_at": "2025-09-01T09:15:00.000Z",
        "updated_at": "2025-09-01T09:15:00.000Z"
    },
    {
        "request_id": 2,
        "user_id": 2,
        "title": "Pothole repair",
        "description": "Large pothole on the corner of Maple Avenue and 3rd Street is causing traffic issues.",
        "status": "reviewed",
        "category": "amenities",
        "priority": 1,
        "type": "incident",
        "created_at": "2025-09-02T13:40:00.000Z",
        "updated_at": "2025-09-05T08:20:00.000Z"
    },
    {
        "request_id": 3,
        "user_id": 3,
        "title": "Missed waste collection",
        "description": "Our recycling bins were not emptied last Friday on Oak Drive.",
        "status": "resolved",
        "category": "amenities",
        "priority": 3,
        "type": "service",
        "created_at": "2025-09-03T07:05:00.000Z",
        "updated_at": "2025-09-04T15:30:00.000Z"
    }
]
```

#### GET - getByUserId

- /request/user returns:

```
{
    "request_id": 1,
    "user_id": 1,
    "title": "Streetlight not working",
    "description": "The streetlight outside my house on Elm Street has been out for two weeks.",
    "status": "pending",
    "category": "amenities",
    "priority": 2,
    "type": "incident",
    "created_at": "2025-09-01T09:15:00.000Z",
    "updated_at": "2025-09-01T09:15:00.000Z"
}
```

#### GET - showId

- /request/:id returns:

```
{
    "request_id": 1,
    "user_id": 1,
    "title": "Streetlight not working",
    "description": "The streetlight outside my house on Elm Street has been out for two weeks.",
    "status": "pending",
    "category": "amenities",
    "priority": 2,
    "type": "incident",
    "created_at": "2025-09-01T09:15:00.000Z",
    "updated_at": "2025-09-01T09:15:00.000Z"
},
```

#### POST - requestInfo

- /request/requestInfo
- does not require a body, returns data visualisations via python API

#### POST - create

- /request input:

```
{
    "user_id": 1,
    "title": "Streetlight not working",
    "description": "The streetlight outside my house on Elm Street has been out for two weeks.",
    "category": "amenities",
    "type": "incident",
},
```

- returns:

```
{
    "request_id": 1,
    "user_id": 1,
    "title": "Streetlight not working",
    "description": "The streetlight outside my house on Elm Street has been out for two weeks.",
    "status": "pending",
    "category": "amenities",
    "type": "incident",
    "created_at": "2025-09-01T09:15:00.000Z",
    "updated_at": "2025-09-01T09:15:00.000Z"
},
```

#### PATCH - update

- /request/:id
- pass in the information you want to update e.g.:

```
{
    "description": "new description",
    "status": "resolved",
    "priority": 2
}
```

- returns:

```
{
    "request_id": 1,
    "user_id": 1,
    "title": "Streetlight not working",
    "description": "new description",
    "status": "resolved",
    "category": "amenities",
    "type": "incident",
    "priority": 2,
    "created_at": "2025-09-01T09:15:00.000Z",
    "updated_at": "2025-09-01T09:15:00.000Z"
},
```

#### DELETE - destroy

- /request/:id

- returns nothing

</details>
