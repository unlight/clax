import Notifier from './Notifier';

describe('Notifier', () => {

    it('smoke test', () => {
        expect(Notifier).toBeDefined();
    });

    let n: Notifier;

    beforeEach(() => {
        n = new Notifier();
    });

    it('addListener', () => {
        const listener = jest.fn();
        n.addListener(listener);
        n.notify();
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
