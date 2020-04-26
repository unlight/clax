import MagicalStore from './magical-store';
import { ConstructorFor } from 'simplytyped';

class StoreManager {
    private readonly instances = new Map<
        ConstructorFor<object> | object,
        InstanceType<ConstructorFor<any>> & MagicalStore
    >();

    makeStoreFrom<T = object>(storeSource: ConstructorFor<object> | object) {
        let magicalStore: MagicalStore<T> & T = this.instances.get(storeSource);
        if (magicalStore === undefined) {
            magicalStore = <any>new MagicalStore(storeSource);
            this.instances.set(storeSource, magicalStore);
        }
        return magicalStore;
    }

    getWholeState(): Map<any, any> {
        return new Map(
            Array.from(this.instances).map(
                ([storeSourceClass, magicalStore]: [any, MagicalStore]): [any, any] => {
                    return [storeSourceClass.name, magicalStore.getState()];
                },
            ),
        );
    }
}

const storeManager = new StoreManager();

export default storeManager;
