# Backend
The backend is a docker compose with 2 containers/services:
* a basic mysql container on private network
* an express api in a node base container

On start, the express service will attempt to seed the db. The db is mounted, so re-seeding is not necessary if it crashes, since the mount will persist the db state. 

**start orchestration:** `docker compose up`
**tests**: `cd backend && npm run test`

# Frontend 
The front end for this application is a React / Vite application. 
Routing: react router
State: Redux/ (toolkit)
**start app:**`npm run dev`
**tests**: `npm run test`


## Improvements
- more tests
- run linting and tests on container start or pre-build
- dockerize FE (probably unnecessary)