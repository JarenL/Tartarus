import * as React from "react";
import ReactMde, { ReactMdeTypes } from "react-mde";
import * as Showdown from "showdown";

export default class MarkdownTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "hello world"
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
  }

  handleValueChange = (value) => {
		this.props.handleChange(value)
  };

  render() {
    return (
      <ReactMde
        onChange={this.handleValueChange}
        placeholder={"Text..."}
        generateMarkdownPreview={markdown =>
          Promise.resolve(this.converter.makeHtml(markdown))
        }
      />
    );
  }
}
