import storeManager from './store-manager';
import MagicalStore from './magical-store';

it('smoke test', () => {
    expect(storeManager).toBeDefined();
});

it('makeStoreFrom', () => {
    class TestStore {
        count = 0;
        inc() {
            this.count++;
        }
    }
    const store: TestStore & MagicalStore = storeManager.makeStoreFrom(TestStore);
    expect(store).toBeInstanceOf(MagicalStore);
    expect(store.getState().count).toBe(0);
    store.inc();
    expect(store.getState().count).toBe(1);
});
