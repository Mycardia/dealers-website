import fs from 'fs';
import path from 'path';
import url from 'url';
import moment from 'moment';
import archiver from 'archiver';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateBundlerInfo = { history: [], version: {} };
const metaFolderPath = path.join(__dirname, './meta');
const bundlerInfoFilePath = path.join(__dirname, './meta/bundler-info.json');

const bundlerInfo = openBundlerInfo();
const tag = buildTag();

bundlerInfo.version[tag] = bundlerInfo.version[tag] ?? 0;
bundlerInfo.version[tag]++;

const version = (bundlerInfo.version[tag] + '').padStart(3, '0');
const fileName = `DW_Build-${tag.toUpperCase()}-v${version}-${moment().format(
  'HHmm-DD_MM_YYYY'
)}`;

const bundleLocation = path.join(
  __dirname,
  './../build-bundles',
  '/' + fileName + '.zip'
);
const distLocation = path.join(__dirname, './../.output/');

const output = fs.createWriteStream(bundleLocation);
const archive = archiver('zip', {
  zlib: { level: 9 },
});
output.on('close', function () {
  console.log('Bundle:', fileName);
});
archive.on('error', function (err) {
  throw err;
});
archive.pipe(output);
archive.directory(distLocation, false);
archive.finalize();

bundlerInfo.history.push({
  tag,
  version,
  fileName,
  time: moment().format('HH:MM, DD MM YYYY'),
});

saveBundlerInfo(bundlerInfo);

function buildTag() {
  return getArgs()['tag'] || 'regular';
}

function getArgs() {
  const args = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    } else if (arg[0] === '-') {
      const flags = arg.slice(1, arg.length).split('');
      flags.forEach((flag) => {
        args[flag] = true;
      });
    }
  });
  return args;
}

function openBundlerInfo() {
  if (!fs.existsSync(metaFolderPath)) {
    try {
      fs.mkdirSync(metaFolderPath);
      console.log('Bundler: Added meta folder', metaFolderPath);
    } catch (e) {
      console.log('Bundler Error: Failed add meta folder', metaFolderPath, e);
    }
  }
  if (!fs.existsSync(bundlerInfoFilePath)) {
    try {
      fs.writeFileSync(
        bundlerInfoFilePath,
        JSON.stringify(templateBundlerInfo, null, 4),
        { encoding: 'utf-8' }
      );
      console.log('Bundler: Added bundler-info.json file', bundlerInfoFilePath);
    } catch (e) {
      console.log(
        'Bundler Error: Failed to add bundler-info.json',
        bundlerInfoFilePath,
        e
      );
    }
    return templateBundlerInfo;
  } else {
    try {
      const content = fs.readFileSync(bundlerInfoFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.log(
        'Bundler: Parsing failed: bundler-info.json',
        bundlerInfoFilePath,
        e
      );
      console.log(e);
      return templateBundlerInfo;
    }
  }
}

function saveBundlerInfo(info) {
  let content = '';
  try {
    content = JSON.stringify(info, null, 4);
  } catch (e) {
    console.log('Unable to serialize bundler info', info, e);
  }
  if (content) {
    fs.writeFileSync(bundlerInfoFilePath, content, { encoding: 'utf-8' });
  }
}