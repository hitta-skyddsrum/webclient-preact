import { Component } from 'preact';
import { route } from 'preact-router';

export default class Redirect extends Component {
  componentWillMount() {
    route(
      '/'.concat(this.props.to.replace(
        new RegExp(
          Object.keys(this.props.matches)
            .map(match => ':'.concat(match))
            .join('|'),
          'g'
        ),
        match => this.props.matches[match.replace(':', '')])),
      true
    );
  }

  render() {
    return null;
  }
}
