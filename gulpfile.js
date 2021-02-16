import { src, dest, parallel, watch } from 'gulp';
import ts from 'gulp-typescript';
import htmlmin from 'gulp-htmlmin';
import 'ts-node';
import bs from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import postCss from 'gulp-postcss';
import cssnano from 'cssnano';

// autoprefixer only work this way
const autoprefixer = require('autoprefixer');

// init process
const tsProject = ts.createProject('tsconfig.json');
bs.create();

// paths

const htmlPath = './src/index.html';
const htmlDest = './dist/';

const tsPath = './src/ts/**/*.ts';
const tsDest = './src/js/';

const jsPath = './src/js/**/*.js';
const jsDest = './dist/js/';

const cssPath = './src/css/**/*.css';
const cssDest = './dist/css/';

// tasks

const htmlTask = async () => {
  src(htmlPath)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest(htmlDest));
};

const tsCompileTask = async () => {
  src(tsPath)
    .pipe(tsProject())
    .pipe(dest(tsDest));
};

const jsTask = async () => {
  src(jsPath)
    .pipe(terser())
    .pipe(concat('all.js'))
    .pipe(dest(jsDest));
};

const cssTask = async () => {
  src(cssPath)
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(dest(cssDest));
};

const watchTask = () => {
  bs.init({
    server: {
      baseDir: './src/',
    }
  });

  watch(tsPath).on('change', tsCompileTask);
  watch([jsPath, cssPath, htmlPath]).on('change', () => bs.reload());
};

// exports.nomeDaTask = "funcao task"

exports.build = parallel(jsTask, htmlTask, cssTask, jsTask);
exports.html = htmlTask;
exports.css = cssTask;
exports.js = jsTask;
exports.ts = tsCompileTask;
exports.watch = watchTask;
