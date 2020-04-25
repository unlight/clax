# claxx

A state management library focusing on to reduce boilerplate code and learning cost

## Install

```sh
npm install react-claxx
```

## Usage

    import * as React from 'react';
    import * as ReactDOM from 'react-dom';
    import * as claxx from 'react-claxx';

    class CounterStore {
        count = 0;

        plus() {
            this.count += 1;
        }

        minus(n: number) {
            this.count -= n;
        }

        async plusMinus() {
            this.plus();
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.minus(1);
        }
    }

    class Counter extends React.Component {

        render() {
            return <div>
                <button onClick={() => this.props.counterStore.plus()}>+</button>
                <span>{this.props.counterStore.count}</span>
                <button onClick={() => this.props.counterStore.minus(1)}>-</button>
                <button onClick={() => this.props.counterStore.plusMinus()}>-1 after one second</button>
            </div>;
        }
    }

    const ConnectedCounter = claxx.connect(Counter, [CounterStore]);

    ReactDOM.render(<ConnectedCounter />, document.body.firstElementChild);

### Decorator

```ts
@claxx.store([CounterStore])
class Counter extends React.Component<PropTypes> {
    render() {
        return (
            <div>
                <button onClick={() => this.props.counterStore.plus()}>+</button>
                <span>{this.props.counterStore.count}</span>
                <button onClick={() => this.props.counterStore.minus(1)}>-</button>
                <button onClick={() => this.props.counterStore.plusMinus()}>
                    -1 after one second
                </button>
            </div>
        );
    }
}

ReactDOM.render(<Counter />, document.body.firstElementChild);
```

## Examples

See <https://github.com/unlight/claxx/tree/master/examples>

## Requirements

-   ES >= 2017

## License

[MIT](LICENSE) © tock203 & Roman
