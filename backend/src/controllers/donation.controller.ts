import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest, Donation, DonationCreateData } from '../types';
import { NotFoundError, UnauthorizedError, ForbiddenError } from '../middleware/errorHandler';
import { logInfo } from '../utils/logger';

/**
 * Create a new donation
 */
export const createDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { item_name, item_quantity, dietary_preference, expiry_date, image_url }: DonationCreateData = req.body;

  const result: any = await query(
    `INSERT INTO donations (user_id, item_name, item_quantity, dietary_preference, expiry_date, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [userId, item_name, item_quantity, dietary_preference, expiry_date, image_url || null]
  );

  logInfo('Donation created', { donationId: result.insertId, userId });

  res.status(201).json({
    success: true,
    message: 'Donation created successfully',
    data: {
      id: result.insertId,
      user_id: userId,
      item_name,
      item_quantity,
      dietary_preference,
      expiry_date,
      image_url,
      status: 'pending',
    },
  });
};

/**
 * Get all donations
 */
export const getAllDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status as string;

  let sql = `
    SELECT d.*, u.username, u.email 
    FROM donations d
    JOIN donator u ON d.user_id = u.id
  `;
  const params: any[] = [];

  if (status) {
    sql += ' WHERE d.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const donations = await query<Donation[]>(sql, params);

  // Get total count
  let countSql = 'SELECT COUNT(*) as total FROM donations';
  const countParams: any[] = [];

  if (status) {
    countSql += ' WHERE status = ?';
    countParams.push(status);
  }

  const totalResult = await query<any[]>(countSql, countParams);
  const total = totalResult[0].total;

  res.status(200).json({
    success: true,
    message: 'Donations retrieved successfully',
    data: donations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

/**
 * Get donation by ID
 */
export const getDonationById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const donations = await query<Donation[]>(
    `SELECT d.*, u.username, u.email 
     FROM donations d
     JOIN donator u ON d.user_id = u.id
     WHERE d.id = ?`,
    [id]
  );

  if (donations.length === 0) {
    throw new NotFoundError('Donation not found');
  }

  res.status(200).json({
    success: true,
    message: 'Donation retrieved successfully',
    data: donations[0],
  });
};

/**
 * Get donations by user
 */
export const getUserDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const donations = await query<Donation[]>(
    `SELECT * FROM donations 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const totalResult = await query<any[]>(
    'SELECT COUNT(*) as total FROM donations WHERE user_id = ?',
    [userId]
  );
  const total = totalResult[0].total;

  res.status(200).json({
    success: true,
    message: 'User donations retrieved successfully',
    data: donations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

/**
 * Update donation
 */
export const updateDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Check if donation exists and belongs to user
  const donations = await query<Donation[]>(
    'SELECT * FROM donations WHERE id = ?',
    [id]
  );

  if (donations.length === 0) {
    throw new NotFoundError('Donation not found');
  }

  if (donations[0].user_id !== userId) {
    throw new ForbiddenError('You do not have permission to update this donation');
  }

  const { item_name, item_quantity, dietary_preference, expiry_date, image_url, status } = req.body;

  // Build update query
  const updates: string[] = [];
  const values: any[] = [];

  if (item_name) {
    updates.push('item_name = ?');
    values.push(item_name);
  }
  if (item_quantity) {
    updates.push('item_quantity = ?');
    values.push(item_quantity);
  }
  if (dietary_preference) {
    updates.push('dietary_preference = ?');
    values.push(dietary_preference);
  }
  if (expiry_date) {
    updates.push('expiry_date = ?');
    values.push(expiry_date);
  }
  if (image_url !== undefined) {
    updates.push('image_url = ?');
    values.push(image_url);
  }
  if (status) {
    updates.push('status = ?');
    values.push(status);
  }

  if (updates.length === 0) {
    throw new NotFoundError('No fields to update');
  }

  values.push(id);

  await query(
    `UPDATE donations SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );

  // Get updated donation
  const updatedDonations = await query<Donation[]>(
    'SELECT * FROM donations WHERE id = ?',
    [id]
  );

  logInfo('Donation updated', { donationId: id, userId });

  res.status(200).json({
    success: true,
    message: 'Donation updated successfully',
    data: updatedDonations[0],
  });
};

/**
 * Delete donation
 */
export const deleteDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Check if donation exists and belongs to user
  const donations = await query<Donation[]>(
    'SELECT * FROM donations WHERE id = ?',
    [id]
  );

  if (donations.length === 0) {
    throw new NotFoundError('Donation not found');
  }

  if (donations[0].user_id !== userId) {
    throw new ForbiddenError('You do not have permission to delete this donation');
  }

  await query('DELETE FROM donations WHERE id = ?', [id]);

  logInfo('Donation deleted', { donationId: id, userId });

  res.status(200).json({
    success: true,
    message: 'Donation deleted successfully',
  });
};

export default {
  createDonation,
  getAllDonations,
  getDonationById,
  getUserDonations,
  updateDonation,
  deleteDonation,
};
