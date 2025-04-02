import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, linkPlugin, linkDialogPlugin, imagePlugin, tablePlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, BlockTypeSelect, CreateLink, InsertImage, InsertTable, ListsToggle, CodeToggle, Separator } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface MDXEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function MDXEditorComponent({ content, onChange, className }: MDXEditorProps) {
  return (
    <div className={className}>
      <MDXEditor
        markdown={content}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <Separator />
                <ListsToggle />
                <CodeToggle />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}