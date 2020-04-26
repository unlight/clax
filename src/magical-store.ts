import Notifier from './notifier';
import storeManager from './store-manager';
import { PlainObject } from 'simplytyped';

export default class MagicalStore<T = any> {
    public notifier = new Notifier();
    readonly name: string = '';

    private readonly state: PlainObject = {};
    private actionCallDepth = 0;
    private readonly source: T = (null as unknown) as T;

    constructor(unknown: any) {
        const type = typeof unknown;
        if (type === 'object') {
            this.name = unknown.constructor.name;
            this.source = unknown;
        } else if (type === 'function') {
            this.name = unknown.name;
            this.source = new unknown();
        } else {
            throw new TypeError(`Unexpected argument ${type}`);
        }
        this.configureState();
        this.configureAction();
    }

    getState() {
        return this.state;
    }

    private configureState() {
        const stateKeys = Object.keys(this.source);
        const sourceCopy = JSON.parse(JSON.stringify(this.source));
        for (const stateKey of stateKeys) {
            this.state[stateKey] = sourceCopy[stateKey];

            Object.defineProperty(this, stateKey, {
                get: () => this.state[stateKey],
                set: (value: any) => {
                    this.state[stateKey] = value;
                },
            });
        }
    }

    private configureAction() {
        const actionNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.source));
        for (const actionName of actionNames) {
            const action = (this.source as any)[actionName].bind(this);
            const isSync = action.constructor.name !== 'AsyncFunction';

            (this as any)[actionName] = (...arguments_: any[]) => {
                let previousState;
                if (isSync) {
                    if (0 >= this.actionCallDepth) {
                        previousState = JSON.parse(JSON.stringify(this.state));
                    }
                    this.actionCallDepth += 1;
                }

                try {
                    action(...arguments_);
                } finally {
                    if (isSync) {
                        this.actionCallDepth -= 1;
                    }
                }

                if (isSync && 0 >= this.actionCallDepth) {
                    this.notifier.notify();
                }
            };
        }
    }
}
