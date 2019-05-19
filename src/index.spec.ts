import * as lib from './index';
import { connect } from '.';
import { Component } from 'react';

class TestComponent extends Component {

}

class TestStore {
    count = 0;
    inc() {
        this.count++;
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
