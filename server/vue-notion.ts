import { makeBlockRenderer, RichTextObjects, UnknownBlocks } from "./notion"
import { get as callbackGet } from "https";
import sharp from 'sharp'
import { Stream } from "stream";
import { readdir, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import { join } from "path";
import { IncomingMessage } from "http";

async function get(url: string) {
    return new Promise<IncomingMessage>((resolve, reject) => {
        callbackGet(url, (res) => {
            resolve(res)
        }).on('error', (err) => {
            reject(err)
        })
    })
}

type VueRichTextType<Type extends string, Value extends Record<string, unknown>> = {
    type: Type,
    value: Value
    annotations: {
        bold: boolean,
        italic: boolean,
        strikethrough: boolean,
        underline: boolean,
        code: boolean,
        color: string
    }
}
export type VueRichText = (VueRichTextType<'text', {content: string}>)[]
type VueBlockGeneric<Component extends string, Data> = {
    component: Component
    data: Data
}

export type Heading1Data = {rich_text: VueRichText}
export type ParagraphData = {rich_text: VueRichText}
export type ImageData = {url: Record<string, string>}
export type VueBlock =
    | VueBlockGeneric<"Heading1", Heading1Data>
    | VueBlockGeneric<"Paragraph", ParagraphData>
    | VueBlockGeneric<"Image", ImageData>
export type VueBlocks = VueBlock[]

function renderVueRichText(rich_text: RichTextObjects): VueRichText {
    return rich_text.map((part) => ({
        type: part.type,
        value: {content: part[part.type].content },
        annotations: {
            bold: part.annotations.bold,
            italic: part.annotations.italic,
            strikethrough: part.annotations.strikethrough,
            underline: part.annotations.underline,
            code: part.annotations.code,
            color: part.annotations.color,
        }
    }))
}

export const renderVueBlocks = async (blocks: UnknownBlocks, assetDirectory: string, urlPrefix: string) => {
    await removeFiles(assetDirectory)
    const promises: Promise<unknown>[] = []
    const rendered = makeBlockRenderer<VueBlock>({
        "heading_1": (block) => ({ component: "Heading1", data: { rich_text: renderVueRichText(block.heading_1.rich_text) } }),
        "paragraph": (block) => ({ component: "Paragraph", data: { rich_text: renderVueRichText(block.paragraph.rich_text) } }),
        "image": (block) => {
            const url = block.image.type == 'external' ? block.image.external.url : block.image.file.url
            const {names, saving} = saveImageWithVariants(url, assetDirectory)
            promises.push(saving)
            return {
                component: "Image",
                data: {
                    url: Object.keys(names).reduce((all, size) => ({
                        ...all,
                        [size]: urlPrefix + names[size as any]
                    }), {})
                }
            }
        },
    })(blocks)
    await Promise.all(promises)
    console.log('assetdir', assetDirectory)
    console.log('ls', await readdir(assetDirectory))
    return rendered
}

async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise < Buffer > ((resolve, reject) => {
        const _buf = Array < any > ();
        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
}

// remove all files in the directory and its subdirectories
async function removeFiles(dir: string) {
    const files = await readdir(dir)
    for (const file of files.filter(file => file != '.gitkeep')) {
        const filePath = join(dir, file)
        await unlink(filePath)
    }
}

function saveImageWithVariants(url: string, assetDirectory: string) {
    // Setup parameters
    const id = randomUUID()
    const imagename = (size: number | 'original') => `${id}.${size}.jpg`
    const imagepath = (size: number | 'original') => join(assetDirectory, imagename(size))
    const variants = [
        500
    ]

    const saving = get(url).then(async res => {
        const image = sharp(await stream2buffer(res))

        // Save the original image
        image.clone().toFile(imagepath('original'))

        // Save the variants
        await Promise.all(variants.map(size => image.clone().resize({ width: size, height: size, fit: 'outside' }).toFile(imagepath(size))))
    })

    const names = variants.reduce((variants, size) => ({
        ...variants,
        [size]: imagename(size)
    }), {
        original: imagename('original')
    } as Record<number | 'original', string>)

    return {
        names,
        saving
    }
}
