import esbuild from 'esbuild'
import fs from 'fs';
import path from "path";

const mkFolder = (dir: string): void => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}
mkFolder(path.resolve(__dirname, '..', 'out'));

const copyFolder = async (from: string, to: string) => {
    mkFolder(to);
    const files = fs.readdirSync(from)
    await Promise.all(files.map(async (file) => {
        if (fs.lstatSync(path.resolve(from, file)).isDirectory()) {
            await copyFolder(path.resolve(from, file), path.resolve(to, file));
        } else {
            fs.copyFileSync(path.resolve(from, file), path.resolve(to, file));
        }
    }))
}

(async () => {
    await copyFolder(path.resolve(__dirname, '..', 'static'), path.resolve(__dirname, '..', 'out'))

    await esbuild.build({
        entryPoints: [path.resolve(__dirname, 'App.tsx')],
        bundle: true,
        outfile: path.resolve(__dirname, '..', 'out', 'app.js'),
        sourcemap: true,
        platform: 'browser',
        format: 'iife',
        external: [],
        target: ['es2021'],
        minify: false,
    })
})()
