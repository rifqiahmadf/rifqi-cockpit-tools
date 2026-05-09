/**
 * OpenAPI Documentation Module
 *
 * This module exports all schemas, examples, and OpenAPI configuration
 * for the Cockpit Tools API documentation.
 */

// OpenAPI specification configuration
export { openapiOptions, createOpenApiSpec } from './openapi.js';

// Core entity schemas
export {
  PlatformSchema,
  QuotaSchema,
  AccountSchema,
  InstanceSchema,
  InstanceStatusSchema,
  GroupSchema,
  FingerprintSchema,
  ConfigSchema,
  ErrorSchema,
  SuccessResponseSchema,
  InvokeResponseSchema,
  ErrorResponseSchema,
} from './schemas.js';

// Command schemas
export { CommandSchemas, type CommandSchema } from './commands.js';

// Example data
export {
  ExampleAccounts,
  ExampleInstances,
  ExampleGroups,
  ExampleFingerprints,
  ExampleQuotas,
  ExampleCommandRequests,
  ExampleCommandResponses,
} from './examples.js';
