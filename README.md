# EventStapler

Event Stapler is a utility to attach a collection of event listeners to an emitter in such a way that it is very easy to unbind them all later.  All events attached via a staple can be detached in a single call, or after a specific event is fired by the emitter.

## Example

```js
const eventStapler = require('.');
const stream = require('fs').createReadStream('./README.md');

const stapled = eventStapler(stream)
    .on('data', onData)
    .once('end', onEnd, null, stream)
    .once('error', onError, null, stream)
    .once('close', onClose)
    .releaseAfter('close')
    .releaseAfter('error');

function onData(chunk) {
    // process data
    console.log('CHUNK', chunk);
}

function onEnd(stream) {
    // handler is called with additional parameters provided at point of binding
    console.log('END');
    stapled.release(); // manually remove staple. all event handlers released.
}

function onClose() {
    console.log('CLOSE');
}

function onError(err) {
    // handle error.
    // don't worry about cleaning up old event listeners
    console.log('ERROR', err);
}
```
