import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Domestic Tours' },
      update: {},
      create: {
        name: 'Domestic Tours',
        description: 'Local tours within the country',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { name: 'International Tours' },
      update: {},
      create: {
        name: 'International Tours',
        description: 'Tours to foreign countries',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Cruises' },
      update: {},
      create: {
        name: 'Cruises',
        description: 'Sea and river cruises',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Hotels' },
      update: {},
      create: {
        name: 'Hotels',
        description: 'Hotel accommodations',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tour.com' },
    update: {},
    create: {
      email: 'admin@tour.com',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created');

  // Create sample tours
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Sochi City Tour',
        description: 'Explore the beautiful city of Sochi with our guided tour',
        price: 1500.00,
        duration: '4 hours',
        location: 'Sochi, Russia',
        categoryId: categories[0].id,
        isActive: true,
      },
    }),
    prisma.tour.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Paris Adventure',
        description: 'Discover the romantic city of Paris',
        price: 25000.00,
        duration: '7 days',
        location: 'Paris, France',
        categoryId: categories[1].id,
        isActive: true,
      },
    }),
    prisma.tour.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Mediterranean Cruise',
        description: 'Luxury cruise through the Mediterranean Sea',
        price: 50000.00,
        duration: '10 days',
        location: 'Mediterranean Sea',
        categoryId: categories[2].id,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Sample tours created');

  // Create hero backgrounds
  const heroBackgrounds = await Promise.all([
    prisma.heroBackground.upsert({
      where: { id: 1 },
      update: {},
      create: {
        page: 'home',
        type: 'VIDEO',
        url: '/uploads/hero-background.mp4',
        thumbnailUrl: '/uploads/hero-background-thumb.jpg',
        fallbackUrl: '/uploads/hero-background-fallback.jpg',
        isActive: true,
        order: 1,
      },
    }),
    prisma.heroBackground.upsert({
      where: { id: 2 },
      update: {},
      create: {
        page: 'tours',
        type: 'IMAGE',
        url: '/uploads/tours-hero.jpg',
        isActive: true,
        order: 1,
      },
    }),
  ]);

  console.log('✅ Hero backgrounds created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
