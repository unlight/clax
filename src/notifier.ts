export default class Notifier {
    private listeners: (() => void)[] = [];

    addListener(listener: () => void) {
        this.listeners.push(listener);
    }

    removeListener(listener: () => void) {
        this.listeners = this.listeners.filter((x) => x !== listener);
    }

    notify() {
        this.listeners.forEach(Function.prototype.call, Function.prototype.call);
    }
}
