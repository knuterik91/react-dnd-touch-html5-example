import shallowEqual from './shallowEqual';

export default function shouldPureComponentUpdate(nextProps, props) {
    return !shallowEqual(props, nextProps);
    //!shallowEqual(this.state, nextState);
}