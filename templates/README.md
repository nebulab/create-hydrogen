<img width="1822" alt="image" src="https://user-images.githubusercontent.com/39206652/209194447-05821b19-6637-4cc2-aaa9-08ec60ff6e89.png">

## Overview

This is a template for [Hydrogen](https://shopify.dev/custom-storefronts/hydrogen), a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts. To be more specific, it uses the [Demo Store](https://shopify.dev/custom-storefronts/hydrogen/templates#demo-store-template) template.

## What's included in this template

- Husky git hooks (pre-commit and on the commit message)
- Vercel GitHub Actions integration (with E2E testing)
- Readme with best practices

For Klaviyo integration please visit the [documentation](https://developers.klaviyo.com/en/docs/integrate_with_a_shopify_hydrogen_store) and [integration guide](https://github.com/klaviyo-labs/klaviyo-shopify-hydrogen-example)

## Project setup

- **Shopify**

  - Create a [shopify partner account](https://www.shopify.com/partners)
  - Create 2 [development stores](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores#create-a-development-store-for-testing-apps-or-themes) (for production and staging)
  - Connect the store to Hydrogen: Go to Settings -> Apps and sales channels -> Develop apps for your store -> create an app -> get your API keys under the `API credentials` tab
  - On hydrogen, save the storefront API token to your `PUBLIC_STOREFRONT_API_TOKEN` variable inside the .env file. And to avoid [rate limiting in production](https://shopify.dev/custom-storefronts/hydrogen/deployment#avoid-rate-limiting-in-production) I also recommend creating a [delegate access token](https://shopify.dev/apps/auth/oauth/delegate-access-tokens) and saving it to `PRIVATE_STOREFRONT_API_TOKEN` (but this is optional, you can do it later if you want)

- **Vercel**

  - [Create an account](https://vercel.com/signup) and connect it to github
  - Create a project and connect it to the repository
  - Add the environment variables by clicking on the project -> settings -> environment variables. PS: Add a different store domain and storefront API token for production and staging ([vercel docs](https://vercel.com/docs/concepts/projects/environment-variables#environments))

- **GitHub**

  - Create a staging branch
  - Add all the variables used inside `.github/workflows/*.yaml` to your GitHub repo as secrets. And use all the values for staging, not production (because these secrets will be used to run the tests inside GitHub Actions, and the tests should run on the staging environment). Without these secrets, the tests will run on the hosted demo-store from Shopify.

## Architecture

This is a Frontend-only project, other tools were used to replace a custom backend. The selected e-commerce backend is [Shopify](https://www.shopify.com/). And [Klaviyo](https://www.klaviyo.com/) was used to track events useful for marketing purposes.

The FE communicates directly to the [Shopify Storefront API](https://shopify.dev/api/storefront) through hooks provided by Hydrogen (mainly the `useShopQuery`). If needed, the FE could call other `middleware` API's like [Gadget](https://gadget.dev/), but we are avoiding that (shopify queries inside Hydrogen are more performant and easier to manage).

## Environments

There are two environments: Production (the `main` branch) and Staging/Sandbox (the `staging` branch). Both have the same codebase (deeper explanation for that on [Git Workflow](#git-workflow) and [Hosting](#hosting)), the only difference between these two are which store they are connected to (we change that through [environment variables](https://vercel.com/docs/concepts/projects/environment-variables) on Vercel). The links for each are provided below.

- Production:
  - FE: `[insert domain]`
  - Shopify: `[insert domain]`
- Staging/Sandbox:
  - FE: `[insert domain]`
  - Shipify: `[insert domain]`

## Conventions

- Git:
  - [Conventional Commits](https://www.conventionalcommits.org/) (enforced pre-commit by [Husky](https://typicode.github.io/husky))
  - Use [Rebase](https://www.themoderncoder.com/a-better-git-workflow-with-rebase/) and [Squash](https://www.themoderncoder.com/combining-git-commits-with-squash/) over Merge
- Linting: [Eslint](https://eslint.org/) (runs pre-commit by [Husky](https://typicode.github.io/husky))
- Testing: [E2E testing](https://shopify.dev/custom-storefronts/hydrogen/best-practices/testing) for new pages

## Git Workflow

We use [Trunk Based Development](https://trunkbaseddevelopment.com/). So the steps for creating a new feature are:

- Create a feature branch (the branch name should be copied from the issue on [Linear](https://linear.app/))
- Open PR for `main`
- Once approved by the devs and tested by the shareholders, merge
- GitHub Actions will automaticly merge the new code from `main` to `staging`

## Hosting

The FE is hosted on [Vercel](https://vercel.com/). They generate an [unique URL](https://vercel.com/features/previews) for each deploy/commit/PR (It can be shared with stakeholders/devs for testing purposes). Everything deployed from any branch other than `main` is connected to the Sandbox/Staging store.

A little workaround we had to make on Vercel to make Trunk Based Development work is create a separate `staging` branch that mirrors `main`. (PS: Do NOT merge any code to `staging`, GitHub Actions will be responsible for mirroring the branches).

## CI/CD

As mentioned before, this project uses [GitHub Actions](https://docs.github.com/actions) as CI/CD. Currently there are 3 workflows: 2 are responsible for running E2E testing and deploying to Production and Staging and the other one is responsible for mirroring `main` to the `staging` branch.

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher (preferably the LTS version)
- Yarn

## Generating this template

Run one of the following commands:

```bash
npm init @nebulab/hydrogen
```

```bash
npx @nebulab/create-hydrogen
```

```bash
yarn create @nebulab/hydrogen
```

Using the latest version (recommended):

```bash
npm init @nebulab/hydrogen@latest
```

If for some reason the above commands don't work, you could also install the package globaly:

```bash
npm i -g @nebulab/create-hydrogen
create-hydrogen
```

## Running the dev server

Then `cd` into the new directory and run:

```bash
yarn install
yarn dev
```

Remember to create a `.env` file based on `.env.example`.

## Building for production

```bash
yarn build
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to [Oxygen](https://shopify.dev/custom-storefronts/hydrogen/deployment), build your Hydrogen app and then run `yarn preview`:

```bash
yarn build
yarn preview
```
