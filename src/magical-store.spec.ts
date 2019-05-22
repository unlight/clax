import MagicalStore from './magical-store';

it('smoke test', () => {
    expect(MagicalStore).toBeDefined();
});

it('test store', () => {
    class TestStore {
        count = 1;
        inc() {
            this.count++;
        }
    }
    const store = new MagicalStore(new TestStore());
    expect(store.getState()).toEqual({ count: 1 });
});
