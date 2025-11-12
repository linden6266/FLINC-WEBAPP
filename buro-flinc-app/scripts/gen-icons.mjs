import { mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = join(__dirname, '..')
const publicDir = join(root, 'public')
const srcSvg = join(publicDir, 'favicon.svg')
const outDir = join(publicDir, 'icons')

if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
}

async function generateIcon(size, outPath, opts = { background: { r: 255, g: 255, b: 255, alpha: 0 } }) {
    const paddingRatio = 0.12 // add some safe-area padding
    const inner = Math.round(size * (1 - paddingRatio))
    const pad = Math.round((size - inner) / 2)

    const svgBuffer = sharp(srcSvg, { density: Math.max(384, size * 2) })
    const resized = await svgBuffer
        .resize(inner, inner, { fit: 'contain' })
        .png()
        .toBuffer()

    await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: opts.background,
        },
    })
        .composite([{ input: resized, left: pad, top: pad }])
        .png()
        .toFile(outPath)
}

async function main() {
    const tasks = []
    // Standard PWA icons
    tasks.push(generateIcon(192, join(outDir, 'icon-192.png')))
    tasks.push(generateIcon(512, join(outDir, 'icon-512.png')))
    // iOS touch icon prefers opaque background
    tasks.push(
        generateIcon(180, join(outDir, 'apple-touch-icon-180.png'), {
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        }),
    )
    await Promise.all(tasks)
    console.log('✅ Icons generated in /public/icons')
}

main().catch((err) => {
    console.error('Icon generation failed:', err)
    process.exit(1)
})


