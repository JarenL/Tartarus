import * as React from "react";
import ReactMde, { ReactMdeTypes } from "react-mde";
import * as Showdown from "showdown";

export interface ReactMdeDemoState {
  mdeState: ReactMdeTypes.MdeState;
}

export class ReactMdeDemo extends React.Component<{}, ReactMdeDemoState> {
  converter: Showdown.Converter;

  constructor(props) {
    super(props);
    this.state = {
      value: "hello world"
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  handleValueChange = (value: ReactMdeTypes.MdeState) => {
		// this.setState({ value });
		this.props.handleChange(value)
  };

  render() {
    return (
      <ReactMde
				onChange={this.handleValueChange}
				minEditorHeight="125px"
        // value={this.state.value}
        generateMarkdownPreview={markdown =>
          Promise.resolve(this.converter.makeHtml(markdown))
        }
      />
    );
  }
}
