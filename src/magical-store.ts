import Notifier from './notifier';
import storeManager from './store-manager';
import { PlainObject } from 'simplytyped';

export default class MagicalStore<T = any> {
    public notifier = new Notifier();

    private readonly state: PlainObject = {};
    private actionCallDepth = 0;

    constructor(private readonly source: T) {
        this.configureState();
        this.configureAction();
    }

    getState() {
        return this.state;
    }

    private configureState() {
        const stateKeys = Object.keys(this.source);
        for (const stateKey of stateKeys) {
            this.state[stateKey] = JSON.parse(JSON.stringify((this.source as any)[stateKey]));

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
                if (!isSync || 0 >= this.actionCallDepth) {
                    // console.debug(
                    //     'claxx:',
                    //     `${isSync ? 'Sync' : 'Async'}ActionInvoked:`,
                    //     `${this.source.constructor.name}#${actionName}`,
                    //     // args
                    // )
                }

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
                    // const changes = diff(prevState, this.state);
                    // console.debug('claxx:', 'StateChanged:', this.source.constructor.name, changes, storeManager.getWholeState());
                    this.notifier.notify();
                }
            };
        }
    }
}
