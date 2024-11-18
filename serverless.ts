/* eslint-disable no-template-curly-in-string */
import functions from '@functions/index';
import { AWS } from '@serverless/typescript';
import { serverlessDocumentation } from 'serverless.docs';

const serverlessConfiguration: AWS = {
  service: 'email-voucher-cms',
  frameworkVersion: '3',
  plugins: [
    'serverless-offline-ssm',
    'serverless-offline',
    'serverless-esbuild',
    'serverless-openapi-documenter',
  ],
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    cfnRole: '${env:CFN_ROLE_ARN}',
    runtime: 'nodejs18.x',
    timeout: 20,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    vpc: {
      subnetIds: ['${env:VPC_SUBNET_A}', '${env:VPC_SUBNET_B}'],
      securityGroupIds: ['${env:VPC_SECURITY_GROUP}'],
    },
    region: 'ap-northeast-2',
    httpApi: {
      cors: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['ssm:GetParameter', 'ssm:GetParameters'],
        Resource:
          'arn:aws:ssm:${self:provider.region}:*:parameter/aws/reference/secretsmanager/evcms/*',
      },
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource:
          'arn:aws:secretsmanager:${self:provider.region}:*:secret:evcms/*',
      },
      {
        Effect: 'Allow',
        Action: ['kms:Decrypt'],
        Resource: 'arn:aws:kms:${self:provider.region}:*:key/*',
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      GMAIL_CLIENT_ID: '${env:GMAIL_CLIENT_ID}',
      GMAIL_CLIENT_SECRET: '${env:GMAIL_CLIENT_SECRET}',
      GMAIL_REFRESH_TOKEN: '${env:GMAIL_REFRESH_TOKEN}',
      MONGODB_CONNECTION_STRING: '${env:MONGODB_CONNECTION_STRING}',
      GCP_PUBSUB_TOPIC: '${env:GCP_PUBSUB_TOPIC}',
      SLACK_ERROR_WEBHOOK: '${env:SLACK_ERROR_WEBHOOK}',
      GDS_API_URL: '${env:GDS_API_URL}',
    },
  },
  useDotenv: true,
  // import the function via paths
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline-ssm': {
      stages: ['offline'],
    },
    documentation: serverlessDocumentation,
  },
};

module.exports = serverlessConfiguration;
