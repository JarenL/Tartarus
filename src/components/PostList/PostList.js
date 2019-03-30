import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostListItem from './PostListItem';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';
import 'react-virtualized/styles.css';

const VirtualList = styled(List)`
  list-style: none;
  // border: 1px solid ${props => props.theme.border};
  // border-radius: 2px;
  height: 100%;
  width: 100%;
  @media (max-width: 768px) {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  height: calc(100vh - 115px);
`;

class PostList extends Component {
  constructor(props) {
    super(props);
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100
    });
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow({ index, parent, style }) {
    return (
      <CellMeasurer cache={this.cache} parent={parent} rowIndex={index}>
        <PostListItem address={this.props.posts[index].args.postAddress} />
      </CellMeasurer>
    );
  }

  render() {
    return (
      <Wrapper>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <VirtualList
                width={width}
                height={height}
                deferredMeasurementCache={this.cache}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.renderRow}
                rowCount={this.props.posts.length}
                overscanRowCount={3}
              />
            );
          }}
        </AutoSizer>
      </Wrapper>
    );
  }
}

export default PostList;
