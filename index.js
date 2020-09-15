
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

        if (['string', 'symbol'].indexOf(typeof event) === -1) {
            throw Error(`Event name must be a string or a symbol`);
        }

        if (!(handler instanceof Function)) {
            throw Error(`Event handler must be a function`);
        }

        const boundHandler = handler.bind(binding, ...args);
        let method = this._emitter.on ? 'on' : 'addEventListener';
        if (onlyOnce) {
            method = 'once';
        }
        if (!this._emitter[method]) {
            throw Error(`EventEmitter doesn't support method .${method}()`);
        }
        this._emitter[method](event, boundHandler);
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
        return this.on(event, this.release, this);
    }

    release() {
        if (this._isReleased) {
            return this;
        }

        for (const eventHandler of this._eventHandlers) {
            let method = this._emitter.removeListener ? 'removeListener' : 'removeEventListener';
            this._emitter[method](eventHandler.event, eventHandler.boundHandler);
        }

        return this;
    }
}

module.exports = function(emitter) {
    return new StapledEmitter(emitter);
}
