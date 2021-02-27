export function getFileTypeForCSSPreprocessor(preprocessor: 'less' | 'sass' | undefined): 'less' | 'scss' | 'css' {
  switch (preprocessor) {
    case 'less':
      return 'less';
    case 'sass':
      return 'scss';
    case undefined:
      return 'css';
    default:
      throw new Error(`Unsupported CSS preprocessor ${preprocessor}`);
  }
}
