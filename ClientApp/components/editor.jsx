// React or Redux
import React from "react";
import update from "react/lib/update"
import * as _ from 'lodash';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import 'browsernizr/test/touchevents';

import Modernizr from 'browsernizr';
// Child Components
import List from "./list.jsx";

import CardDragLayer from './cardDragLayer';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.state;

        this.addCardsToList = this.addCardsToList.bind(this);
        //DnD
        this.moveFormElement = this.moveFormElement.bind(this);
        this.moveFormElementChangeSection = this.moveFormElementChangeSection.bind(this);
    }

    moveFormElementChangeSection(dragElement, listId) {
        const {cards} = this.state;
        var newCards = cards.map(card => {
            if (card.id === dragElement.id)
                return Object.assign({}, card, { listId });

            return card;
        });
        this.setState({ cards: newCards });
        // this.props.formElementActions.updateFormElementsOrder(newCards);
        return;
    }

    moveFormElement(dragElement, hoverElement) {
        const {cards} = this.state;
        if (dragElement.index === hoverElement.index)
            return;
        var element = cards[dragElement.index];

        /* This is taken care of in moveFormElementChangeSection
        if (hoverElement.sectionId !== dragElement.sectionId) {
            element = Object.assign({}, element, { sectionId: hoverElement.sectionId });
        }*/


        var newFormElements1 = update(cards, {
            $splice: [
                [dragElement.index, 1],
                [hoverElement.index, 0, element]
            ]
        });

        this.setState({ cards: newFormElements1 });
        return;
    }

    addCardsToList(lists, cards) {
        return lists.map(list => {
            let cardsInList = [];
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].listId === list.id)
                    cardsInList.push(cards[i]);
            }
            return Object.assign({}, list, { cards: cardsInList });
        })

    }
    //moving the formElement to a new section

    render() {
        const lists = this.addCardsToList(this.state.lists, this.state.cards);
        const {moveFormElement, moveFormElementChangeSection} = this;
        return <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <div className="page-title-box clearfix">
                        <p> List and Cards </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {lists.map((list) => {
                        return <div className="card-box" key={list.id}>
                            <fieldset>
                                <legend className="header-title">{list.title}</legend>
                                <div>
                                    <List
                                        key={list.id}
                                        list={list}
                                        moveFormElement={moveFormElement}
                                        moveFormElementChangeSection={moveFormElementChangeSection}
                                        />

                                </div>
                            </fieldset>
                        </div>
                    })}
                    <CardDragLayer />
                </div>
            </div>
        </div>

    }
}



//Render either Html5Backend or TouchBackend depending on browser support for touch.
Editor = DragDropContext(Modernizr.touchevents ? TouchBackend : HTML5Backend)(Editor);
export default Editor;