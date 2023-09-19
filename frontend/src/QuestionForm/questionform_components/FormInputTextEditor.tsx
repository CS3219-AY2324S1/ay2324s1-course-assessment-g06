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

const stylesheet = {
  editorWrapper: {
    marginTop: '1rem',
  },
  editor: {
    border: '1px solid #f1f1f1',
    height: '500px',
    padding: '1rem',
    overflow: 'scroll',
  },
  editorLinkPopup: {
    height: 'auto',
  },
  editorImagePopup: {
    left: '-100%',
  },
}

class FormInputTextEditor extends React.Component<Props, State> {
  // static defaultProps = {}
  constructor(props: Props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  componentDidMount() {
    this.setState({
      editorState: this.convertHTMLtoEditorState(this.props.content),
    })
  }

  convertHTMLtoEditorState(html: string): EditorState {
    const contentBlock = htmlToDraft(html)
    return EditorState.createEmpty()
  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state;
    const html = stateToHTML(this.state.editorState.getCurrentContent());
    
    return (
      <React.Fragment>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: [
              'inline', 
              'list', 
              'textAlign', 
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

        <div>
        <textarea 
          disabled
          value={stateToHTML(editorState.getCurrentContent())}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default FormInputTextEditor;
