import * as lib from './index';
import { connect } from '.';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { render, fireEvent, cleanup, waitForElement, waitForDomChange } from 'react-testing-library';
import 'jest-dom/extend-expect';

class TestComponent extends Component<any, any> {
    render() {
        return <>
            <a data-testid="btn" onClick={this.props.testStore.inc}>btn</a>
            <a data-testid="doubleInc" onClick={this.props.testStore.doubleInc}>doubleInc</a>
            <main>{this.props.testStore.count}</main>
        </>;
    }
}

it('smoke test', () => {
    expect(lib).toBeDefined();
});

it('connect', () => {
    const ConnectedComponent = connect(TestComponent, [class TestStore { }]);
    expect(ConnectedComponent.prototype.componentDidMount).toBeInstanceOf(Function);
    expect(ConnectedComponent.prototype.componentWillUnmount).toBeInstanceOf(Function);
});

afterEach(cleanup);

it('connected component test action inc', async () => {
    class TestStore {
        count = 0;
        inc() {
            this.count += 1;
        }
    }
    const ConnectedComponent = connect(TestComponent, [TestStore]);
    const { container, getByTestId } = render(<ConnectedComponent />);
    fireEvent.click(getByTestId('btn'));
    expect(container).toHaveTextContent('1');
});

it('async doubleInc', async () => {
    class TestStore {
        count = 0;
        inc() {
            this.count++;
        }
        async doubleInc() {
            this.inc();
            await new Promise(resolve => setTimeout(resolve, 100));
            this.inc();
        }
    }
    const ConnectedComponent = connect(TestComponent, [TestStore]);
    const { container, getByTestId } = render(<ConnectedComponent />);
    fireEvent.click(getByTestId('doubleInc'));
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(container.querySelector('main')).toHaveTextContent('2');
});
