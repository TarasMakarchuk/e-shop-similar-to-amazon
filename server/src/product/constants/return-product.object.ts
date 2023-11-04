import { Prisma } from '@prisma/client';

import { returnReviewObject } from 'src/review/constants/return-review.object';
import { returnCategoryObject } from 'src/category/constants/return-category.object';

export const returnProductObject: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  slug: true,
  createdAt: true,
};

export const returnProductObjectFullest: Prisma.ProductSelect = {
  ...returnProductObject,
  reviews: {
    select: returnReviewObject,
  },
  category: {
    select: returnCategoryObject,
  }
};
