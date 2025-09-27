import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../test/setup';

describe('Tours Service', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.tour.deleteMany();
  });

  it('should create a tour', async () => {
    const tourData = {
      title: 'Test Tour',
      description: 'A test tour description',
      price: 100,
      category: 'adventure',
      media: ['/test-image.jpg'],
    };

    const tour = await prisma.tour.create({
      data: tourData,
    });

    expect(tour).toMatchObject({
      title: 'Test Tour',
      description: 'A test tour description',
      price: 100,
      category: 'adventure',
      media: ['/test-image.jpg'],
    });
    expect(tour.id).toBeDefined();
    expect(tour.createdAt).toBeDefined();
    expect(tour.updatedAt).toBeDefined();
  });

  it('should find all tours', async () => {
    // Create test tours
    await prisma.tour.createMany({
      data: [
        {
          title: 'Tour 1',
          description: 'Description 1',
          price: 100,
          category: 'adventure',
          media: ['/image1.jpg'],
        },
        {
          title: 'Tour 2',
          description: 'Description 2',
          price: 200,
          category: 'cultural',
          media: ['/image2.jpg'],
        },
      ],
    });

    const tours = await prisma.tour.findMany();

    expect(tours).toHaveLength(2);
    expect(tours[0].title).toBe('Tour 1');
    expect(tours[1].title).toBe('Tour 2');
  });

  it('should find tour by id', async () => {
    const tour = await prisma.tour.create({
      data: {
        title: 'Test Tour',
        description: 'A test tour description',
        price: 100,
        category: 'adventure',
        media: ['/test-image.jpg'],
      },
    });

    const foundTour = await prisma.tour.findUnique({
      where: { id: tour.id },
    });

    expect(foundTour).toMatchObject({
      id: tour.id,
      title: 'Test Tour',
      description: 'A test tour description',
      price: 100,
      category: 'adventure',
      media: ['/test-image.jpg'],
    });
  });

  it('should update a tour', async () => {
    const tour = await prisma.tour.create({
      data: {
        title: 'Test Tour',
        description: 'A test tour description',
        price: 100,
        category: 'adventure',
        media: ['/test-image.jpg'],
      },
    });

    const updatedTour = await prisma.tour.update({
      where: { id: tour.id },
      data: {
        title: 'Updated Tour',
        price: 150,
      },
    });

    expect(updatedTour.title).toBe('Updated Tour');
    expect(updatedTour.price).toBe(150);
    expect(updatedTour.description).toBe('A test tour description');
  });

  it('should delete a tour', async () => {
    const tour = await prisma.tour.create({
      data: {
        title: 'Test Tour',
        description: 'A test tour description',
        price: 100,
        category: 'adventure',
        media: ['/test-image.jpg'],
      },
    });

    await prisma.tour.delete({
      where: { id: tour.id },
    });

    const deletedTour = await prisma.tour.findUnique({
      where: { id: tour.id },
    });

    expect(deletedTour).toBeNull();
  });
});
