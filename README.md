# Overview

The dealership-website is a multi-domain web application that uses the [Nuxt3](https://nuxt.com/) framework for building server-side rendered Vue.js applications. This app displays different content based on the domain (shops), and you can learn more about dynamic content switching by checking the `server/middleware/domain-mapper.ts` file.

The mapping JSON file for dynamic content is stored in an S3 bucket. You can find the link to the S3 bucket in the `DOMAIN_MAP_FILE` variable in your `.env` file.

## Installation

### Runtime Dependency

To run this app, you will either need docker or need to have the following installed on your machine:

- Node.js (version 18 or higher)

- NPM (version 9.3.1 or higher)

### Get started: How to clone this project locally to your machine.

To get started with the app, follow these steps:

1. Create a ssh key and save it in your github account.

2. Start Git bash console, navigate to a desire folder you want to save your project e.g, `cd dealership-websites`.

3. Clone the repo to: `git clone git@github.com:Mycardia/cardia-dw-fe.git`

4. After cloning, type `code . + enter`(your IDE should open now).

5. Copy the `.env` file: `cp .env.example .env`

6. In your IDE terminal run npm install.

7. Then run the project `npm run dev`.

The app should now be running at `http://localhost:5005`.

### With Docker

8. Copy the `docker-compose.example.yml` file: `cp docker-compose.example.yml docker-compose.yml`

9. Start the Docker instance: `docker compose up`

# Maintenance details

### How to Use Nuxt SVGO

You can use SVG images in Vue components by importing the SVG file and using it as a component. Follow these steps:

1. Import the SVG file in your Vue component using the `import` statement. For example:

```html
<script lang="ts" setup>
  import sendIcon from '@/assets/svg/send-icon.svg';
</script>
```

3. Use the SVG component in your template like any other HTML tag. For example:

```html
<template>
  ...
  <button><sendIcon></sendIcon> Send</button>
  ....
</template>
```

## Linting and Formating

This project includes commands for linting and formatting your code to ensure consistency and maintainability.

### ESLint

To run ESLint on all soruce files in the project directory, ignoring any files specified in `.gitignore`, use the following command:

`npm run lint`

This command will report any linting errors found in the files.

To automatically fix any linting errors that can be automatically fixed, use the following command:
`npm run lint:fix`

This command will modify the files in place.
You can find the liniting configuration in `.eslintrc.cjs` file.
Learn more about ESLint [here](https://eslint.org/).

### Prettier

To run Prettier on all files in the project directory and automatically format them according to the Prettier rules, use the following command:

`npm run prettier:fix`

This command will modify the files in place.

Learn more about Prettier [here](https://prettier.io/).

# Deployment

## Build

You can use the following build commands in `package.json` to generate the build for the respective environment by taking environment variables from the respective env files:

```json
{
  //package.json#scripts
  "build": "nuxt build",
  "build:staging": "nuxt build --dotenv .env.staging",
  "build:production": "nuxt build --dotenv .env.production"
}
```

## Preview

To preview the site, you can run the build using `npm run preview` or `node ./.output/server/index.mjs`. The site will open in your default browser.

## Bundling

You can use the bundler command `npm run bundle` to zip the build with an appropriate name, including the date and version. You can pass a parameter `--tag=` to name the build bundle.

The bundled zip files will be available in the `build-bundles` folder.

## Build + Bundling

Additionally, you can use the following pack commands to build and bundle for the respective environment

```json
{
  //package.json#scripts
  "pack:staging": "npm run build:staging && npm run bundle -- --tag=staging",
  "pack:production": "npm run build:production && npm run bundle -- --tag=production",
  "pack:marketing": "npm run build && npm run bundle -- --tag=marketing"
}
```

Ensure that the environment variables in the corresponding env files are set correctly for the environment you are deploying to.
