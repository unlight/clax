import * as React from 'react';
import MagicalStore from './magical-store';
import storeManager from './store-manager';
import { ConstructorFunction } from 'simplytyped';

const zip = <T, V>(a: T[], b: V[]) => a.slice(0, b.length).map((x, i) => [x, b[i]]);
const omit = <T>(obj: T, props: (keyof T)[]) => props.reduce((newObj: any, val: any) => (({ [val]: dropped, ...rest }) => rest)(newObj), obj);

export function connect(component: React.ComponentClass, storeSourceClasses: ConstructorFunction<any>[]): React.ComponentClass {

    const magicalStores = storeSourceClasses.map(storeSourceClass => storeManager.makeStoreFrom(storeSourceClass));
    const storeProps: { [key: string]: MagicalStore | undefined } = {};
    for (let [storeSourceClass, magicalStore] of zip(storeSourceClasses, magicalStores)) {
        if (!storeSourceClass) {
            throw new TypeError(`Expecting non-nullable storeSourceClass`);
        }
        const className: string = storeSourceClass.name;
        const name = className[0].toLowerCase() + className.substring(1);
        storeProps[name] = magicalStore;
    }

    return class extends React.Component {
        constructor(props: any) {
            super(props)
            this.onStoreUpdate = this.onStoreUpdate.bind(this);
        }

        componentDidMount() {
            for (let magicalStore of magicalStores) {
                magicalStore.notifier.addListener(this.onStoreUpdate);
            }
        }

        componentWillUnmount() {
            for (let magicalStore of magicalStores) {
                magicalStore.notifier.removeListener(this.onStoreUpdate);
            }
        }

        render() {
            return React.createElement(component, { ...storeProps, ...omit(this.props, ['children']) }, this.props.children);
        }

        onStoreUpdate() {
            this.forceUpdate();
        }
    }
}
