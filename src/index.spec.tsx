import * as lib from './index';
import { connect } from '.';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as testUtils from 'react-dom/test-utils';

class TestComponent extends Component<any, any> {
    render() {
        console.log("this.props", this.props.testStore);
        return <>
            <a onClick={this.props.testStore.inc}>+1</a>
            <p>{this.props.testStore.count}</p>
        </>;
    }
}

class TestStore {
    count = 0;
    inc() {
        this.count += 1;
    }
}

it('smoke test', () => {
    expect(lib).toBeDefined();
});

it('connect', () => {
    const ConnectedComponent = connect(TestComponent, [TestStore]);
    expect(ConnectedComponent.prototype.componentDidMount).toBeInstanceOf(Function);
    expect(ConnectedComponent.prototype.componentWillUnmount).toBeInstanceOf(Function);
});
