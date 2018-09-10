## Kwitter API

**Basic setup for local development**

- fork this repo
- git clone to your local computer then `cd kwitter-api`
- setup your database:
  - `createdb kwitter` (you must have postgresql installed to have this command)
- create your `.env` file:
  - `cp .env.example .env`
- edit the `.env` file to look like:

```
DATABASE_URL="postgres://127.0.0.1/kwitter"
JWT_SECRET="whateveryouwant"
```

- `DATABASE_URL="postgres://127.0.0.1/kwitter" npm install`
- `node index.js` or `nodemon index.js`

  confirm that the api is working locally by making a request to `GET localhost:3000/messages`

  note: visiting `localhost:3000` will take you to the swagger ui specification, which is currently incomplete. there is also a more complete description of the api in the postman collection file, `Kwitter API.postman_collection.json`
  
  
 ### Feeling Stuck?
 - Make sure to run `$ heroku logs` to read the error message from your deployed instance
 - Refer to this guide https://devcenter.heroku.com/articles/getting-started-with-nodejs as well as other Heroku docs for more information on adjusting config vars and adding a postgres db on Heroku
