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
require("dotenv").config();
var async = require('async'),
AWS = require('aws-sdk'),
util = require('util'),
messageSizeLimit = 1024 * 250,
sqs = new AWS.SQS(),
queueURL = process.env.EVENT_ROUTER_SQS_URL;


exports.handler = function(event, context) {
  // console.log("event = " + util.inspect(event, {depth: 5}));
  // console.log("eventIDs = " + JSON.stringify(event.Records.map(function(record) {
  //   return record.eventID;
  // })));
  var buffer = {};
  event.Records.forEach(function(record) {
    var eventsJSON = new Buffer(record.kinesis.data, 'base64').toString('utf8'),
    clientToken = record.kinesis.partitionKey,
    events;
    try {
      events = JSON.parse(eventsJSON);
    } catch (e) {
      console.log("data is not valid: " + eventsJSON);
      return;
    }

    if (!buffer[clientToken]) {
      buffer[clientToken] = [];
    }
    buffer[clientToken] = buffer[clientToken].concat(events)
  });

  async.forEach(Object.keys(buffer), function(key, iterCallback) {
    var events = buffer[key],
    messages = [],
    currentMessage,
    currentMessageSize,
    newMessage = function() {
      currentMessage = {token: key, events: []},
      currentMessageSize = exports.jsonSizeOf(currentMessage);
    }

    newMessage();

    events.forEach(function(event) {
      var eventSize = exports.jsonSizeOf(event);

      if(currentMessageSize + eventSize + 1 > messageSizeLimit) {
        messages.push(currentMessage);
        newMessage();
      }

      currentMessage.events.push(event);
      currentMessageSize += eventSize + 1;
    });

    if (currentMessage.events.length) {
      messages.push(currentMessage);
    }
    exports.sendMessages(messages, iterCallback);
  }, function(err) {
    context.done(err);
  })
};


exports.sendMessages = function(messages, callback) {
  async.forEach(messages, function(msg, iterCallback) {
    var params = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: queueURL,
    };
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log(err);
      }
      iterCallback(err);
    });
  }, callback);
};

exports.jsonSizeOf = function(obj) {
  return JSON.stringify(obj).length;
}
