import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { notifications, insertNotificationSchema } from '../../shared/schema';
import { eq, desc, and, or } from 'drizzle-orm';

const router = Router();

// Get notifications for user (or global notifications)
router.get('/api/notifications', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
    const limit = parseInt(req.query.limit as string) || 10;
    const unreadOnly = req.query.unreadOnly === 'true';

    let whereCondition;
    if (userId) {
      // Get user-specific and global notifications
      whereCondition = or(
        eq(notifications.userId, userId),
        eq(notifications.isGlobal, true)
      );
    } else {
      // Get only global notifications
      whereCondition = eq(notifications.isGlobal, true);
    }

    // Add unread filter if requested
    if (unreadOnly) {
      whereCondition = and(whereCondition, eq(notifications.isRead, false));
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(whereCondition)
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread notification count
router.get('/api/notifications/count', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;

    let whereCondition;
    if (userId) {
      whereCondition = and(
        or(
          eq(notifications.userId, userId),
          eq(notifications.isGlobal, true)
        ),
        eq(notifications.isRead, false)
      );
    } else {
      whereCondition = and(
        eq(notifications.isGlobal, true),
        eq(notifications.isRead, false)
      );
    }

    const count = await db
      .select()
      .from(notifications)
      .where(whereCondition);

    res.json({ count: count.length });
  } catch (error) {
    console.error('Error counting notifications:', error);
    res.status(500).json({ error: 'Failed to count notifications' });
  }
});

// Mark notification as read
router.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    await db
      .update(notifications)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(eq(notifications.id, notificationId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read for user
router.patch('/api/notifications/read-all', async (req, res) => {
  try {
    const userId = req.body.userId ? parseInt(req.body.userId) : null;

    let whereCondition;
    if (userId) {
      whereCondition = or(
        eq(notifications.userId, userId),
        eq(notifications.isGlobal, true)
      );
    } else {
      whereCondition = eq(notifications.isGlobal, true);
    }

    await db
      .update(notifications)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(and(whereCondition, eq(notifications.isRead, false)));

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Create new notification (admin/system use)
router.post('/api/notifications', async (req, res) => {
  try {
    const validatedData = insertNotificationSchema.parse(req.body);
    
    const [newNotification] = await db
      .insert(notifications)
      .values(validatedData)
      .returning();

    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Delete notification
router.delete('/api/notifications/:id', async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    await db
      .delete(notifications)
      .where(eq(notifications.id, notificationId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;