## Random users api

- https://api.api-ninjas.com/v1/randomuser
- https://randomuser.me/api/

## Mockaroo api

- https://my.api.mockaroo.com/user50/v1?key=5f2b4090
- https://my.api.mockaroo.com/user/v1?key=5f2b4090

## Mock data schemas/model

- https://www.mockaroo.com/

## svg

1. avatar
   - https://www.freeimages.com/tw/illustrations/vector/svg
   - https://www.svgrepo.com

## schemas

- user

  - \_id
  - user_id (deprecated)
  - name.frist
  - name.last
  - gender
  - dob
  - email
  - avatar
  - password

- avatar
  - \_id
  - index
  - avatar
  - category
  - md5_hash

## DOM name list

- user_id (deprecated)
- \_id
- name_first
- name_last
- gender
- dob
- email
- avatar
- password

## mongodb database

- users
- avatar

## users api

- feature jsonConvertTypes
- feature eliminateNonAllowedProps
- feature isValidJson
- feature manipulateJson
- feature isValidSchema
- feature bodyArray
- feature usersInfoSchema
- feature testSchema
- [GET] users/test

- [x] [GET] users/view
- [x] [GET] users/view_user_add
- [x] [POST] users/user_add
- [x] [GET] users/view_user_edit
- [x] [POST] users/user_edit
- [x] [GET] users/view_user_details
- [x] [GET] users/user_delete_all
- [x] [GET] users/user_delete/:id

## external api

- [x] [GET] external/randomuser/user_get
- [x] [GET] external/mockaroo/user50_get
- [x] [GET] external/mockaroo/user_get

## src api

- [x] [GET] src/svg/avatar
- [ ]in process [POST] src/svg/avatar_add

## test src

## view src

- users.ejs

  1.  users list
  2.  add user
  3.  edit user
  4.  delete user
  5.  reset user database
  6.  export user database
  7.  import user database
  8.  delete all users

- [x]user_add.ejs

  1.  user form
  2.  ramdom user info
  3.  reset user info
  4.  confirm to add user
  5.  back to users list

- [x]user_edit.ejs

  1.  user form
  2.  confirm to edit user
  3.  back to users list

- [x]user_details.ejs

  1.  user form
  2.  back to users list
