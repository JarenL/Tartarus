import React from 'react';
import styled from 'styled-components/macro';
import NavLink from '../../shared/NavLink';
import CloseButton from '../Buttons/CloseButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Item = styled(NavLink)`
  padding: 12px;
  font-size: 15px;
  text-decoration: none;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.theme.normalText};
  ::after {
    left: -1px;
    top: 0;
    bottom: 0;
    border-left: 3px solid ${props => props.theme.accent};
  }
`;

const ButtonWrapper = styled.div`
  padding-top: 13.5px;
  padding-bottom: 13.5px;
  padding-left: 6px;
  padding-right: 6px;
  display: flex;
  height: 100%;
  background-color: ${props => props.theme.accent};
`;

const SubscriptionItem = props => {
  const isAll = props.forumName === 'all';
  console.log(props);
  return (
    <Wrapper>
      <Item exact={isAll} to={isAll ? '/' : `/f/${props.forumName}`}>
        {props.forumName}
      </Item>
      {props.editSubscriptions && (
        <ButtonWrapper>
          <CloseButton
            size={16}
            onClick={() => props.handleRemoveSubscription(props.address)}
          />
        </ButtonWrapper>
      )}
    </Wrapper>
  );
};

export default SubscriptionItem;
