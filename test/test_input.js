/***************************************************************************
 * Copyright 2016 ThoughtWorks, Inc. and Pengchao Wang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **************************************************************************/
module.exports = {
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
};
