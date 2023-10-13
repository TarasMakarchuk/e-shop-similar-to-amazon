

## Before each, install npm modules on client and server side
```
npm install / yarn install
```

## Server

### Rename file .env.dist to .env and write the required variable values 

### Generate the Prisma Client
```
npx prisma generate
```
### Create/update tables in database
```
npx prisma db push
```

### Create db migrations
```
npx prisma migrate dev
```

## Client
