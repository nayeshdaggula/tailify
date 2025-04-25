'use client'
import React, { useRef, ChangeEvent } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconCornerUpLeft, IconCornerUpRight, IconBold, IconItalic, IconLink, IconPhotoScan, IconStrikethrough, IconUnderline, IconUnlink } from '@tabler/icons-react'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Imageresizer from './Imageresizer.tsx'

interface MenuBarProps {
    editor: Editor | null
    onImageUploadClick: () => void
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, onImageUploadClick }) => {
    const setLink = () => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        try {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        } catch (e) {
            alert('Invalid URL')
        }
    }

    if (!editor) return null

    return (
        <div className='sticky top-0 bg-white rounded-t-md shadow-sm border-b border-gray-100 z-10 py-[0.5rem] min-h-[44px]'>
            <div className='flex flex-row items-center flex-wrap justify-between max-w-3xl mx-auto'>
                <div className='flex flex-row flex-wrap items-center space-x-2'>
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpLeft /></button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpRight /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded-md ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><IconBold /></button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded-md ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><IconItalic /></button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded-md ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><IconUnderline /></button>
                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-1 rounded-md ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}><IconStrikethrough /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}><IconAlignLeft /></button>
                    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}><IconAlignCenter /></button>
                    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}><IconAlignRight /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={setLink} className={`px-2 py-1 rounded-md ${editor.isActive('link') ? 'bg-gray-200' : ''}`}><IconLink /></button>
                    <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className={`px-2 py-1 rounded-md`}><IconUnlink /></button>
                    <button onClick={onImageUploadClick} className='px-2 py-1 rounded-md'><IconPhotoScan /></button>
                </div>
            </div>
        </div>
    )
}

type RichtexteditorProps = {
    onChange?: (value: string) => void
    value?: string
}

const Richtexteditor: React.FC<RichtexteditorProps> = ({
    onChange,
    value,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const editor = useEditor({
        extensions: [
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
                        if (!ctx.defaultValidate(parsedUrl.href)) return false
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')
                        if (disallowedProtocols.includes(protocol)) return false
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))
                        if (!allowedProtocols.includes(protocol)) return false
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname
                        if (disallowedDomains.includes(domain)) return false
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: (url) => {
                    try {
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        return !disallowedDomains.includes(parsedUrl.hostname)
                    } catch {
                        return false
                    }
                },
            }),
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Imageresizer
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
            handleDrop(_view, event, _slice) {
                const file = event.dataTransfer?.files?.[0]
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader()
                    reader.onload = () => {
                        editor?.chain().focus().setImage({ src: reader.result as string }).run()
                    }
                    reader.readAsDataURL(file)
                    return true
                }
                return false
            },
        },
    })

    const handleImageUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
                editor?.chain().focus().setImage({ src: reader.result as string }).run()
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditorChange = () => {
        if (onChange) {
            onChange(editor?.getHTML() || '')
        }
    }
    editor?.on('update', handleEditorChange)

    return (
        <div className="w-full border border-gray-300 rounded-md shadow-sm">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <MenuBar editor={editor} onImageUploadClick={handleImageUploadClick} />
            <EditorContent editor={editor} className="prose prose-sm p-4 focus:outline-none" />
        </div>
    )
}

export { Richtexteditor }