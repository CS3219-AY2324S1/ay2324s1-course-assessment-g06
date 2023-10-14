import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { FormHelperText } from '@mui/material'

let html = "";

type Props = {
  onChange: (val: string) => void;
  content: string;
  formSubmitted: boolean;
}

type State = {
  editorState: EditorState;
}

class FormInputTextEditor extends React.Component<Props, State> {
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

    html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    this.props.onChange(html);
  };

  render() {
    const { editorState } = this.state;
    
    return (
      <div style={{ maxWidth: '956px' }}> 
        <div>
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            editorStyle={{ border: "1px solid rgb(237, 240, 245)", padding: "10px" }}
            stripPastedStyles={true}
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
        <div>
          {this.props.formSubmitted && this.props.content === "" && (
            <FormHelperText style={{ color: "#d32f2f", paddingLeft: "16px" }}>Required</FormHelperText>
          )}
        </div>
        <br></br>
      </div>
    )
  }
}

export default FormInputTextEditor;
