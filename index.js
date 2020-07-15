
class StapledEmitter {
    constructor(emitter) {
        this._isReleased = false;
        this._emitter = emitter;
        this._eventHandlers = [];
    }

    _add(onlyOnce, event, handler, binding, ...args) {
        if (this._isReleased) {
            throw Error(`Staple is released`);
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

    releaseAfter(event) {
        return this.once(event, this.release, this);
    }

    release() {
        if (this._isReleased) {
            return this;
        }

        for (const eventHandler of this._eventHandlers) {
            this._emitter.removeListener(eventHandler.event, eventHandler.boundHandler);
        }

        return this;
    }
}

module.exports = function(emitter) {
    return new StapledEmitter(emitter);
}
