# lambda-event-router
deploy a lambda function for aggregating events from Kinesis and send to SQS

Usage:
=====

```
$> npm install
$> export EVENT_ROUTER_ROLE_ARN=<aws role arn for the lambda function>
$> export EVENT_ROUTER_KINESIS_ARN=<kinesis arn used as source>
$> export EVENT_ROUTER_SQS_URL=<destinate sqs url>
$> export EVENT_ROUTER_FUN_NAME=<lambda function name, optional, default JourneyEventRouter>
$> export ENV_ROUTER_LAMBDA_TIMEOUT=<lambda function timeout, optional, default 30 seconds>
$> export ENV_ROUTER_LAMBDA_MEM=<lambda function max memory, optional, default 128mb>
$> export EVENT_ROUTER_KINESIS_READ_BATCH_SIZE=<kinesis read batch size, optional, default 400 records>
$> export AWS_REGION=...
$> export AWS_ACCESS_KEY_ID=...
$> export AWS_SECRET_ACCESS_KEY=...
$> npm run deploy
```
