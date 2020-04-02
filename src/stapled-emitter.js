
class StapledEmitter {
    constructor(stapler, emitter) {
        this._detached = false;
        this._stapler = stapler;
        this._emitter = emitter;
        this._eventHandlers = [];
    }

    _add(onlyOnce, event, handler, binding, ...args) {
        if (this._detached) {
            throw Error(`Staple is detached`);
        }

        if (typeof event !== 'string') {
            throw Error(`Event name must be a string`);
        }

        if (!(handler instanceof Function)) {
            throw Error(`Event handler must be a function`);
        }

        const boundHandler = handler.bind(binding, ...args);
        this._emitter[onlyOnce?'once':'on'](event, boundHandler);
        this._eventHandlers.push({
            event,
            boundHandler
        });

        return this;
    }

    on(...args) {
        return this._add(false, ...args);
    }

    once(...args) {
        return this._add(true, ...args);
    }

    detachAfter(event) {
        return this.once(event, this.detach, this);
    }

    detach() {
        if (this._detached) {
            return this;
        }

        for (const eventHandler of this._eventHandlers) {
            this._emitter.removeListener(eventHandler.event, eventHandler.boundHandler);
        }

        this._stapler.dereference(this._emitter);
        return this;
    }
}

module.exports = StapledEmitter;
