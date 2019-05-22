import Notifier from './notifier';
import storeManager from './store-manager';

export default class MagicalStore<T = any> {

    private state: { [key: string]: any } = {};
    private actionCallDepth = 0;
    public notifier = new Notifier();

    constructor(private source: T) {
        this.configureState();
        this.configureAction();
    }

    getState() {
        return this.state;
    }

    private configureState() {
        const stateKeys = Object.keys(this.source);
        for (let stateKey of stateKeys) {
            this.state[stateKey] = JSON.parse(JSON.stringify((this.source as any)[stateKey]));

            Object.defineProperty(this, stateKey, {
                get: () => this.state[stateKey],
                set: (value: any) => {
                    this.state[stateKey] = value;
                }
            })
        }
    }

    private configureAction() {
        const actionNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.source));
        for (let actionName of actionNames) {
            const action = (this.source as any)[actionName].bind(this);
            const isSync = action.constructor.name !== 'AsyncFunction';

            (this as any)[actionName] = function(this: MagicalStore, ...args: any[]) {
                if (!isSync || 0 >= this.actionCallDepth) {
                    // console.debug(
                    //     'claxx:',
                    //     `${isSync ? 'Sync' : 'Async'}ActionInvoked:`,
                    //     `${this.source.constructor.name}#${actionName}`,
                    //     // args
                    // )
                }

                let prevState;
                if (isSync) {
                    if (0 >= this.actionCallDepth) {
                        prevState = JSON.parse(JSON.stringify(this.state));
                    }
                    this.actionCallDepth += 1
                }

                try {
                    action(...args);
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
            }.bind(this);
        }
    }
}
