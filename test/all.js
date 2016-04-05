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
var index = require('../index')

var expect = require('chai').expect

describe('lambda event router module', function() {
  function last(array) {
    return array[array.length -1];
  }

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  var messagesSent;
  var processError;

  beforeEach(function() {
    messagesSent = [];
    processError = undefined;
    index.sendMessages = function(messages, callback) {
      messages.forEach(function(msg) {
        messagesSent.push(msg);
      });
      callback(processError);
    };
  });

  it('should calculate json size of a object', function(done) {
    var assertSize = function(obj) {
      expect(index.jsonSizeOf(obj)).to.equal(JSON.stringify(obj).length);
    }
    assertSize({"a": "b"});
    assertSize("abc");
    assertSize([{"a": "b"}, {"c": "d"}]);
    done();
  });


  it('should send messages to sqs and call context done', function(done) {
    var kEvent = clone(require('./test_input'))
    var context = {
      done: function(err, message) {
        if (err) { done(err); }
        expect(messagesSent).to.deep.equal([
          {"token":"j.25af16a2-df03-4b34-8f45-a8813aed4672",
           "events":[
             {"type":"track",
              "name":"click|basic edition|button",
              "properties":{"_locator":"INPUT"},
              "id":"62201764-7ff7-8c91-2f82-1c887f825db5",
              "uid":null,
              "anonymousId":"7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
              "at":"2015-09-25T00:48:10.956Z"
             },{
               "type":"track",
               "name":"click|plus edition|button",
               "properties":{"_locator":"INPUT"},
               "id":"e4da0b73-9c60-7466-12d9-8f442c6765ac",
               "uid":null,
               "anonymousId":"7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
               "at":"2015-09-25T00:48:11.317Z"
             }]}]);
        done();
      }
    }
    index.handler(kEvent, context);
  });

  it('should split the message if single message is too long', function(done) {
    var kEvent = clone(require('./test_input'));
    for(var i=0; i<=9; i++) {
      kEvent.Records = kEvent.Records.concat(kEvent.Records)
    }
    var context = {
      done: function(err, message) {
        if (err) { return done(err); }
        expect(messagesSent.length).to.equal(2);
        expect(JSON.stringify(messagesSent[0]).length).to.within(1024*249, 1024 * 250);
        expect(JSON.stringify(messagesSent[1]).length).to.below(1024 * 250);
        expect(messagesSent[0].events[0]).to.deep.equal(
          {
            "type":"track",
            "name":"click|basic edition|button",
            "properties":{"_locator":"INPUT"},
            "id":"62201764-7ff7-8c91-2f82-1c887f825db5",
            "uid":null,
            "anonymousId":"7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
            "at":"2015-09-25T00:48:10.956Z"});

        expect(last(messagesSent[1].events)).to.deep.equal(
          {
            "type":"track",
            "name":"click|plus edition|button",
            "properties":{"_locator":"INPUT"},
            "id":"e4da0b73-9c60-7466-12d9-8f442c6765ac",
            "uid":null,
            "anonymousId":"7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
            "at":"2015-09-25T00:48:11.317Z"
          });

        done();
      }
    }
    index.handler(kEvent, context);
  });


  it('should call context.done(err) when errors pop up', function(done) {
    var kEvent = clone(require('./test_input'));
    processError = new Error("sqs foo bar")
    var context = {
      done: function(err, message) {
        if (err) {
          done();
        } else if(message) {
          done();
        } else {
          done(new Error('Error - should have failed with bad event data'));
        }
      }
    }
    index.handler(kEvent, context);
  });

  it('should ignore datum not in valid json', function(done) {
    var kEvent = clone(require('./test_input'));
    kEvent.Records[0].kinesis.data += "foobar"
    var context = {
      done: function(err, message) {
        if (err) { done(err); }
        expect(messagesSent).to.deep.equal([
          {"token":"j.25af16a2-df03-4b34-8f45-a8813aed4672",
           "events":[
             {
               "type":"track",
               "name":"click|plus edition|button",
               "properties":{"_locator":"INPUT"},
               "id":"e4da0b73-9c60-7466-12d9-8f442c6765ac",
               "uid":null,
               "anonymousId":"7993751d-61e8-a1e8-1c9f-f2ddd0d53c56",
               "at":"2015-09-25T00:48:11.317Z"
             }]}]);
        done();
      }
    }
    index.handler(kEvent, context);
  });

});
