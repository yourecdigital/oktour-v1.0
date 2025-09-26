import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { prisma } from '../index';

const router = Router();

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of media files
 */
router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const media = await prisma.media.findMany({
      where: { isActive: true },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ media });
  } catch (error) {
    next(error);
  }
});

export default router;