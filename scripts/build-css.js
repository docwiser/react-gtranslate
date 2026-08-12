const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

async function buildCss() {
  const inputPath = path.resolve(__dirname, '../src/styles/gtranslate.css');
  const outputPath = path.resolve(__dirname, '../dist/styles.css');

  if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
    fs.mkdirSync(path.resolve(__dirname, '../dist'), { recursive: true });
  }

  const css = fs.readFileSync(inputPath, 'utf8');

  try {
    let plugins = [];
    try {
      plugins.push(require('@tailwindcss/postcss')());
    } catch (e) {
      try {
        plugins.push(require('tailwindcss')());
      } catch (e2) {}
    }
    try {
      plugins.push(require('autoprefixer')());
    } catch (e) {}

    const result = await postcss(plugins).process(css, {
      from: inputPath,
      to: outputPath,
    });

    fs.writeFileSync(outputPath, result.css, 'utf8');
    console.log('Successfully compiled dist/styles.css');
  } catch (err) {
    console.warn('PostCSS build note:', err.message);
    // Fallback copy
    fs.copyFileSync(inputPath, outputPath);
    console.log('Fallback copied styles.css to dist/styles.css');
  }
}

buildCss();
