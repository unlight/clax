import * as React from 'react';
import MagicalStore from './magical-store';
import storeManager from './store-manager';
import { ConstructorFor } from 'simplytyped';

export function connect<P = any, S = any>(storeSourceClasses: ConstructorFor<object>[]) {
    return (component: React.ComponentClass): ConstructorFor<React.Component<P, S>> => {
        const storeProperties: Record<string, MagicalStore<object>> = {};
        const magicalStores: MagicalStore<object>[] = [];

        for (const StoreSource of storeSourceClasses) {
            const magicalStore = storeManager.makeStoreFrom(StoreSource);
            magicalStores.push(magicalStore);
            const name = magicalStore.name[0].toLowerCase() + magicalStore.name.slice(1);
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
    };
}
