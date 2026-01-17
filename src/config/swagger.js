const swaggerJsDoc = require('swagger-jsdoc');

const apiDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API for E-commerce project'
  },
  servers: [
    { url: 'http://localhost:3000/api/v1', description: 'Local Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication management' },
    { name: 'Products', description: 'Product management' },
    { name: 'Orders', description: 'Order management' }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Bad Request' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login to get a JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful (Returns Token)' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/products': {
      get: {
        summary: 'Get all products',
        tags: ['Products'],
        responses: {
          200: { description: 'List of products' }
        }
      },
      post: {
        summary: 'Create a new product (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  description: { type: 'string' },
                  stock: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Product created' }
        }
      }
    },
    '/products/{id}': {
      delete: {
        summary: 'Delete a product (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Product deleted' }
        }
      }
    },
    '/orders': {
      post: {
        summary: 'Create a new order',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'header',
            name: 'idempotency-key',
            schema: { type: 'string' },
            description: 'Unique key to prevent duplicate orders'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  totalAmount: { type: 'number' },
                  products: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created' }
        }
      }
    }
  }
};

const options = {
  definition: apiDefinition,
  apis: []
};

module.exports = swaggerJsDoc(options);