import React from 'react';
import PropTypes from 'prop-types';
import IdleService from './Idle.service';
import { activityEvents } from './utils/consts';

class Idle extends React.Component {
    constructor (props) {
        super(props);
        this.idleService = new IdleService(this.props.gracePeriod);
        this.onActive = this.onActive.bind(this);
    }

    onActive() {
        this.idleService.registerActivity();
        typeof this.props.onActive === 'function' && this.props.onActive();
    }

    componentDidMount() {
        const { timeRemaining } = this.idleService;
        this.idleService.registerActivity();
        activityEvents.forEach(event => this.props.element.addEventListener(event, this.onActive));

        this.activeInterval = this.props.active !== false
            ? setInterval(() => {
                if (timeRemaining() <= 0) {
                    typeof this.props.onIdle === 'function' && this.props.onIdle();
                }
            }, 1000)
            : null;
    }

    componentWillUnmount() {
        clearInterval(this.activeInterval);
        activityEvents.forEach(event => this.props.element.removeEventListener(event, this.onActive));
    }

    render() {
        return null;
    }
}

Idle.propTypes = {
    gracePeriod: PropTypes.number.isRequired,
    element: PropTypes.object.isRequired
};

export default Idle;