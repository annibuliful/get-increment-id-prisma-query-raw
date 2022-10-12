import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

// prisma.$on('query', (e: Prisma.QueryEvent) => {
//   console.log('\n');
//   console.log(`Target: ${e.target}`);
//   console.log(`Query: ${e.query}`);
//   console.log(`Param: ${e.params}`);
//   console.log(`Duration: ${e.duration} ms`);
//   console.log('\n');
// });

const main = async () => {
  const list = (await prisma.$queryRawUnsafe(
    `SELECT LAST_INSERT_ID() FROM tbl_zone`
  )) as Array<unknown>;

  const newId = list.length + 1;

  const insertNew = await prisma.$queryRaw(
    Prisma.sql`INSERT INTO tbl_zone(id,longitude,latitude,updatedAt) VALUES (${newId},${Math.random()},${Math.random()},${new Date()})`
  );

  console.log('newId', newId);
  const result = await prisma.$queryRawUnsafe(
    `SELECT * FROM tbl_zone WHERE id = ${newId}`
  );

  console.log('insert-result', insertNew, result);
};

main();
