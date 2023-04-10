# Getting Started with React Mobx Teamplate

## Requirements

### To run the app

- NodeJS v.14+
- Yarn

## Main Technologies
Typescript, React, React Router v6, Material UI v5, Mobx v6, Socket.io

## Commands

In the project directory, you can run:

* `yarn start` runs the app in the development mode.\

The page will reload if you make edits.\
You will also see any lint errors in the console.

* `yarn test` launches the test runner in the interactive watch mode.
* `yarn build` Builds the app for production to the `public` folder.\

It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

* `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

* `prettier:fix` runs fixing using prettier
* `yarn lint` runs typescript linters (prettier + eslint)
* `yarn lint:fix` runs fixing using typescript linters

### Running dev server

#### Setup
Before running the dev server you need to:
- Copy `.env.example` file to `.env` file in the root directory.
- Install modules for nodejs using the `yarn` command.

To run the dev server use: `yarn start`.

The app is available at `http://localhost:3000`

## Directories

`./public` - Contains static files such as index. html, javascript library files, images, and other assets, etc. which you don't want to be processed by webpack

`./src/api` - API logic

`./src/components` - Contains reusable components

`./src/layouts` - Base screen components

`./src/routes` - Components for routes

`./src/stores` - Mobx stores

`./src/types` - Global typescript interfaces



