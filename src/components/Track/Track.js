import React from 'react';
import "./Track.css"

class Track extends React.Component {
  constructor(props){
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }
  renderAction (){
    if (this.props.isRemoval){
      return (
        <a className="Track-action"
          id={this.props.track.key}
          onClick={this.removeTrack}>-</a>
      )
    } else {
      return (
        <a className="Track-action"
          id={this.props.track.key}
          onClick={this.addTrack}>+</a>
      )
    }
  }

  addTrack(){
    this.props.onAdd(this.props.track);
  }
  removeTrack(){
    this.props.onRemove(this.props.track);
  }

  render (){
    return (
      <div className="Track">
        <div className="Track-information">
          <div className="image-container">
            <img src={this.props.track.cover} alt=''/>
          </div>
          <div className="track-info-text">
            <h3>{this.props.track.name}</h3>
            <p>{this.props.track.artist} | {this.props.track.album}</p>
          </div>
        </div>
          {this.renderAction()}
      </div>
    );
  }
}

export default Track;
