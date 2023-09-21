import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// Represents the conversion of HTML from draft editor
let html = ""

type Props = {
  onChange: (val: string) => void;
  content: string;
}

type State = {
  editorState: EditorState
}

class FormInputTextEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  // Ensure component mounted on DOM
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

  // Called when there is a change on the draft editor, to mainly edit the converted html contents
  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });
    html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    this.props.onChange(html);
  };

  render() {
    const { editorState } = this.state;
    
    return (
      <React.Fragment>
        <div>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          editorStyle= {{border: "1px solid rgb(237, 240, 245)",}}
          stripPastedStyles= {true}
          placeholder='Enter description here'
          toolbar={{
            options: [
              'inline', 
              'list', 
              'textAlign', 
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

        {/* Uncomment below to show html conversion while typing */}
        {/* <div>
          <h4>Description Converted to HTML</h4>
          {html}
        </div> */}

        <br></br>
      </React.Fragment>
    )
  }
}

export default FormInputTextEditor;
