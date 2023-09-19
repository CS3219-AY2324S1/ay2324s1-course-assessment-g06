import * as React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

type Props = {
  onChange: (val: string) => void;
  content: string;
  classes: {
    editorWrapper: string;
    editor: string;
    editorLinkPopup: string;
  };
}

type State = {
  editorState: EditorState
}

class FormInputTextEditor extends React.Component<Props, State> {
  static defaultProps = {}

  state: State = {
    editorState: EditorState.createEmpty(),
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      editorState: this.convertHTMLtoEditorState(this.props.content),
    })
  }

  convertHTMLtoEditorState(html: string): EditorState {
    const contentBlock = htmlToDraft(html)

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      return editorState
    }

    return EditorState.createEmpty()
  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        wrapperClassName={classes.editorWrapper}
        editorClassName={classes.editor}
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
    )
  }
}

export default FormInputTextEditor;

