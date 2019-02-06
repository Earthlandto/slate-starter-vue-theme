const fs = require('fs');
const { RawSource } = require('webpack-sources');

const cachedSectionContents = {};

const getFileSectionContent = (sectionFileName = '', srcSectionsPath = '') => {
  if (cachedSectionContents[sectionFileName]) {
    return cachedSectionContents[sectionFileName];
  }

  const sectionFileContent = fs.readFileSync(
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
        paths.sectionsFullPath
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
    this.configPath = options.configPath;
    this.srcPaths = {
      assetsTemplatesPath: options.assetsTemplatesPath,
      assetsSectionsPath: options.assetsSectionsPath,
      sectionsFullPath: options.sectionsFullPath,
    };
  }

  apply(compiler) {
    const tsclonerConfiguration = JSON.parse(
      fs.readFileSync(this.configPath, 'utf8') || '{}'
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
