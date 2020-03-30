import About from './About';
import { connect } from 'react-redux';
import { compose } from 'redux';

const mapStateToProps = state => ({
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(connect(mapStateToProps));

const AboutContainer = enhance(About);

export default AboutContainer;
