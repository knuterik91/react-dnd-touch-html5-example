import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';

const styles = {
    display: 'inline-block'
};

export default class CardDragPreview extends Component {
    render() {
        const { item } = this.props;
        //const { tickTock } = this.state;
        return (
            <div style={styles}>
                <p> im dragging a {item.title} </p>
            </div>
        );
    }
}