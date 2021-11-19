import type { AWS } from '@serverless/typescript';

// All required methods
import { 
  save_student, add_enrollement, add_course,                            // Methods for saving item
  get_one_std, get_one_course, get_one_enrollement,                     // Methods for getting one item
  dlt_one_course, dlt_one_enrollement, dlt_one_student,                 // Methods for deleting item
  update_one_course, update_one_enrollement, update_one_student,        // Methods for updating item
  get_list_of_courses, get_list_of_enrollements, get_list_of_students   // Methods for getting list of items
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'test-serverless',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    save_student, add_enrollement, add_course, 
    get_one_std, get_one_course, get_one_enrollement,
    dlt_one_student, dlt_one_enrollement, dlt_one_course,
    update_one_student, update_one_enrollement, update_one_course,
    get_list_of_students, get_list_of_enrollements, get_list_of_courses
  },

  package: { individually: true },
  custom: {
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        migrate: true,
        seed: true
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      SEMS: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "SEMS",
          AttributeDefinitions: [
            {AttributeName: "id", AttributeType: "S"}
          ],
          KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}
          ],
          BillingMode: "PAY_PER_REQUEST"
        }
      }
    }
  },
};

module.exports = serverlessConfiguration;
