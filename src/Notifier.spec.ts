import Notifier from './notifier';

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

    it('removeListener', () => {
        const listener = jest.fn();
        n.addListener(listener);
        n.removeListener(listener);
        n.notify();
        expect(listener).not.toHaveBeenCalled();
    });
});
