/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class InfoBox extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 1, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      }),
      animate.fromTo(this.container, 2, {
        y: 20
      }, {
        ...opt,
        ease: Expo.easeOut,
        y: 0
      })
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 1, {
        ...opt,
        autoAlpha: 0
      }),
      animate.to(this.container, 2, {
        ...opt,
        ease: Expo.easeOut,
        y: 20
      })
    ]);
  }

  render () {
    const classes = classnames({
      'InfoBox': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
       <div className="Name">
        { this.props.selected.name }
        </div>
        <div className="Coordinates">
          {this.props.selected.data.position["x"]}
          , &nbsp;
          {this.props.selected.data.position["y"]}
          ,	&nbsp;
          {this.props.selected.data.position["z"]}
        </div>
        <div className="Description">
          {this.props.selected.data.description}
        </div>
      </div>
    );
  }
}

InfoBox.defaultProps = {
  text: ''
};

module.exports = InfoBox;
