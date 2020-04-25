import MagicalStore from './magical-store';
import { ConstructorFor } from 'simplytyped';

class StoreManager {
    private readonly instances = new Map<
        ConstructorFor<object>,
        InstanceType<ConstructorFor<any>> & MagicalStore
    >();

    makeStoreFrom<T = object>(StoreSource: ConstructorFor<object>) {
        let magicalStore: MagicalStore<T> & T = this.instances.get(StoreSource);
        if (magicalStore === undefined) {
            magicalStore = <any>new MagicalStore(new StoreSource());
            this.instances.set(StoreSource, magicalStore);
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
