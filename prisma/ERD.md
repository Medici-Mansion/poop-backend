# Poop-backend
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

## default
```mermaid
erDiagram
"breeds" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String nameKR "nullable"
  String nameEN "nullable"
  String avatar "nullable"
}
"profiles" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String avatarUrl "nullable"
  String name
  DateTime birthday
  Gender gender
  String breedId FK
  String userId FK
}
"users" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String accountId
  String password
  String nickname UK
  String email UK "nullable"
  String phone UK "nullable"
  DateTime birthday
  Gender gender
  DateTime verified "nullable"
  String latestToken "nullable"
  String latestProfileId FK "nullable"
}
"verification" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String code
  String userId FK
}
"graphics" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String name UK
  String url UK
  GraphicType type
  GraphicsCategory category "nullable"
}
"search_breeds" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
  String nameKR
  String nameEN "nullable"
  String avatar "nullable"
  String searchKey
  Int searchKeyCode "nullable"
}
"profiles" }o--|| "breeds" : breed
"profiles" }o--|| "users" : user
"users" |o--o| "profiles" : latestProfile
"verification" |o--|| "users" : user
```

### `breeds`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `nameKR`: 
  - `nameEN`: 
  - `avatar`: 

### `profiles`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `avatarUrl`: 
  - `name`: 
  - `birthday`: 
  - `gender`: 
  - `breedId`: 
  - `userId`: 

### `users`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `accountId`: 
  - `password`: 
  - `nickname`: 
  - `email`: 
  - `phone`: 
  - `birthday`: 
  - `gender`: 
  - `verified`: 
  - `latestToken`: 
  - `latestProfileId`: 

### `verification`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `code`: 
  - `userId`: 

### `graphics`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `name`: 
  - `url`: 
  - `type`: 
  - `category`: 

### `search_breeds`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `deletedAt`: 
  - `nameKR`: 
  - `nameEN`: 
  - `avatar`: 
  - `searchKey`: 
  - `searchKeyCode`: 