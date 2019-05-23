import * as React from 'react';
import MagicalStore from './magical-store';
import storeManager from './store-manager';
import { ConstructorFunction } from 'simplytyped';

const zip = <T, V>(a: T[], b: V[]) => a.slice(0, b.length).map((x, i) => [x, b[i]]);

export function connect<P = any, S = any>(component: React.ComponentClass, storeSourceClasses: ConstructorFunction<any>[]): React.ComponentClass<P, S> {

    const magicalStores = storeSourceClasses.map(storeSourceClass => storeManager.makeStoreFrom(storeSourceClass));
    const storeProperties = {};
    for (let [storeSourceClass, magicalStore] of zip(storeSourceClasses, magicalStores)) {
        if (!storeSourceClass) {
            throw new TypeError(`Expecting non-nullable storeSourceClass`);
        }
        const className: string = storeSourceClass.name;
        const name = className[0].toLowerCase() + className.substring(1);
        storeProperties[name] = magicalStore;
    }

    return class extends React.Component<P, S> {

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
            const { children, ...componentProperties } = this.props;
            return React.createElement(component, { ...storeProperties, ...componentProperties }, children);
        }

        onStoreUpdate = () => {
            this.forceUpdate();
        }
    };
}
