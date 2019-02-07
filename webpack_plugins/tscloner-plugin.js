const path = require('path');
const { readFileSync } = require('fs');
const { RawSource } = require('webpack-sources');

const tsclonerRootPath = path.resolve('src', 'config', 'tscloner');
const defaultOptions = {
  configFolderPath: tsclonerRootPath,
  sectionsPlaceholderPath: path.resolve(
    tsclonerRootPath,
    'sections_placeholders'
  ),
  configFileName: 'tscloner.config.json',
  assetsTemplatesPath: '../templates',
  assetsSectionsPath: '../sections',
};
const cachedSectionContents = {};

const getFileSectionContent = (sectionFileName = '', srcSectionsPath = '') => {
  if (cachedSectionContents[sectionFileName]) {
    return cachedSectionContents[sectionFileName];
  }

  const sectionFileContent = readFileSync(
    `${srcSectionsPath}/${sectionFileName}.liquid`,
    'utf8'
  );

  cachedSectionContents[sectionFileName] = sectionFileContent;

  return sectionFileContent;
};

const generateTemplateContentBySections = (sectionsList = []) => {
  return sectionsList
    .map(item => {
      return `{% section '${item}' %}`;
    })
    .join('\n');
};

const generateNewFilesInfo = (tsclonerConfiguration = {}, paths = {}) => {
  const newFilesInfo = [];
  const tsclonerSections = tsclonerConfiguration.sections || [];
  const tsclonerTemplates = tsclonerConfiguration.templates || [];

  tsclonerSections.forEach(sectionInfo => {
    newFilesInfo.push({
      path: `${paths.assetsSectionsPath}/${sectionInfo.name}.liquid`,
      content: getFileSectionContent(
        sectionInfo.cloneFrom,
        paths.sectionsPlaceholderPath
      ),
    });
  });

  tsclonerTemplates.forEach(templateInfo => {
    newFilesInfo.push({
      path: `${paths.assetsTemplatesPath}/${templateInfo.name}.liquid`,
      content: generateTemplateContentBySections(templateInfo.sections),
    });
  });

  return newFilesInfo;
};

class TSClonerPlugin {
  constructor(options) {
    const paths = {
      ...defaultOptions,
      ...options,
    };

    this.configPath = path.resolve(
      paths.configFolderPath,
      paths.configFileName
    );

    this.srcPaths = {
      assetsTemplatesPath: paths.assetsTemplatesPath,
      assetsSectionsPath: paths.assetsSectionsPath,
      sectionsPlaceholderPath: paths.sectionsPlaceholderPath,
    };
  }

  apply(compiler) {
    const tsclonerConfiguration = JSON.parse(
      readFileSync(this.configPath, 'utf8') || '{}'
    );

    compiler.hooks.emit.tapAsync('TSClonerPlugin', (compilation, callback) => {
      const newFilesInfo = generateNewFilesInfo(
        tsclonerConfiguration,
        this.srcPaths
      );

      newFilesInfo.forEach(fileInfo => {
        compilation.assets[fileInfo.path] = new RawSource(fileInfo.content);
      });

      callback();
    });
  }
}

module.exports = TSClonerPlugin;
