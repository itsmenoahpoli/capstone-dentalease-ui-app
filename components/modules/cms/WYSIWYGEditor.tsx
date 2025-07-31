"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Card, Flex, Button } from "@radix-ui/themes";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <Card style={{ borderBottom: "1px solid #e2e8f0", borderRadius: "0" }}>
      <Flex gap="1" p="2" wrap="wrap">
        <Button
          size="1"
          variant={editor.isActive("bold") ? "solid" : "soft"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("italic") ? "solid" : "soft"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("heading", { level: 1 }) ? "solid" : "soft"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("heading", { level: 2 }) ? "solid" : "soft"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("heading", { level: 3 }) ? "solid" : "soft"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("bulletList") ? "solid" : "soft"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("orderedList") ? "solid" : "soft"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive("blockquote") ? "solid" : "soft"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive({ textAlign: "left" }) ? "solid" : "soft"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive({ textAlign: "center" }) ? "solid" : "soft"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size="14" />
        </Button>
        <Button
          size="1"
          variant={editor.isActive({ textAlign: "right" }) ? "solid" : "soft"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size="14" />
        </Button>
      </Flex>
    </Card>
  );
};

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!isMounted) {
    return (
      <Card>
        <div style={{ padding: "12px", minHeight: "200px" }}>
          <div
            style={{
              minHeight: "200px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              padding: "12px",
              color: "#9ca3af",
            }}
          >
            {placeholder || "Loading editor..."}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <MenuBar editor={editor} />
      <div style={{ padding: "12px", minHeight: "200px" }}>
        <EditorContent
          editor={editor}
          style={{
            minHeight: "200px",
            border: "none",
            outline: "none",
          }}
        />
        {!editor?.getHTML() && placeholder && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "12px",
              color: "#9ca3af",
              pointerEvents: "none",
              fontSize: "14px",
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </Card>
  );
};
