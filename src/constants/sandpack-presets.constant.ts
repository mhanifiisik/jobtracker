export const SANDPACK_PRESETS = [
  {
    label: 'React',
    name: 'react',
    meta: 'live react',
    sandpackTemplate: 'react',
    sandpackTheme: 'auto',
    snippetFileName: '/App.jsx',
    snippetLanguage: 'jsx',
    initialSnippetContent: `export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
  },
  {
    label: 'React TypeScript',
    name: 'react-ts',
    meta: 'live react-ts',
    sandpackTemplate: 'react-ts',
    sandpackTheme: 'auto',
    snippetFileName: '/App.tsx',
    snippetLanguage: 'tsx',
    initialSnippetContent: `import React from 'react';

interface AppProps {
  title?: string;
}

export default function App({ title = 'Hello World' }: AppProps) {
  return (
    <div className="App">
      <h1>{title}</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
  },
  {
    label: 'Python',
    name: 'python',
    meta: 'live python',
    sandpackTemplate: 'vanilla',
    sandpackTheme: 'auto',
    snippetFileName: '/main.py',
    snippetLanguage: 'python',
    initialSnippetContent: `def main():
    print("Hello from Python!")

if __name__ == "__main__":
    main()`,
  },
  {
    label: 'Vanilla JS',
    name: 'vanilla',
    meta: 'live js',
    sandpackTemplate: 'vanilla',
    sandpackTheme: 'auto',
    snippetFileName: '/index.js',
    snippetLanguage: 'js',
    initialSnippetContent: `document.getElementById("app").innerHTML = \`
<h1>Hello Vanilla!</h1>
<div>
  This is a simple vanilla JS sandbox.
</div>
\`;`,
  },
];
