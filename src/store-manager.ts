import MagicalStore from './magical-store';
import { ConstructorFunction } from 'simplytyped';

class StoreManager {

    private instances = new Map<ConstructorFunction<any>, (InstanceType<ConstructorFunction<any>> & MagicalStore)>();

    makeStoreFrom<T extends object = any>(storeSourceClass: ConstructorFunction<T>) {
        let magicalStore: MagicalStore<T> & T = this.instances.get(storeSourceClass);
        if (magicalStore === undefined) {
            magicalStore = <any>new MagicalStore(new storeSourceClass());
            this.instances.set(storeSourceClass, magicalStore);
        }
        return magicalStore;
    }

    getWholeState(): Map<any, any> {
        return new Map(Array.from(this.instances).map(([storeSourceClass, magicalStore]: [any, MagicalStore]): [any, any] => {
            return [storeSourceClass.name, magicalStore.getState()];
        }));
    }
}

const storeManager = new StoreManager();

export default storeManager;
