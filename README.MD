# ![ATTO.CO](frontend/src/assets/images/logo.png)
A opensource [Bitly-like website](https://bitly.com) mainly build to learn to integrate Reactjs with a backend. In this case: Flask!

Note that this project uses a custom built JWT-based backend auth system, which can be found in the backend/app/security folder. I know implementing something like that is "bad-practice", but I wanted to learn something.

## Current State:
1. Finished the implementation of the Forms and Alerts and the most important css-classes
2. Frontend auth logic is more or less implemented
3. backend structure along with the DB-Models are finished for now

## Current Struggels:
1. Despite all attempts Flask-Cors won't work which makes further production on localhost almost impossible => Either migrate the project to ngnix or use django for the backend
2. Flask-Admin is still buggy for whatever reason


