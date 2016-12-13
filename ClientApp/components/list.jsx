import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as ItemTypes from "../constants/itemTypes";
import Card from "./card.jsx";

import shouldPureComponentUpdate from './shouldPureComponentUpdate';

const groupTarget = {

    hover(props, monitor) {
        if (monitor.isOver()) {
            var card = monitor.getItem();
            //formElement has been dragged to a section.
            if (card.listId !== props.list.id) {
                props.moveFormElementChangeSection(card, props.list.id);

                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                monitor.getItem().listId = props.list.listId;
            }


        }

    }

};

function collectTarget(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver(),
        connectDropTarget: connect.dropTarget(),
        getItem: monitor.getItem(),


    };
}

export class List extends React.Component {
    render() {
        const {list, moveFormElement, isOverCurrent, connectDropTarget, isDragging, isOver, getItem } = this.props;
        let dragElement = getItem;
        if (dragElement === null) {
            dragElement = {};
        }
        const cards = list.cards.map(card => {
            let dragging = false;

            //This is used to ensure that when a drag is beetween 2 list. We show a grey square. 
            if (card.id === dragElement.id) {
                dragging = true;
            }


            return <Card
                dragging={dragging}
                card={card}
                key={card.id}
                moveFormElement={moveFormElement}
                />
        });

        return connectDropTarget(<div className="form-section">
            <h2>{list.title}</h2>
            {cards}
        </div>);
    }
}

List = DropTarget(ItemTypes.CARD, groupTarget, collectTarget)(List);
export default List;