import { parse, ParserPlugin } from '@babel/parser';

const testTokens = ['describe', 'it', 'test'];

export const tsPlugins: ParserPlugin[] = ['typescript', 'objectRestSpread', 'optionalChaining'];

export const tsxPlugins: ParserPlugin[] = ['jsx', ...tsPlugins];
export const jsPlugins: ParserPlugin[] = [
  'objectRestSpread',
  'optionalChaining',
  'asyncDoExpressions',
  'asyncGenerators',
  'bigInt',
  'classPrivateMethods',
  'classPrivateProperties',
  'classProperties',
  'classStaticBlock',
  'decimal',
  'doExpressions',
  'dynamicImport',
  'estree',
  'exportDefaultFrom',
  'functionBind',
  'functionSent',
  'importMeta',
  'logicalAssignment',
  'importAssertions',
  'moduleStringNames',
  'nullishCoalescingOperator',
  'numericSeparator',
  'optionalCatchBinding',
  'partialApplication',
  'placeholders',
  'privateIn',
  'throwExpressions',
  'topLevelAwait',
];

export const jsxPlugins: ParserPlugin[] = ['jsx', ...jsPlugins];

interface IParseResult {
  loc: number;
  testName: string;
}

function codeParser(sourceCode: string, plugins: ParserPlugin[]): IParseResult[] {
  const ast = parse(sourceCode, {
    plugins: plugins,
    sourceType: 'module',
    tokens: true,
    errorRecovery: true,
  });

  return ast.tokens
    .map(({ value, loc, type }, index) => {
      if (testTokens.indexOf(value) === -1) {
        return;
      }
      if (type.label !== 'name') {
        return;
      }
      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return;
      }

      return {
        loc,
        testName: ast.tokens[index + 2].value,
      };
    })
    .filter(Boolean);
}

export { codeParser };
