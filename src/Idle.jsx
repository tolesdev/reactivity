import React from 'react';
import PropTypes from 'prop-types';
import IdleService from './Idle.service';
import { ACTIVITY_EVENTS, INTERVAL } from './utils/consts';

class Idle extends React.Component {
    constructor (props) {
        super(props);
        this.state = { isIdle: false };
        this.idleService = new IdleService(this.props.gracePeriod);
        // TODO: Implement 'passive' activity tracking.
        this.active = !this.props.passive
        this.intervalLength = 500;
    }
    componentDidMount = () => {
        this.idleService.registerActivity();
        ACTIVITY_EVENTS.forEach(event => this.props.element.addEventListener(event, this.onActive));
        this.activityInterval = this.active && this.createActivityInterval();
    }
    componentDidUpdate = () => {
        if (this.state.isIdle) {
            clearInterval(this.activityInterval);
            this.idleInterval = this.createIdleInterval();
        }
        else if (!this.state.isIdle) {
            clearInterval(this.idleInterval);
            this.activityInterval = this.active && this.createActivityInterval();
        }
    }
    componentWillUnmount = () => {
        clearInterval(this.activityInterval);
        clearInterval(this.idleInterval);
        ACTIVITY_EVENTS.forEach(event => this.props.element.removeEventListener(event, this.onActive));
    }
    onActive = () => {
        this.idleService.registerActivity();
        typeof this.props.onActive === 'function' && this.props.onActive();
        if (this.state.isIdle) this.onReturn();
    }
    onIdle = () => {
        typeof this.props.onIdle === 'function' && this.props.onIdle();
        this.setState({ isIdle: true });
    }
    onReturn = () => {
        typeof this.props.onReturn === 'function' && this.props.onReturn();
        this.setState({ isIdle: false });
    }
    createActivityInterval = () => {
        return setInterval(() => {
            if (this.idleService.timeRemaining() <= 0) {
                this.onIdle();
            }
        }, INTERVAL);
    }
    createIdleInterval = () => {
        return setInterval(() => {
            if (this.idleService.timeRemaining() > 0) {
                this.onReturn();
            }
        }, INTERVAL);
    }
    render = () => {
        return null;
    }
}

Idle.propTypes = {
    gracePeriod: PropTypes.number.isRequired,
    element: PropTypes.object.isRequired
};

export default Idle;