import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Task Manager System (E2E Integration Testing)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdTaskId: number;

  const seedUser = {
    name: 'E2E Tester',
    email: 'e2e_test_runner@example.com',
    password: 'superSecretPassword123',
  };

  const dummyTask = {
    title: 'Complete NestJS Integration Tests',
    description: 'Write comprehensive supertest scenarios for all CRUD endpoints',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Crucial: Mirror your main.ts setup so that DTO class-validator decorators work in tests
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // =========================================================================
  // 1. USERS & AUTHENTICATION MODULE
  // =========================================================================

  describe('Users & Auth (/users)', () => {
    it('POST /users/create -> Should register a new user or accept existing user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/create')
        .send(seedUser);

      if (res.status === HttpStatus.CREATED) {
        expect(res.body).toBeDefined();
      } else {
        expect([HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT]).toContain(res.status);
      }
    });

    it('POST /users/authenticate -> Should log in and extract the JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/authenticate')
        .send({
          email: seedUser.email,
          password: seedUser.password,
        })
        .expect(HttpStatus.CREATED);

      // Adjust the key below if your service returns it differently (e.g., res.body.token)
      expect(res.body.access_token).toBeDefined();
      authToken = res.body.access_token;
    });

    it('PATCH /users/profile -> Should safely modify profile attributes when authenticated', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'E2E Tester Updated' })
        .expect(HttpStatus.OK);
    });
  });

  // =========================================================================
  // 2. TASKS MODULE (AUTHENTICATED CRUD LIFECYCLE)
  // =========================================================================

  describe('Tasks Management (/tasks)', () => {
    
    // Guard Enforcement Check
    it('GET /tasks -> Should reject unauthenticated resource access with 401', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    // Create Task (POST)
    it('POST /tasks -> Should create a new task entry for the logged-in user', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dummyTask)
        .expect(HttpStatus.CREATED);

      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe(dummyTask.title);
      expect(res.body.completed).toBe(false);
      
      createdTaskId = res.body.id; // Preserve ID for downstream mutations
    });

    // Read All Tasks (GET)
    it('GET /tasks -> Should retrieve an array of tasks belonging to the user', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    // Read Specific Task (GET :id)
    it('GET /tasks/:id -> Should fetch a singular task profile by identity primary key', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
        });
    });

    // Update Task Details (PATCH :id)
    it('PATCH /tasks/:id -> Should selectively modify task details based on UpdateTaskDto context', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Mastered NestJS Integration Testing' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.title).toBe('Mastered NestJS Integration Testing');
        });
    });

    // Toggle Done State (PATCH :id/toggle-done)
    it('PATCH /tasks/:id/toggle-done -> Should toggle completed state matrix', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/toggle-done`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
        });
    });

    // Filtering Check: Completed Tasks
    it('GET /tasks/all-done -> Should bundle finished operations together', () => {
      return request(app.getHttpServer())
        .get('/tasks/all-done')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Error Handling Validation (404 Fallback)
    it('GET /tasks/999999 -> Should fallback gracefully into an explicit 404 missing status exception', () => {
      return request(app.getHttpServer())
        .get('/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    // Delete Task Execution (DELETE :id)
    it('DELETE /tasks/:id -> Should purge task records safely', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);
    });
  });

  // =========================================================================
  // 3. CLEANUP & TEARDOWN
  // =========================================================================

  describe('Account Teardown (/users)', () => {
    it('DELETE /users/profile -> Should delete the test user profile and maintain test database hygiene', () => {
      return request(app.getHttpServer())
        .delete('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);
    });
  });
});