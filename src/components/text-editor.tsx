// src/Tiptap.tsx
"use client"
import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toggle } from './ui/toggle'
import { BoldIcon, CodeIcon, HighlighterIcon, ItalicIcon, LinkIcon, ListIcon, ListOrdered, ListOrderedIcon, Quote, RedoIcon, StrikethroughIcon, Underline, UnderlineIcon, UndoIcon, UnlinkIcon } from 'lucide-react'
import Highlight from '@tiptap/extension-highlight'
import { ReactNode, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {BubbleMenu as TiptapBubbleMenu} from '@tiptap/react/menus';

const Tiptap = ({content,onChange}:{
  content?:string,
  onChange?:(content:string)=>void;
}) => {
  const editor = useEditor({
    extensions: [
         StarterKit,
         Highlight.configure({
             multicolor: true,
            }),
        ], // define your extension array
    content,
    onUpdate:({editor})=>{
      onChange?.(editor.getHTML());
    },
     editorProps: {
        attributes: {
            class:
              "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none",
        },
     },
    immediatelyRender:false,
  })

  return (
    <div className='bg-background relative rounded-lg border shadow-sm'>
    {editor && (
      <>
        <Toolbar  editor={editor} />
        <BubbleMenu editor={editor}/>
      </>
    )}
      <EditorContent editor={editor}  className='min-h-[300px] px-4 py-3' />
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
    </div>
  )
}

export default Tiptap



const Toolbar=({editor}:{editor:Editor})=>{

    const editorState=useEditorState({editor,selector:(ctx)=>{
         return{
            isBold:ctx.editor.isActive("bold") ?? false,
            isItalic:ctx.editor.isActive("italic") ?? false,
            isUnderLine:ctx.editor.isActive("underline") ?? false,
            isStrike: ctx.editor.isActive("strike") ?? false,
            isCode: ctx.editor.isActive("code") ?? false,
            isHighlight: ctx.editor.isActive("highlight") ?? false,
            isBulletList: ctx.editor.isActive("bulletList") ?? false,
            isOrderedList: ctx.editor.isActive("orderedList") ?? false,
            isBlockquote: ctx.editor.isActive("blockquote") ?? false,
            isLink:ctx.editor.isActive("link") ?? false,
            canRedo:ctx.editor.can().redo(),
            canUndo:ctx.editor.can().undo(),
            isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
            isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
            isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
            isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
            isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
            isParagraph: ctx.editor.isActive("paragraph") ?? false,
              
         }
    }});


    const handleHeadingChange=(value:string)=>{
       if(value==="paragraph"){
        editor.chain().focus().setParagraph().run();
       }else{
        const level=Number.parseInt(value.replace("heading",""))as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;

        editor.chain().focus().setHeading({level}).run()
       }
    }
  return(
    <div className={"bg-background sticky  top-0 z-10 flex flex-nowrap items-center gap-1 border-b p-2"}>
      
      <Select
         onValueChange={handleHeadingChange}
         value={
            editorState.isHeading2
            ? "heading2"
            : editorState.isHeading3
             ? "heading3"
            : editorState.isHeading4
            ? "heading4"
            : editorState.isHeading5
            ? "heading5"
            : editorState.isHeading6
            ? "heading6"
            : "paragraph"
         }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>

          <SelectContent>
           <SelectItem value="paragraph">Paragraph</SelectItem>
           <SelectItem value="heading2">Heading 1</SelectItem>
           <SelectItem value="heading3">Heading 2</SelectItem>
           <SelectItem value="heading4">Heading 3</SelectItem>
           <SelectItem value="heading5">Heading 4</SelectItem>
           <SelectItem value="heading6">Heading 5</SelectItem>
          </SelectContent>
        </Select>
      
      <Toggle size="sm" pressed={editorState.isBold} 
         onPressedChange={()=>editor.chain().focus().toggleBold().run()}
         aria-label='Toggle bold'>
          <BoldIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isItalic} 
         onPressedChange={()=>editor.chain().focus().toggleItalic().run()}
         aria-label='Toggle italic'>
          <ItalicIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isUnderLine} 
         onPressedChange={()=>editor.chain().focus().toggleUnderline().run()}
         aria-label='Toggle under line'>
          <UnderlineIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isStrike} 
         onPressedChange={()=>editor.chain().focus().toggleStrike().run()}
         aria-label='Toggle strikethrough'>
          <StrikethroughIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isHighlight} 
         onPressedChange={()=>editor.chain().focus().toggleHighlight({color:"#baa840"}).run()}
         aria-label='Toggle highlight'>
          <HighlighterIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isCode} 
         onPressedChange={()=>editor.chain().focus().toggleCode().run()}
         aria-label='Toggle code'>
          <CodeIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isBulletList} 
         onPressedChange={()=>editor.chain().focus().toggleBulletList().run()}
         aria-label='Toggle bullet list'>
          <ListIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isOrderedList}
         onPressedChange={() =>editor.chain().focus().toggleOrderedList().run()}
         aria-label="Toggle ordered list"
        >
           <ListOrderedIcon className="h-4 w-4" />
       </Toggle>



        <Toggle size="sm" pressed={editorState.isBlockquote}
            onPressedChange={() =>editor.chain().focus().toggleBlockquote().run() }
            aria-label="Toggle blockquote"
           >
             <Quote className="h-4 w-4" />
        </Toggle>


        <div  className="flex items-center border-l border-r px-1 mx-1">
          {editorState.isLink ?
          (
            <Toggle pressed 
              onPressedChange={()=>editor.chain().focus().extendMarkRange("link").unsetLink().run()}
            > 
              <UnlinkIcon className='w-4 h-4'/>
            </Toggle>
          ):(
            <LinkComponent editor={editor}>
               <Toggle size="sm"  aria-label='Toggle link'>
                   <LinkIcon className='w-4 h-4'/>
                </Toggle>
            </LinkComponent>
          )}
        </div>

          <div className='bg-border mx-1 h-6 w-px'/>

          <Button size="sm" type='button' variant="ghost" onClick={()=>editor.chain().focus().undo().run()}
             disabled={!editorState.canUndo} aria-label='Undo'
            >
             <UndoIcon className='w-4 h-4'/>
          </Button>


           <Button size="sm" type='button' variant="ghost" onClick={()=>editor.chain().focus().redo().run()}
             disabled={!editorState.canRedo} aria-label='Undo'
            >
             <RedoIcon className='w-4 h-4'/>
          </Button>
    </div>
  )
}



function LinkComponent({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();
    }

    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover
      open={isLinkPopoverOpen}
      onOpenChange={setIsLinkPopoverOpen}
    >
      <PopoverTrigger render={children as React.ReactElement} />

      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>

          <Input
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetLink();
              }
            }}
          />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLinkPopoverOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSetLink}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}




export function BubbleMenu({editor}:{editor:Editor}){

    const editorState=useEditorState({editor,selector:(ctx)=>{
         return{
            isBold:ctx.editor.isActive("bold") ?? false,
            isItalic:ctx.editor.isActive("italic") ?? false,
            isUnderLine:ctx.editor.isActive("underline") ?? false,
            isStrike: ctx.editor.isActive("strike") ?? false,
            isCode: ctx.editor.isActive("code") ?? false,
            isHighlight: ctx.editor.isActive("highlight") ?? false,
            isBulletList: ctx.editor.isActive("bulletList") ?? false,
            isOrderedList: ctx.editor.isActive("orderedList") ?? false,
            isBlockquote: ctx.editor.isActive("blockquote") ?? false,
            isLink:ctx.editor.isActive("link") ?? false,     
         }
    }});


  return(
    <TiptapBubbleMenu 
     editor={editor}
     className="bg-background flex items-center rounded-md border shadow-md relative z-200"
     >
      
      <Toggle size="sm" pressed={editorState.isBold} 
         onPressedChange={()=>editor.chain().focus().toggleBold().run()}
         aria-label='Toggle bold'>
          <BoldIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isItalic} 
         onPressedChange={()=>editor.chain().focus().toggleItalic().run()}
         aria-label='Toggle italic'>
          <ItalicIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isUnderLine} 
         onPressedChange={()=>editor.chain().focus().toggleUnderline().run()}
         aria-label='Toggle under line'>
          <UnderlineIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isStrike} 
         onPressedChange={()=>editor.chain().focus().toggleStrike().run()}
         aria-label='Toggle strikethrough'>
          <StrikethroughIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isHighlight} 
         onPressedChange={()=>editor.chain().focus().toggleHighlight({color:"#baa840"}).run()}
         aria-label='Toggle highlight'>
          <HighlighterIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isCode} 
         onPressedChange={()=>editor.chain().focus().toggleCode().run()}
         aria-label='Toggle code'>
          <CodeIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isBulletList} 
         onPressedChange={()=>editor.chain().focus().toggleBulletList().run()}
         aria-label='Toggle bullet list'>
          <ListIcon className='w-4 h-4'/>
      </Toggle>


      <Toggle size="sm" pressed={editorState.isOrderedList}
         onPressedChange={() =>editor.chain().focus().toggleOrderedList().run()}
         aria-label="Toggle ordered list"
        >
           <ListOrderedIcon className="h-4 w-4" />
       </Toggle>



        <Toggle size="sm" pressed={editorState.isBlockquote}
            onPressedChange={() =>editor.chain().focus().toggleBlockquote().run() }
            aria-label="Toggle blockquote"
           >
             <Quote className="h-4 w-4" />
        </Toggle>


        <div >
          {editorState.isLink ?
          (
            <Toggle pressed 
              onPressedChange={()=>editor.chain().focus().extendMarkRange("link").unsetLink().run()}
            > 
              <UnlinkIcon className='w-4 h-4'/>
            </Toggle>
          ):(
            <LinkComponent editor={editor}>
               <Toggle size="sm"  aria-label='Toggle link'>
                   <LinkIcon className='w-4 h-4'/>
                </Toggle>
            </LinkComponent>
          )}
        </div>
    </TiptapBubbleMenu>
  )
}

