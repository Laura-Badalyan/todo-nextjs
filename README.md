# schema, migrate
npm i prisma --same-dev

# methd schema 
npm i @prisma/client

# .env, prisma/prisma
npx prisma init

# prisma/prisma/migrations sql
npx prisma migrate dev --name init

# run prisma
npx prisma studio

# run code
npm run dev