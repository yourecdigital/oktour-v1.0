import { Router } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth';
import { prisma } from '../index';

const router = Router();

/**
 * @swagger
 * /api/hero:
 *   get:
 *     summary: Get hero backgrounds
 *     tags: [Hero]
 *     responses:
 *       200:
 *         description: List of hero backgrounds
 */
router.get('/', async (req, res, next) => {
  try {
    const backgrounds = await prisma.heroBackground.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    res.json({ backgrounds });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/hero:
 *   post:
 *     summary: Create hero background
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Hero background created
 */
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { page, type, url, thumbnailUrl, fallbackUrl } = req.body;

    const background = await prisma.heroBackground.create({
      data: {
        page,
        type,
        url,
        thumbnailUrl,
        fallbackUrl,
      },
    });

    res.status(201).json(background);
  } catch (error) {
    next(error);
  }
});

export default router;
