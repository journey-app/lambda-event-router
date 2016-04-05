# lambda-event-router
deploy a lambda function for aggregating events from Kinesis and send to SQS

## What it does

After deployed, the lambda function batch reads records from Kinese stream, group those records base on the Kineses partition key, and generate minimal amount SQS messages within message size limit (256K) and send to queue. 

Example
Kinises records:
```
{
    "Records": [
        {
            "kinesis": {
                "kinesisSchemaVersion": "1.0",
                "partitionKey": "j.25af16a2-df03-4b34-8f45-a8813aed4672",
                "sequenceNumber": "49554761490057386891188033374880793084500745700843192322",
                "data": "W3sidHlwZSI6InRyYWNrIiwibmFtZSI6ImNsaWNrfGJhc2ljIGVkaXRpb258YnV0dG9uIiwicHJvcGVydGllcyI6eyJfbG9jYXRvciI6IklOUFVUIn0sImlkIjoiNjIyMDE3NjQtN2ZmNy04YzkxLTJmODItMWM4ODdmODI1ZGI1IiwidWlkIjpudWxsLCJhbm9ueW1vdXNJZCI6Ijc5OTM3NTFkLTYxZTgtYTFlOC0xYzlmLWYyZGRkMGQ1M2M1NiIsImF0IjoiMjAxNS0wOS0yNVQwMDo0ODoxMC45NTZaIn1d"
            },
            "eventSource": "aws:kinesis",
            "eventVersion": "1.0",
            "eventID": "shardId-000000000000:49554761490057386891188033374880793084500745700843192322",
            "eventName": "aws:kinesis:record",
            "invokeIdentityArn": "arn:aws:iam::xxxxxx:role/lambda_kinesis_role",
            "awsRegion": "us-east-1",
            "eventSourceARN": "arn:aws:kinesis:us-east-1:xxxxxx:stream/journey-event-stream-production-KinesisStream-1A9VCZ46YLDLQ"
        },
        {
            "kinesis": {
                "kinesisSchemaVersion": "1.0",
                "partitionKey": "j.25af16a2-df03-4b34-8f45-a8813aed4672",
                "sequenceNumber": "49554761490057386891188033374882002010320360398737375234",
                "data": "W3sidHlwZSI6InRyYWNrIiwibmFtZSI6ImNsaWNrfHBsdXMgZWRpdGlvbnxidXR0b24iLCJwcm9wZXJ0aWVzIjp7Il9sb2NhdG9yIjoiSU5QVVQifSwiaWQiOiJlNGRhMGI3My05YzYwLTc0NjYtMTJkOS04ZjQ0MmM2NzY1YWMiLCJ1aWQiOm51bGwsImFub255bW91c0lkIjoiNzk5Mzc1MWQtNjFlOC1hMWU4LTFjOWYtZjJkZGQwZDUzYzU2IiwiYXQiOiIyMDE1LTA5LTI1VDAwOjQ4OjExLjMxN1oifV0="
            },
            "eventSource": "aws:kinesis",
            "eventVersion": "1.0",
            "eventID": "shardId-000000000000:49554761490057386891188033374882002010320360398737375234",
            "eventName": "aws:kinesis:record",
            "invokeIdentityArn": "arn:aws:iam::xxxxxx:role/lambda_kinesis_role",
            "awsRegion": "us-east-1",
            "eventSourceARN": "arn:aws:kinesis:us-east-1:xxxxxx:stream/journey-event-stream-production-KinesisStream-1A9VCZ46YLDLQ"
        }
    ]
}
```
SQS messages
```
[
  {
    "token": "j.25af16a2-df03-4b34-8f45-a8813aed4672",
    "events": [
      {
        "type": "track",
        "name": "click|basic edition|button",
        "properties": {
          "_locator": "INPUT"
        },
        "id": "62201764-7ff7-8c91-2f82-1c887f825db5",
        "uid": null,
        "anonymousId": "7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
        "at": "2015-09-25T00:48:10.956Z"
      },
      {
        "type": "track",
        "name": "click|plus edition|button",
        "properties": {
          "_locator": "INPUT"
        },
        "id": "e4da0b73-9c60-7466-12d9-8f442c6765ac",
        "uid": null,
        "anonymousId": "7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
        "at": "2015-09-25T00:48:11.317Z"
      }
    ]
  }
]
```

## When to use:

When batch importing records from Kinesis into certain database with write throughput limit.

## How to use:


```
$> npm install
$> export EVENT_ROUTER_ROLE_ARN=<aws role arn for the lambda function>
$> export EVENT_ROUTER_KINESIS_ARN=<kinesis arn used as source>
$> export EVENT_ROUTER_SQS_URL=<destinate sqs url>
$> export EVENT_ROUTER_FUN_NAME=<lambda function name, optional, default LambdaEventRouter>
$> export ENV_ROUTER_LAMBDA_TIMEOUT=<lambda function timeout, optional, default 30 seconds>
$> export ENV_ROUTER_LAMBDA_MEM=<lambda function max memory, optional, default 128mb>
$> export EVENT_ROUTER_KINESIS_READ_BATCH_SIZE=<kinesis read batch size, optional, default 400 records>
$> export AWS_REGION=...
$> export AWS_ACCESS_KEY_ID=...
$> export AWS_SECRET_ACCESS_KEY=...
$> npm run deploy
```
