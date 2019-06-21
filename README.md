## Kwitter API

### Basic setup for local development

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

- From the command line, type `npm install`
- From the command line, type `node index.js` or `nodemon index.js`

  confirm that the api is working locally by making a request to `GET localhost:3000/messages`

  note: visiting `localhost:3000` will take you to a swagger/openapi documentation page for the available api endpoints. There is also a postman collection file available to use: `Kwitter API.postman_collection.json`

### Basic setup for deploying to heroku

- Create your heorku app from the commandline: `heroku create your-api-name`
- Setup a postgres database addon for your heroku app: `heroku addons:create heroku-postgresql`
- Confirm that a `DATABASE_URL` variable was added to your heroku app: `heroku config`
- Setup your config variable for the `JWT_SECRET` for your heroku app: `heroku config:set JWT_SECRET=whateveryouwant`
- Push code to your heroku app: `git push heroku master`
- Run `heroku logs --tail` to watch logs in real-time to confirm that the status of the app has started up successfully
- Open your app with `heroku open` -- this should automatically take you to the openapi documentation page which lists all the server endpoints.
- For more help, refer to this guide https://devcenter.heroku.com/articles/getting-started-with-nodejs as well as other Heroku docs for more information on adjusting config vars and adding a postgres db on Heroku
