# Bug Tracker

## REQUIREMENTS BEFORE BUILD

1.  -[x] [Node.js](https://nodejs.org)
2.  -[x] [Yarn](https://yarnpkg.com/g)
3.  -[x] [bug_tracker](https://github.com/krypto-i9/bug-tracker/archive/main.zip) (copy of this repo)
4.  -[x] [AppServ](appserv.org)

## HOW TO BUILD

1.  -[x] Import `test_db.sql` (inside pre_build folder) in `phpmyadmin`
2.  -[x] Download and Install Node.js
3.  -[x] Install `yarn` using `npm install -g yarn` commond in cmd
4.  -[x] Unzip the downloaded `bug_tracker` file.
5.  -[x] Open cmd inside the bug_tracker
6.  -[x] Run `yarn production-build`
7.  -[x] Copy files prodcution_build folder into www folder
8.  -[x] Open browser and goto localhost

## IF YOU DON'T WANT TO BUILD FROM SOURCE

1.  -[x] Import `test_db.sql` (inside pre_build folder) in `phpmyadmin`
2.  -[x] Open `pre_build` folder
3.  -[x] Extract `bug_tracker.zip`
4.  -[x] Copy files inside extracted folder `bug_tracker` to `www`
5.  -[x] Open browser and goto `localhost`

## Available Scripts

In the project directory, you can run:

### `yarn production-build` (USE THIS TO BUILD)

This run `yarn build`. Then copy build files and api into production_build folder.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
