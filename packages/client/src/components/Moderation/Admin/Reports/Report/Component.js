import React from 'react';
import styled from 'styled-components/macro';
import UpButton from '../../../../Buttons/UpButton';
import DownButton from '../../../../Buttons/DownButton';
import { Link } from 'react-router-dom';
import Empty from '../../../../shared/Empty';
import moment from 'moment';
import TartarusContract from '../../../../../contracts/Tartarus.json';
import PostContainer from '../../../../Post/Post/Container';
import CommentContainer from '../../../../Comment/Comment/Container';
import LoadingIndicatorSpinner from '../../../../shared/LoadingIndicator/Spinner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const ReasonWrapper = styled.div`
  // margin: 8px -8px;
  overflow-wrap: break-word;
  border-left: none;
  padding: 8px;
  // paddingt: 8px;
  font-size: 12px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const ReportWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const PostWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  width: 100%;
  // margin-bottom: 8px;
  // margin: 6px;
`;

const CommentWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  // margin-bottom: 8px;
  width: 100%;
`;

const services = require('../../../../../services');

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      reason: null,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract = async () => {
    const bs58 = require('bs58');
    const reasonHex = '1220' + this.props.event.args.reason.slice(2);
    const reasonBytes32 = Buffer.from(reasonHex, 'hex');
    const reasonIpfsHash = bs58.encode(reasonBytes32);
    let reasonData = await services.ipfs.getJson(reasonIpfsHash);
    console.log(reasonData);
    this.setState({
      loading: false,
      reason: reasonData.reason
    });
  };

  toggleShowDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  handleBan = () => {
    // const contract = require('truffle-contract');
    // const tartarus = contract(TartarusContract);
    // tartarus.setProvider(this.props.web3.currentProvider);
    // this.props.web3.eth.getAccounts((error, accounts) => {
    //   tartarus.at(this.props.event.address).then(instance => {
    //     console.log(this.state);
    //     console.log(this.props);
    //     instance.moderatorBan
    //       .sendTransaction(
    //         this.props.web3.utils.fromAscii(this.props.username),
    //         this.state.comment === null
    //           ? this.state.post.args.creator
    //           : this.state.comment.args.creator,
    //         this.state.comment === null
    //           ? this.props.event.args.forum
    //           : this.props.event.args.forum,
    //         {
    //           from: accounts[0],
    //           gasPrice: 20000000000
    //         }
    //       )
    //       .then(result => {
    //         console.log(result);
    //         this.setState({
    //           reportLoading: false
    //         });
    //         this.props.reset('report');
    //       })
    //       .catch(error => {
    //         console.log('error');
    //         this.setState({
    //           reportLoading: false
    //         });
    //       });
    //   });
    // });
  };

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <Wrapper>
        <ReportWrapper>
          <div>
            <StyledLink to={`/u/${this.props.event.args.user}`}></StyledLink>{' '}
            {' submitted a report '}
            {` ${moment(this.props.event.args.time.c[0] * 1000).fromNow()}`}
          </div>
          {this.state.showDetails ? (
            <ButtonWrapper>
              {/* <BanButton size={18} onClick={() => this.handleBan()} /> */}
              <UpButton size={18} onClick={() => this.toggleShowDetails()} />
            </ButtonWrapper>
          ) : (
            <ButtonWrapper>
              <DownButton size={18} onClick={() => this.toggleShowDetails()} />
            </ButtonWrapper>
          )}
        </ReportWrapper>
        {this.state.showDetails ? (
          <ReasonWrapper>{this.state.reason}</ReasonWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

export default Report;
