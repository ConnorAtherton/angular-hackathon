# Angular hackathon
##### An opinionated node project boilerplate for angular applications.

## Getting started
- Clone this repository
- Navigate in and run ```npm install && bower install```

**If you want to try the local authentication you will need to have mongodb installed.**
- ```cd server``` then ```node app``` to start the server
- Run ```mongod``` in a separate shell to start mongo
- In a new shell again run ```gulp``` to build and watch for changes (**this is buggy, see TODO below**)

## Undocumented features
I'm still building out the project so it doesn't link together properly quite yet. Here are some things
you can look at though.

### Testing authentication
There is already one user in the database with these credentials
```email: 'example@example.com' password: 'password'```

- Login and Register
- You'll be taken back home but shown a different page

A retry queue is built in to the ```auth``` service which means if you try to navigate to a page that requires authentication
you'll first be redirected to the login page. Once you've entered your creds you'll automatically be taken back to the page you
originally tried to access.

### Testing websockets
- Navigate to ```http://localhost:9000/chat```
- Open two different browser tabs and verify messages are passed between them

### Static responses
If a route doesn't match one registered with express the default behaviour is to deal with HTML5 mode
and send back the page that included the angular application. Angular can then check if the route is registered
and if not it can show a 404 page.

Node can still serve static pages and custom responses because of this. All static routes are stored in ```server/routes/static```.
To check this is working navigate to ```http:localhost:9000/test``` and the response should be a simple message.

## TODO
- The gulpfile is quite buggy and I haven't figured out why yet
- ~~Make it look better~~
- Add flash messages that are emitted to the client
- ~~Add websockets as a default service~~
- Enable login through github and other popular sites
- Starting adding external apis like Stripe

## API keys
It's bad practice to check in api keys using git. I've provided them in this project
so you can get up and running quickly and to verify that authentiction/authorisation
does work.


