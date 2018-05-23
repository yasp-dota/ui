import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { List } from 'react-content-loader';
import TabBar from '../TabBar';
import { getMatch } from '../../actions';
import MatchHeader from './MatchHeader';
import matchPages from './matchPages';
import FourOhFour from '../../components/FourOhFour';
import FlatButton from 'material-ui/FlatButton';

class RequestLayer extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    matchData: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({
        info: PropTypes.string,
      }),
    }),
    user: PropTypes.shape({}),
    getMatch: PropTypes.func,
    matchId: PropTypes.string,
    strings: PropTypes.shape({}),
  }

  componentDidMount() {
    this.props.getMatch(this.props.matchId);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.matchId !== nextProps.matchId) {
      this.props.getMatch(nextProps.matchId);
    }
  }

  render() {
    const {
      loading, matchId, matchData, error, strings,
    } = this.props;
    const info = this.props.match.params.info || 'overview';
    const page = matchPages(matchId).find(_page => _page.key.toLowerCase() === info);
    const pageTitle = page ? `${matchId} - ${page.name}` : matchId;
	const weirdOnes = ["overview", "fantasy", "analysis", "graphs", "chat", "cosmetics", "log", "story"];
    if (error) {
      return <FourOhFour msg={strings.request_invalid_match_id} />;
    }
    return loading ? <List primaryColor="#666" width={250} height={120} /> :
      (
        <div>
          <Helmet title={pageTitle} />
          <MatchHeader
            match={matchData}
            user={this.props.user}
          />
          <TabBar
            info={info}
            tabs={matchPages(matchId, matchData)}
            match={matchData}
          />
		  <h1> <FlatButton
          label={`Improve your ${weirdOnes.indexOf(info)==-1? info : "game"}`}
          icon={<img src="/assets/images/rivalry-icon.png" alt="" height="24px" />}
          href="https://glhf.rivalry.gg/get-started-dota/?utm_source=opendota&utm_medium=link&utm_campaign=opendota"
          target="_blank"
          rel="noopener noreferrer"
        /></h1>
          {page && page.content(matchData)}
        </div>);
  }
}

const mapStateToProps = state => ({
  matchData: state.app.match.data,
  loading: state.app.match.loading,
  error: state.app.match.error,
  user: state.app.metadata.data.user,
  strings: state.app.strings,
});

const mapDispatchToProps = dispatch => ({
  getMatch: matchId => dispatch(getMatch(matchId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
