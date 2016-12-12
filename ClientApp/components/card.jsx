// React
import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { flow } from "lodash";
import { findDOMNode } from 'react-dom';
// Child Components
import * as ItemTypes from "../constants/itemTypes";

import shouldPureComponentUpdate from './shouldPureComponentUpdate';
//DnD --->
//this is for the place holder
const style = {
    backgroundColor: "#e2e4e6"
};
const formElementSource = {

    beginDrag(props) {
        return {
            id: props.card.id,
            index: props.card.index,
            listId: props.card.listId,
            title: props.card.title
        };
    },

    isDragging(props, monitor) {
        return props.card.id === monitor.getItem().id;
    },

};

const formElementTarget = {

    hover(props, monitor, component) {
        const dragElement = monitor.getItem();
        const hoverElement = props.card
        if (dragElement.index === hoverElement.index) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragElement.index < hoverElement.index && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragElement.index > hoverElement.index && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveFormElement(dragElement, hoverElement);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverElement.index;
    }
};

function collectSource(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

function collectTarget(connect) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:

        connectDropTarget: connect.dropTarget(),

        // You can ask the monitor about the current drag state:

    };
}

// <--- Dnd

class Card extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return shouldPureComponentUpdate(nextProps, this.props);
    };

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), {
            // IE fallback: specify that we'd rather screenshot the node
            // when it already knows it's being dragged so we can hide it with CSS.
            captureDraggingState: true
        });
    }

    render() {
        const {isDragging, connectDragSource, connectDropTarget, connectDragPreview, dragging } = this.props;
        let opacity = isDragging ? 0 : 1;
        let backgroundColor = isDragging ? "#e2e4e6" : "";
        /*this is needed to ensure that the droptarget is greyed out, when 
        **the same drag goes back and forth beetween sections */
        if (dragging) {
            opacity = 0;
            backgroundColor = "#e2e4e6";
        }
        return connectDropTarget(<div className="m-b-30" style={{ backgroundColor }}>
            {connectDragSource(<button style={{ opacity }} type="button">Drag</button>)}
            <h3 style={{ opacity }}>{this.props.card.title}</h3>
        </div>
        );
    }
}

Card = flow(DragSource(ItemTypes.CARD, formElementSource, collectSource), DropTarget(ItemTypes.CARD, formElementTarget, collectTarget))(Card);
export default Card;