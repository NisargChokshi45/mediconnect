export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Mediconnect API',
    version: '1.0.0',
    description: 'Healthcare appointment and clinical notes management platform',
    contact: {
      name: 'API Support',
      email: 'support@mediconnect.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication and authorization' },
    { name: 'Patients', description: 'Patient management' },
    { name: 'Doctors', description: 'Doctor management' },
    { name: 'Appointments', description: 'Appointment scheduling and management' },
    { name: 'Notes', description: 'Clinical notes' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['PATIENT', 'DOCTOR'] },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        expiresIn: { type: 'string' },
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            email: { type: 'string' },
                            role: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          409: { description: 'User already exists' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['PATIENT', 'DOCTOR'] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        expiresIn: { type: 'string' },
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            email: { type: 'string' },
                            role: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid credentials' },
          403: { description: 'Account inactive' },
        },
      },
    },
    '/api/patients': {
      post: {
        tags: ['Patients'],
        summary: 'Create patient profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'dateOfBirth', 'phone'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  dateOfBirth: { type: 'string', format: 'date' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                  insuranceProvider: { type: 'string' },
                  insurancePolicyNumber: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Patient created successfully' },
          401: { description: 'Unauthorized' },
          400: { description: 'Validation error' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
