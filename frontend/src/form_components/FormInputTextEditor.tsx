import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { FormHelperText } from '@mui/material'

// Represents the conversion of HTML from the draft editor
let html = ""; // Variable to store the converted HTML

type Props = {
  onChange: (val: string) => void; // A function to be called when the content changes
  content: string; // Initial content in HTML format
  formSubmitted: boolean;
}

type State = {
  editorState: EditorState; // The state for the WYSIWYG editor
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
    // When the component mounts, convert the provided HTML content to EditorState
    this.setState({
      editorState: this.convertHTMLtoEditorState(this.props.content),
    })
  }

  // Convert HTML content to EditorState
  convertHTMLtoEditorState(html: string): EditorState {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  }

  // Called when there is a change on the draft editor, mainly to edit the converted HTML contents
  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });

    // Convert the current EditorState content to HTML and pass it to the parent component
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

        {/* Uncomment below to show HTML conversion while typing */}
        {/* <div>
          <h4>Description Converted to HTML</h4>
          {html}
        </div> */}
        <div>
        {this.props.formSubmitted && this.props.content === "" && (
          <FormHelperText style={{color: "red"}}>Required</FormHelperText>
        )}
        </div>

        <br></br>
      </React.Fragment>
    )
  }
}

export default FormInputTextEditor;
