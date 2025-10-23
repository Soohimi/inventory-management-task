declare module 'react-highlight-words' {
  import React from 'react';
  
  interface HighlighterProps {
    searchWords: string[];
    textToHighlight: string;
    autoEscape?: boolean;
    highlightStyle?: React.CSSProperties;
  }
  
  const Highlighter: React.FC<HighlighterProps>;
  export default Highlighter;
}
