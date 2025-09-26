import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();

// Validation schemas
const createTourSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  duration: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().positive(),
});

const updateTourSchema = createTourSchema.partial();

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tours
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = { name: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: {
          category: true,
          media: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tour.count({ where }),
    ]);

    // Calculate average rating for each tour
    const toursWithRating = tours.map(tour => ({
      ...tour,
      averageRating: tour.reviews.length > 0
        ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length
        : null,
      reviewCount: tour.reviews.length,
    }));

    res.json({
      tours: toursWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour details
 *       404:
 *         description: Tour not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        category: true,
        media: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const averageRating = tour.reviews.length > 0
      ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length
      : null;

    res.json({
      ...tour,
      averageRating,
      reviewCount: tour.reviews.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create new tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               location:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tour created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = createTourSchema.parse(req.body);

    const tour = await prisma.tour.create({
      data,
      include: {
        category: true,
        media: true,
      },
    });

    res.status(201).json(tour);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               location:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tour updated
 *       404:
 *         description: Tour not found
 */
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = updateTourSchema.parse(req.body);

    const tour = await prisma.tour.update({
      where: { id },
      data,
      include: {
        category: true,
        media: true,
      },
    });

    res.json(tour);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour deleted
 *       404:
 *         description: Tour not found
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.tour.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
