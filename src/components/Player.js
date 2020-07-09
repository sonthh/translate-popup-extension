import React, { Component } from 'react';
import soundImage from '../icons/sound.png'

class Player extends Component {

  state = {
    play: false
  }

  audio = null;

  componentDidUpdate(prevProps, prevState) {
    const { url } = this.props;

    if (url && url !== prevProps.url) {
      this.audio = new Audio(this.props.url)
      this.audio.addEventListener('ended', () => this.setState({ play: false }));
      this.audio.removeEventListener('ended', () => this.setState({ play: false }));
    }
  }

  componentDidMount() {
    this.audio = new Audio(this.props.url)
    this.audio.addEventListener('ended', () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.removeEventListener('ended', () => this.setState({ play: false }));
  }

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  }

  render() {
    return (
      <img className='sound-icon' onClick={this.togglePlay} src={soundImage} alt='' />
    );
  }
}

export default Player;