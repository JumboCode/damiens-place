# Damien's Place

JumboCode 2026-27 project for Damien's Place.

**Project Manager**: Begüm Ugurlu
**Technical Lead**: Natalie Phua
**Designer**: Olivia Sheng

## Getting Started

See the Onboarding Doc in Notion or your first ticket to clone the repo.

Next run `npm i` to install all packages. This sets up the infrastructure and everything you need for the site to work and stores it on a folder called `node_modules`.

You'll also want some packages on VSCode:

- Live Share
- Prisma
- ESLint
- Prettier

Run `npx prisma generate` to generate your Prisma Client. You'll need to run this if the schema gets updated, but Natalie will let you know when that happens.

## Development

To actually run the site, start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Linting

Before pushing, run `npm run lint` to try to build the website locally. It will throw errors if something is wrong and notify you where that error is.

## Learn More

Read the Notion for more info on Code Style Standards, Tech Stack explanations, or general guidelines.
