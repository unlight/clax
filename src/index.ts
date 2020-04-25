import * as React from 'react';
import MagicalStore from './magical-store';
import storeManager from './store-manager';
import { ConstructorFor } from 'simplytyped';

export function connect<P = any, S = any>(
    component: React.ComponentClass,
    storeSourceClasses: ConstructorFor<object>[],
): React.ComponentClass<P, S> {
    const storeProperties: Record<string, MagicalStore<object>> = {};
    const magicalStores: MagicalStore<object>[] = [];

    for (const StoreSource of storeSourceClasses) {
        const magicalStore = storeManager.makeStoreFrom(StoreSource);
        magicalStores.push(magicalStore);
        const className: string = StoreSource.name;
        const name = className[0].toLowerCase() + className.substring(1);
        storeProperties[name] = magicalStore;
    }

    return class extends React.Component<P, S> {
        componentDidMount() {
            for (const magicalStore of magicalStores) {
                magicalStore.notifier.addListener(this.onStoreUpdate);
            }
        }

        componentWillUnmount() {
            for (const magicalStore of magicalStores) {
                magicalStore.notifier.removeListener(this.onStoreUpdate);
            }
        }

        render() {
            const { children, ...componentProperties } = this.props;
            return React.createElement(
                component,
                { ...storeProperties, ...componentProperties },
                children,
            );
        }

        onStoreUpdate = () => {
            this.forceUpdate();
        };
    };
}

export function store(storeSourceClasses: ConstructorFor<object>[]) {
    return (component: any) => {
        return connect(component, [...storeSourceClasses]);
    };
}
