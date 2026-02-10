import request from 'supertest';
import express, { Application } from 'express';
import donationRoutes from '../../../routes/donation.routes';
import { errorHandler } from '../../../middleware/errorHandler';
import { authenticate } from '../../../middleware/auth';
import { query } from '../../../config/database';

// Mock dependencies
jest.mock('../../../config/database');
jest.mock('../../../middleware/auth');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockAuthenticate = authenticate as jest.MockedFunction<typeof authenticate>;

describe('Donation Routes - Integration Tests with Edge Cases', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock authenticate to pass through with mock user
    mockAuthenticate.mockImplementation((req: any, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    app.use('/api/v1/donations', donationRoutes);
    app.use(errorHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/donations', () => {
    const validDonation = {
      item_name: 'Canned Beans',
      item_quantity: 5,
      dietary_preference: 'vegan',
      expiry_date: '2025-12-31',
    };

    it('should create donation successfully', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/donations')
        .send(validDonation);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 422 for missing item_name', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          item_name: undefined,
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 422 for invalid quantity (0)', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          item_quantity: 0,
        });

      expect(response.status).toBe(422);
    });

    it('should return 422 for quantity exceeding max', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          item_quantity: 10000,
        });

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid dietary preference', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          dietary_preference: 'invalid',
        });

      expect(response.status).toBe(422);
    });

    it('should return 422 for past expiry date', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          expiry_date: '2020-01-01',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('past'),
        })
      );
    });

    it('should return 422 for invalid date format', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          expiry_date: 'invalid-date',
        });

      expect(response.status).toBe(422);
    });

    it('should accept optional image_url', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          image_url: 'https://example.com/image.jpg',
        });

      expect(response.status).toBe(201);
    });

    it('should reject invalid image_url', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          ...validDonation,
          image_url: 'not-a-url',
        });

      expect(response.status).toBe(422);
    });

    it('should handle database errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/v1/donations')
        .send(validDonation);

      expect(response.status).toBeGreaterThanOrEqual(500);
    });
  });

  describe('GET /api/v1/donations', () => {
    it('should get donations with pagination', async () => {
      const mockDonations = [
        { id: 1, item_name: 'Test Item', user_id: 1 },
        { id: 2, item_name: 'Test Item 2', user_id: 1 },
      ];

      mockQuery.mockResolvedValueOnce(mockDonations as any);
      mockQuery.mockResolvedValueOnce([{ total: 25 }] as any);

      const response = await request(app)
        .get('/api/v1/donations?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('should filter by status', async () => {
      mockQuery.mockResolvedValueOnce([] as any);
      mockQuery.mockResolvedValueOnce([{ total: 0 }] as any);

      const response = await request(app)
        .get('/api/v1/donations?status=pending');

      expect(response.status).toBe(200);
    });

    it('should return 422 for invalid status filter', async () => {
      const response = await request(app)
        .get('/api/v1/donations?status=invalid');

      expect(response.status).toBe(422);
    });

    it('should handle invalid page number', async () => {
      const response = await request(app)
        .get('/api/v1/donations?page=0');

      expect(response.status).toBe(422);
    });

    it('should handle invalid limit (too high)', async () => {
      const response = await request(app)
        .get('/api/v1/donations?limit=1000');

      expect(response.status).toBe(422);
    });

    it('should handle non-numeric pagination params', async () => {
      const response = await request(app)
        .get('/api/v1/donations?page=abc&limit=xyz');

      expect(response.status).toBe(422);
    });

    it('should default to page 1 when not provided', async () => {
      mockQuery.mockResolvedValueOnce([] as any);
      mockQuery.mockResolvedValueOnce([{ total: 0 }] as any);

      const response = await request(app)
        .get('/api/v1/donations');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
    });
  });

  describe('PUT /api/v1/donations/:id', () => {
    it('should update donation successfully', async () => {
      const mockDonation = {
        id: 1,
        user_id: 1,
        item_name: 'Old Name',
      };

      mockQuery
        .mockResolvedValueOnce([mockDonation] as any) // Get donation
        .mockResolvedValueOnce(undefined as any) // Update
        .mockResolvedValueOnce([{ ...mockDonation, item_name: 'New Name' }] as any); // Get updated

      const response = await request(app)
        .put('/api/v1/donations/1')
        .send({ item_name: 'New Name' });

      expect(response.status).toBe(200);
    });

    it('should return 422 for invalid ID', async () => {
      const response = await request(app)
        .put('/api/v1/donations/invalid')
        .send({ item_name: 'Test' });

      expect(response.status).toBe(422);
    });

    it('should return 404 for non-existent donation', async () => {
      mockQuery.mockResolvedValueOnce([] as any);

      const response = await request(app)
        .put('/api/v1/donations/999')
        .send({ item_name: 'Test' });

      expect(response.status).toBe(404);
    });

    it('should return 403 for donation owned by another user', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, user_id: 999 }] as any);

      const response = await request(app)
        .put('/api/v1/donations/1')
        .send({ item_name: 'Test' });

      expect(response.status).toBe(403);
    });

    it('should return 422 when no fields to update', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, user_id: 1 }] as any);

      const response = await request(app)
        .put('/api/v1/donations/1')
        .send({});

      expect(response.status).toBe(422);
    });

    it('should handle negative ID', async () => {
      const response = await request(app)
        .put('/api/v1/donations/-1')
        .send({ item_name: 'Test' });

      expect(response.status).toBe(422);
    });
  });

  describe('DELETE /api/v1/donations/:id', () => {
    it('should delete donation successfully', async () => {
      mockQuery
        .mockResolvedValueOnce([{ id: 1, user_id: 1 }] as any)
        .mockResolvedValueOnce(undefined as any);

      const response = await request(app)
        .delete('/api/v1/donations/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent donation', async () => {
      mockQuery.mockResolvedValueOnce([] as any);

      const response = await request(app)
        .delete('/api/v1/donations/999');

      expect(response.status).toBe(404);
    });

    it('should return 403 for deleting others donation', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, user_id: 999 }] as any);

      const response = await request(app)
        .delete('/api/v1/donations/1');

      expect(response.status).toBe(403);
    });

    it('should handle database errors during deletion', async () => {
      mockQuery
        .mockResolvedValueOnce([{ id: 1, user_id: 1 }] as any)
        .mockRejectedValueOnce(new Error('Delete failed'));

      const response = await request(app)
        .delete('/api/v1/donations/1');

      expect(response.status).toBeGreaterThanOrEqual(500);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle SQL injection in ID parameter', async () => {
      const response = await request(app)
        .get("/api/v1/donations/1' OR '1'='1");

      expect(response.status).toBe(422);
    });

    it('should handle extremely large item quantities', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          item_name: 'Test',
          item_quantity: Number.MAX_SAFE_INTEGER,
          dietary_preference: 'vegan',
          expiry_date: '2025-12-31',
        });

      expect(response.status).toBe(422);
    });

    it('should handle negative quantities', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          item_name: 'Test',
          item_quantity: -5,
          dietary_preference: 'vegan',
          expiry_date: '2025-12-31',
        });

      expect(response.status).toBe(422);
    });

    it('should handle XSS in item_name', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          item_name: '<script>alert("xss")</script>',
          item_quantity: 5,
          dietary_preference: 'vegan',
          expiry_date: '2025-12-31',
        });

      // Should accept (sanitization happens in middleware)
      // or reject based on validation rules
      expect([201, 422]).toContain(response.status);
    });

    it('should handle concurrent donation creation', async () => {
      mockQuery.mockResolvedValue({ insertId: 1 } as any);

      const requests = Array(5).fill(null).map(() =>
        request(app)
          .post('/api/v1/donations')
          .send({
            item_name: 'Test Item',
            item_quantity: 1,
            dietary_preference: 'vegan',
            expiry_date: '2025-12-31',
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBeLessThan(500);
      });
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .set('Content-Type', 'application/json')
        .send('{"invalid json}');

      expect(response.status).toBe(400);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({});

      expect(response.status).toBe(422);
    });

    it('should handle null values in request', async () => {
      const response = await request(app)
        .post('/api/v1/donations')
        .send({
          item_name: null,
          item_quantity: null,
          dietary_preference: null,
          expiry_date: null,
        });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/v1/donations/my-donations', () => {
    it('should get user donations successfully', async () => {
      const mockDonations = [
        { id: 1, item_name: 'Test', user_id: 1 },
      ];

      mockQuery
        .mockResolvedValueOnce(mockDonations as any)
        .mockResolvedValueOnce([{ total: 1 }] as any);

      const response = await request(app)
        .get('/api/v1/donations/my-donations');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDonations);
    });

    it('should handle empty donation list', async () => {
      mockQuery
        .mockResolvedValueOnce([] as any)
        .mockResolvedValueOnce([{ total: 0 }] as any);

      const response = await request(app)
        .get('/api/v1/donations/my-donations');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should paginate user donations correctly', async () => {
      mockQuery
        .mockResolvedValueOnce([] as any)
        .mockResolvedValueOnce([{ total: 50 }] as any);

      const response = await request(app)
        .get('/api/v1/donations/my-donations?page=2&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 50,
        totalPages: 5,
      });
    });
  });
});
