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
function string(value) {
  return value;
}

function integer(value) {
  return parseInt(value);
}

function readEnv(env, type, defaultValue) {
  var val = process.env[env]
  if(type === undefined) {
    type = string;
  }

  if(val !== undefined) {
    return type(val);
  }

  if(defaultValue === undefined) {
    throw "You must set env: " + env;
  } else {
    return defaultValue;
  }
}

module.exports = {
  handler: "index.handler",
  role: readEnv("EVENT_ROUTER_ROLE_ARN", string),
  functionName: readEnv("EVENT_ROUTER_FUN_NAME", string, "JourneyEventRouter"),
  timeout: readEnv("ENV_ROUTER_LAMBDA_TIMEOUT", integer, 30),
  memorySize: readEnv("ENV_ROUTER_LAMBDA_MEM", integer, 128),
  eventSource: {
    EventSourceArn: readEnv("EVENT_ROUTER_KINESIS_ARN", string),
    BatchSize: readEnv("EVENT_ROUTER_KINESIS_READ_BATCH_SIZE", integer, 400),
    StartingPosition: "TRIM_HORIZON"
  }
}
