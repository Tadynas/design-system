//MARKDOWN FUNCTIONS

export const replaceText = (markdownName, textToChange) => {
  let editedText;

  switch (markdownName) {
    case 'Strikethrough':
      editedText = `~~${textToChange}~~`;
      break;
    case 'Bold':
      editedText = `**${textToChange}**`;
      break;
    case 'Italic':
      editedText = `_${textToChange}_`;
      break;
    case 'Underline':
      editedText = `<u>${textToChange}</u>`;
      break;
    case 'Code':
      editedText = `\`\`\`${textToChange}\`\`\``;
      break;
    case 'Link':
      editedText = `[${textToChange}](link)`;
      break;
    case 'Quote':
      editedText = `>${textToChange}`;
      break;
    default:
      editedText = textToChange;
  }
  return editedText
};

export const insertText = (markdownName) => {
  let editedText;
  //object to calculate text that will be selected after insert of markdown
  let selection = {start: markdownName.length, end: 0}

  switch (markdownName) {
    case 'Strikethrough':
      editedText = `~~${markdownName}~~`;
      selection.end = 2;
      break;
    case 'Bold':
      editedText = `**${markdownName}**`;
      selection.end = 2;
      break;
    case 'Italic':
      editedText = `_${markdownName}_`;
      selection.end = 1;
      break;
    case 'alt':
      editedText = `[${markdownName}]()`;
      selection.end = 3;
      break;
    case 'Underline':
      editedText = `<u>${markdownName}</u>`;
      selection.end = 4;
      break;
    case 'Code':
      editedText = `\`\`\`${markdownName}\`\`\``;
      selection.end = 3;
      break;
    case 'Link':
      editedText = `[${markdownName}](link)`;
      selection.end = 7;
      break;
    case 'Quote':
      editedText = `>${markdownName}`;
      selection.end = 0;
      break;
    default:
      editedText = '';
  }
  return {editedText, selection}
};

export const insertListOrTitle = (markdown, lineContent) => {
  let textToInsert;

  switch(markdown) {
    case "BulletList":
      textToInsert = '- ';
      break;
    case "NumberList":
      textToInsert = '1. ';
      break;
    case "h1":
      textToInsert = '# ';
      break;
    case "h2":
      textToInsert = '## ';
      break;
    case "h3":
      textToInsert = '### ';
      break;
    case "h4":
      textToInsert = '#### ';
      break;
    case "h5":
      textToInsert = '##### ';
      break;
    case "h6":
      textToInsert = '###### ';
      break;
    default:
      return;
  }
  
  return textToInsert;
};

//EDITOR ACTIONS FUNCTIONS

const markdownWithTextToEdit = (editor, markdownType, textToEdit, isContent, line) => {
  const editedText = replaceText(markdownType, textToEdit);

  //if Code or Quote + content in current line : go to next line before inserting markdown text
  if((markdownType === "Code" || markdownType === "Quote") && isContent) {
    line++;
    editor.current.replaceSelection('');
    editor.current.focus();
    editor.current.replaceRange("\n", { line, ch: 0 });
  }

  editor.current.replaceSelection(editedText);
  editor.current.focus();
};

const markdownWithoutTextToEdit = (editor, markdownType, isContent, line) => {
  let textToInsert = insertText(markdownType);
  
  //if Code or Quote + content in current line : go to next line before inserting markdown text
  if((markdownType === "Code" || markdownType === "Quote") && isContent) {
    line++;
    editor.current.replaceRange("\n", { line, ch: 0 });
  }
  
  editor.current.replaceSelection(textToInsert.editedText);
  editor.current.focus();

  //set selection-focus to text to replace with content
  let { ch } = editor.current.getCursor();
  const endSelection = ch - textToInsert.selection.end;
  const startSelection = ch - textToInsert.selection.end - textToInsert.selection.start;

  editor.current.setSelection(
    { line, ch: startSelection },
    { line, ch: endSelection }
  );
};

export const markdownHandler = (editor, markdownType) => {
  const textToEdit = editor.current.getSelection();
  let { line } = editor.current.getCursor();
  const isContent = editor.current.getValue(line).length > textToEdit.length;

  if (textToEdit) {
    markdownWithTextToEdit(editor, markdownType, textToEdit, isContent, line);
  } else {
    markdownWithoutTextToEdit(editor, markdownType, isContent, line);
  }
};

export const listHandler = (editor, listType) => {
  let {line : currentLine} = editor.current.getCursor();
  const listToInsert = insertListOrTitle(listType);
  const lineContent = editor.current.getLine(currentLine);

  const textToInsert = listToInsert + lineContent;
  editor.current.setSelection(
    { line: currentLine, ch: 0 },
    { line: currentLine, ch: lineContent.length }
  );
  editor.current.replaceSelection(textToInsert);
  editor.current.focus();
};

export const titleHandler = (editor, titleType) => {
  let {line : currentLine} = editor.current.getCursor();
  const titleToInsert = insertListOrTitle(titleType);
  const lineContent = editor.current.getLine(currentLine);

  // replace hashtags followed by a space in case user want to change the type of title
  const lineWithNoTitle = lineContent.replace(/#{1,6}\s/g, '').trim();

  const textToInsert = titleToInsert + lineWithNoTitle;
  editor.current.setSelection(
    { line: currentLine, ch: 0 },
    { line: currentLine, ch: lineContent.length }
  );
  editor.current.replaceSelection(textToInsert);
  setTimeout(() => editor.current.focus(), 0);
}

export const insertImage = (editor, files) => {
  let {line, ch} = editor.current.getCursor();

  files.forEach((file, i) => {
    //create a new line after first image markdown inserted
    //or if there is content in current line
    if(i > 0 || (i === 0 && ch !== 0)) {
      line++
      editor.current.replaceRange("\n", { line, ch: 0 });
    }
    editor.current.replaceSelection(`[${file.alt}](${file.url})`);
  });

  setTimeout(() => editor.current.focus(), 0);
}