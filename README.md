# Storj Box Lite

## Setup

Install the dependencies:

```
yarn install
```

## Create Environment Variable File

`.env.local`

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIRESTORE_COLLECTION=
VITE_STORJ_ENDPOINT=
VITE_STORJ_REGION=
```

### Development

Just run `yarn dev`.

### Production

Run `yarn build`. The generated files will be in the `dist` folder.

### Testing

Run `yarn test`. Tests are performed on production build, so be sure to build your app first.
