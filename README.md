# EventStapler

Event Stapler is a utility to attach a collection of event listeners to an emitter in such a way that it is very easy to unbind them all later.  All events attached via a staple can be detached in a single call, or after a specific event is fired by the emitter.

## Example

```js
const eventStapler = new EventStapler();

const stapled = eventStapler.staple(stream)
    .on('data', onData)
    .once('end', onEnd)
    .once('error', onError, null, stream)
    .once('close')
    .detachAfter('close')
    .detachAfter('error');

function onData(chunk) {
    // process data
}

function onEnd(stream) {
    // handler is called with additional parameters provided at point of binding


    stapled.release(); // manually remove staple. all event handlers detached.
    eventStapler.release(stream); // alternatively, pass the emitter to stapler.release()
}

function onError(err) {
    // handle error.
    // don't worry about cleaning up old event listeners
}

```
