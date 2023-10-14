import * as dotenv from 'dotenv';
import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateSlug } from '../src/utils/generate-slug';

dotenv.config();
const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];
  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName).toLowerCase(),
        description: faker.lorem.paragraph(),
        price: +faker.commerce.price(10, 999, 0),
        images: Array.from({ length: faker.datatype.number({ min: 2, max: 6 }) }).map(() => faker.image.url({ width: 500, height: 500})),
        category: {
          create: {
            name: categoryName,
            slug: generateSlug(categoryName).toLowerCase(),
          }
        },
        reviews: {
          create: [
            {
              rating: faker.datatype.number({ min: 1, max: 5}),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 3,
                }
              },
            },
            {
              rating: faker.datatype.number({ min: 1, max: 5}),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 3,
                }
              },
            }
          ],
        }
      }
    });

    products.push(product);
  }

  console.log(`Created ${products.length} products`);
};

async function main() {
  console.log('Start seeding...');
  await createProducts(10);
  console.log('Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });