import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create the genres first (books need a genre to belong to)
  const fiction = await prisma.genre.upsert({
    where: { slug: 'fiction' },
    update: {},
    create: { name: 'Fiction', slug: 'fiction' },
  });
  const science = await prisma.genre.upsert({
    where: { slug: 'science' },
    update: {},
    create: { name: 'Science', slug: 'science' },
  });
  const history = await prisma.genre.upsert({
    where: { slug: 'history' },
    update: {},
    create: { name: 'History', slug: 'history' },
  });
  const technology = await prisma.genre.upsert({
    where: { slug: 'technology' },
    update: {},
    create: { name: 'Technology', slug: 'technology' },
  });

  // 2. Create the books, each one points to a genre with genreId
  await prisma.book.createMany({
    skipDuplicates: true, // so running the seed twice doesn't crash
    data: [
      // Fiction
      { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0-00-000001-1', totalCopies: 3, availableCopies: 3, genreId: fiction.id },
      { title: 'Weep Not, Child', author: 'Ngugi wa Thiong\'o', isbn: '978-0-00-000002-2', totalCopies: 2, availableCopies: 2, genreId: fiction.id },
      { title: 'The River Between', author: 'Ngugi wa Thiong\'o', isbn: '978-0-00-000003-3', totalCopies: 2, availableCopies: 2, genreId: fiction.id },
      { title: 'Petals of Blood', author: 'Ngugi wa Thiong\'o', isbn: '978-0-00-000004-4', totalCopies: 1, availableCopies: 1, genreId: fiction.id },

      // Science
      { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0-00-000005-5', totalCopies: 2, availableCopies: 2, genreId: science.id },
      { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0-00-000006-6', totalCopies: 2, availableCopies: 2, genreId: science.id },
      { title: 'Cosmos', author: 'Carl Sagan', isbn: '978-0-00-000007-7', totalCopies: 3, availableCopies: 3, genreId: science.id },
      { title: 'The Origin of Species', author: 'Charles Darwin', isbn: '978-0-00-000008-8', totalCopies: 1, availableCopies: 1, genreId: science.id },

      // History
      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0-00-000009-9', totalCopies: 3, availableCopies: 3, genreId: history.id },
      { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '978-0-00-000010-0', totalCopies: 2, availableCopies: 2, genreId: history.id },
      { title: 'The Wretched of the Earth', author: 'Frantz Fanon', isbn: '978-0-00-000011-1', totalCopies: 1, availableCopies: 1, genreId: history.id },
      { title: 'Africa: A Biography of the Continent', author: 'John Reader', isbn: '978-0-00-000012-2', totalCopies: 1, availableCopies: 1, genreId: history.id },

      // Technology
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-00-000013-3', totalCopies: 2, availableCopies: 2, genreId: technology.id },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0-00-000014-4', totalCopies: 2, availableCopies: 2, genreId: technology.id },
      { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '978-0-00-000015-5', totalCopies: 3, availableCopies: 3, genreId: technology.id },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-0-00-000016-6', totalCopies: 1, availableCopies: 1, genreId: technology.id },
    ],
  });

  console.log('Seeding done: 4 genres and 16 books added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // always close the database connection at the end
    await prisma.$disconnect();
  });