/**
  Copyright (c) 2016 hustcc http://www.atool.org/
  License: MIT 
  https://github.com/hustcc/onfire.js
**/
// global event store
var __onfireEvents = {}, __cnt = 0; // evnet counter
function _bind(eventName, callback, is_one) {
  if (typeof eventName !== 'string' || typeof callback !== 'function') {
    throw new Error('args must be (string, function).');
  }
  if (! __onfireEvents[eventName]) {
    __onfireEvents[eventName] = {};
  }
  var key = 'e' + (++__cnt);  // event index
  __onfireEvents[eventName][key] = [callback, is_one];

  return [eventName, key];
}
/**
 *  onfire.on( event, func ) -> Object
 *  - event (String): The event name to subscribe / bind to
 *  - func (Function): The function to call when a new event is published / triggered
 *  Bind / subscribe the event name, and the callback function when event is triggered, will return an event Object
**/
function on(eventName, callback) {
  return _bind(eventName, callback, false);
}
/**
 *  onfire.one( event, func ) -> Object
 *  - event (String): The event name to subscribe / bind to
 *  - func (Function): The function to call when a new event is published / triggered
 *  Bind / subscribe the event name, and the callback function when event is triggered only once(can be triggered for one time), will return an event Object
**/
function one(eventName, callback) {
  return _bind(eventName, callback, true);
}
/**
 *  onfire.fire( event[, data1 [,data2] ... ] )
 *  - event (String): The message to publish
 *  - data...: The data to pass to subscribers / callbacks
 *  Publishes / fires the the event, passing the data to it's subscribers / callbacks
**/
function fire(eventName) {
  // 触发这个分类下的所有
  var callback, key;
  if (__onfireEvents[eventName]) {
    for (key in __onfireEvents[eventName]) {
      callback = __onfireEvents[eventName][key];

      callback[0].apply(null, Array.prototype.slice.call(arguments, 1)); // do the function
      if (callback[1]) delete __onfireEvents[eventName][key]; // when is one, delete it after triggle
    }
  }
}
/**
 * onfire.un( event ) -> Boolean
 *  - event (String / Object): The message to publish
 * When passed a event Object, removes a specific subscription.
 * When passed event name String, removes all subscriptions for that event name(hierarchy)
*
 * Unsubscribe / unbind an event or event object.
 *
 * Examples
 *
 *  // Example 1 - unsubscribing with a event object
 *  var event_object = onfire.on('my_event', myFunc);
 *  onfire.un(event_object);
 *
 *  // Example 2 - unsubscribing with a event name string
 *  onfire.un('my_event');
**/
function un(eventObject) {
  if (typeof eventObject === 'string') {
    // cancel the event name if exist
    if (__onfireEvents[eventObject]) {
      delete __onfireEvents[eventObject];
      return true;
    }
    return false;
  }
  else if (typeof eventObject === 'object') {
    var eventName = eventObject[0], key = eventObject[1];
    if (__onfireEvents[eventName] && __onfireEvents[eventName][key]) {
      delete __onfireEvents[eventName][key];
      return true;
    }
    // can not find this event, return false
    return false;
  }
}
/**
 *  onfire.clear()
 *  Clears all subscriptions
**/
function clear() {
  __onfireEvents = {};
}
/**
 *  onfire.events()
 *  Return the array of events.
**/
function events() {
  var evts = [], e;
  for (e in __onfireEvents) {
    evts.push(e);
  }
  return evts;
}
/**
 *  onfire.size()
 *  Return the length of events array.
**/
function size() {
  return events().length;
}