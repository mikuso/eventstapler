const StapledEmitter = require('./stapled-emitter');

class EventStapler {

    constructor() {
        this.stapledEmitters = new WeakMap();
    }

    staple(emitter) {
        const exists = this.stapledEmitters.get(emitter);
        if (exists) {
            throw Error(`Cannot staple the same EventEmitter more than once at a time`);
        }
        const stapled = new StapledEmitter(this, emitter);
        this.stapledEmitters.set(emitter, stapled);
        return stapled;
    }

    detach(emitter) {
        if (emitter instanceof StapledEmitter) {
            return emitter.detach();
        }
        const stapled = this.stapledEmitters.get(emitter);
        if (!stapled) return;
        return stapled.detach();
    }

    dereference(emitter) {
        this.stapledEmitters.delete(emitter);
    }
}

module.exports = EventStapler;
