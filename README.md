# library-management-system

## Schema Decisions

**Why Book points to Genre instead of holding it inside**

Each Book has a `genreId` that points to a row in the Genre table. I didn't put the whole genre inside the book. If I did, "Fiction" would be copied into every fiction book, and fixing a typo or renaming a genre would mean editing every one of those books. With a reference, the genre lives in one place and books just point to it.

It also keeps the data consistent. The foreign key means a book can't point to a genre that doesn't exist, and I can easily ask things like "show all books in Science" or "how many books per genre".

**Other choices**

- `isbn` is unique, so the same book can't be added twice.
- `totalCopies` and `availableCopies` are separate so we can track how many are on the shelf versus how many the library owns.
- `Role` is an enum (PATRON, LIBRARIAN) so a user can only ever have one of those two values.

## Where things are

- Schema: [api/prisma/schema.prisma](api/prisma/schema.prisma) - Role enum, User, Genre, Book
- Seed script: [api/prisma/seed.ts](api/prisma/seed.ts) - 4 genres, 16 books
- Prisma service: [api/src/prisma/prisma.service.ts](api/src/prisma/prisma.service.ts)
- Env placeholder: [api/.env.example](api/.env.example)
- Migrations: [api/prisma/migrations](api/prisma/migrations)

To run the seed: cd api, copy .env.example to .env, fill in your database URL, then run npm run seed.
