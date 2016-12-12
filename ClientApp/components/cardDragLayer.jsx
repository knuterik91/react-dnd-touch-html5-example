import React from 'react';
import * as ItemTypes from "../constants/itemTypes";
import CardDragPreview from './cardDragPreview';
//import snapToGrid from './snapToGrid';
import { DragLayer } from 'react-dnd';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
};

function getItemStyles(props) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none'
        };
    }

    let { x, y } = currentOffset;

    /*if (props.snapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;
    }*/

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform
    };
}

function ourDragLayer(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

export class CardDragLayer extends React.Component {

    renderItem(type, item) {
        switch (type) {
            case ItemTypes.CARD:
                return (
                    <CardDragPreview item={item} />
                );
            default:
                return null;
        }
    }

    render() {
        const { item, itemType, isDragging } = this.props;
        if (!isDragging) {
            return null;
        }

        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        );
    }
}

CardDragLayer = DragLayer(ourDragLayer)(CardDragLayer);
export default CardDragLayer;