import { connect } from '.';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { render, fireEvent, cleanup, waitForElement, waitForDomChange } from 'react-testing-library';
import 'jest-dom/extend-expect';

class TestComponent extends React.Component<any, any> {
    render() {
        return <>
            <p data-testid="prop1">{this.props.prop1}</p>
            <a data-testid="btn" onClick={this.props.testStore.inc}>btn</a>
            <a data-testid="doubleInc" onClick={this.props.testStore.doubleInc}>doubleInc</a>
            <main id="count">{this.props.testStore.count}</main>
            <p data-testid="children">{this.props.children}</p>
        </>;
    }
}

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
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.inc();
        }
    }
    jest.useFakeTimers();
    const ConnectedComponent = connect(TestComponent, [TestStore]);
    const { container, getByTestId } = render(<ConnectedComponent />);
    fireEvent.click(getByTestId('doubleInc'));
    jest.runAllTimers();
    await Promise.resolve();
    expect(container.querySelector('#count')).toHaveTextContent('2');
});

it('props children should be omited', async () => {
    class TestStore { }
    const ConnectedComponent = connect(TestComponent, [TestStore]);
    const { container, getByTestId  } = render(<ConnectedComponent prop1="Crossbow">hello</ConnectedComponent>);
    expect(getByTestId('prop1')).toHaveTextContent('Crossbow');
    expect(getByTestId('children')).toHaveTextContent('hello');
});
