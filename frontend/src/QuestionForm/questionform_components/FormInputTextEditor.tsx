import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import {stateToHTML} from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

type Props = {
  onChange: (val: string) => void;
  content: string;
}

type State = {
  editorState: EditorState
}

class FormInputTextEditor extends React.Component<Props, State> {
  // static defaultProps = {}
  constructor(props: Props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.setState({
      editorState: this.convertHTMLtoEditorState(this.props.content),
    })
  }

  convertHTMLtoEditorState(html: string): EditorState {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });
    const html = stateToHTML(editorState.getCurrentContent());
    this.props.onChange(html); // Update the parent component's state with the HTML content
  };

  render() {
    const { editorState } = this.state;
    const html = stateToHTML(editorState.getCurrentContent())
    
    return (
      <React.Fragment>
        <div>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          editorStyle= {{border: "1px solid rgb(237, 240, 245)",}}
          // Brings about opposite problem, window width too small other components will protrude to at least 500px
          // borderRadius: '4px',maxWidth: '500px',
          // wordWrap: 'break-word'}} 
          toolbar={{
            options: [
              'inline', 
              'list', 
              'textAlign', 
              'fontFamily',
              // Link and image buttons event not set up yet
              'link',
              'image',
              'history'
            ],
            list: {
              options: ['unordered', 'ordered'],
            },
          }}
        />
        </div>

        <div>
          <h4>Description Converted to HTML</h4>
          {html}
        </div>

        <br></br>
      </React.Fragment>
    )
  }
}

export default FormInputTextEditor;
