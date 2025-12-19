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
    '/api/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get patient profile by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Patient ID',
          },
        ],
        responses: {
          200: {
            description: 'Patient profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
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
            },
          },
          401: { description: 'Unauthorized' },
          404: { description: 'Patient not found' },
        },
      },
    },
    '/api/doctors': {
      post: {
        tags: ['Doctors'],
        summary: 'Create doctor profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'specialization', 'phone', 'licenseNumber'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  specialization: { type: 'string' },
                  phone: { type: 'string' },
                  licenseNumber: { type: 'string' },
                  qualifications: { type: 'array', items: { type: 'string' } },
                  yearsOfExperience: { type: 'integer' },
                  consultationFee: { type: 'number' },
                  clinicAddress: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Doctor created successfully' },
          401: { description: 'Unauthorized' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get doctor profile by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Doctor ID',
          },
        ],
        responses: {
          200: {
            description: 'Doctor profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        specialization: { type: 'string' },
                        phone: { type: 'string' },
                        licenseNumber: { type: 'string' },
                        qualifications: { type: 'array', items: { type: 'string' } },
                        yearsOfExperience: { type: 'integer' },
                        consultationFee: { type: 'number' },
                        clinicAddress: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          404: { description: 'Doctor not found' },
        },
      },
      put: {
        tags: ['Doctors'],
        summary: 'Update doctor profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Doctor ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  specialization: { type: 'string' },
                  phone: { type: 'string' },
                  qualifications: { type: 'array', items: { type: 'string' } },
                  yearsOfExperience: { type: 'integer' },
                  consultationFee: { type: 'number' },
                  clinicAddress: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Doctor updated successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Doctor not found' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/doctors/specialization/{spec}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get doctors by specialization',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'spec',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Specialization',
          },
        ],
        responses: {
          200: {
            description: 'Doctors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          firstName: { type: 'string' },
                          lastName: { type: 'string' },
                          specialization: { type: 'string' },
                          consultationFee: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Create a new appointment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientId', 'doctorId', 'appointmentDate', 'appointmentTime', 'reason'],
                properties: {
                  patientId: { type: 'string', format: 'uuid' },
                  doctorId: { type: 'string', format: 'uuid' },
                  appointmentDate: { type: 'string', format: 'date' },
                  appointmentTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Appointment created successfully' },
          401: { description: 'Unauthorized' },
          400: { description: 'Validation error' },
          409: { description: 'Time slot not available' },
        },
      },
    },
    '/api/appointments/{id}': {
      get: {
        tags: ['Appointments'],
        summary: 'Get appointment by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Appointment ID',
          },
        ],
        responses: {
          200: {
            description: 'Appointment retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        patientId: { type: 'string', format: 'uuid' },
                        doctorId: { type: 'string', format: 'uuid' },
                        appointmentDate: { type: 'string', format: 'date' },
                        appointmentTime: { type: 'string' },
                        reason: { type: 'string' },
                        status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'] },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          404: { description: 'Appointment not found' },
        },
      },
    },
    '/api/appointments/{id}/status': {
      patch: {
        tags: ['Appointments'],
        summary: 'Update appointment status',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Appointment ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Appointment status updated successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Appointment not found' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/appointments/patient/{patientId}/upcoming': {
      get: {
        tags: ['Appointments'],
        summary: 'Get upcoming appointments for a patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Patient ID',
          },
        ],
        responses: {
          200: {
            description: 'Upcoming appointments retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          doctorId: { type: 'string', format: 'uuid' },
                          appointmentDate: { type: 'string', format: 'date' },
                          appointmentTime: { type: 'string' },
                          reason: { type: 'string' },
                          status: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/notes': {
      post: {
        tags: ['Notes'],
        summary: 'Create a clinical note',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId', 'content'],
                properties: {
                  appointmentId: { type: 'string', format: 'uuid' },
                  content: { type: 'string' },
                  diagnosis: { type: 'string' },
                  treatment: { type: 'string' },
                  prescription: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Clinical note created successfully' },
          401: { description: 'Unauthorized' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/notes/{id}': {
      get: {
        tags: ['Notes'],
        summary: 'Get clinical note by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Note ID',
          },
        ],
        responses: {
          200: {
            description: 'Clinical note retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        appointmentId: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                        diagnosis: { type: 'string' },
                        treatment: { type: 'string' },
                        prescription: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          404: { description: 'Note not found' },
        },
      },
      put: {
        tags: ['Notes'],
        summary: 'Update clinical note',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Note ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string' },
                  diagnosis: { type: 'string' },
                  treatment: { type: 'string' },
                  prescription: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Clinical note updated successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Note not found' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/notes/appointment/{appointmentId}': {
      get: {
        tags: ['Notes'],
        summary: 'Get clinical notes by appointment ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Appointment ID',
          },
        ],
        responses: {
          200: {
            description: 'Clinical notes retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          content: { type: 'string' },
                          diagnosis: { type: 'string' },
                          treatment: { type: 'string' },
                          prescription: { type: 'string' },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
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
