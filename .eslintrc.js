const { NODE_ENV } = process.env;

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    // enforce return statements for array methods
    'array-callback-return': [
      2,
      {
        allowImplicit: true
      }
    ],

    // prefer no braces in arrow functions
    'arrow-body-style': 2,

    // require all variable declarations be in camelcase
    camelcase: 2,

    // require default case in switch
    'default-case': 2,

    // use dot notation instead of string notation
    'dot-notation': 2,

    // require === and !== instead of == and !==
    eqeqeq: [2, 'always', { null: 'ignore' }],

    // enforce max line width
    'max-len': [2, { code: 80, tabWidth: 2 }],

    // use PascalCase for constructors and classes
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: [
          'Immutable.Map',
          'Immutable.Set',
          'Immutable.List'
        ],
        properties: true
      }
    ],

    // disallow use of alert in productoin
    'no-alert': NODE_ENV === 'production' ? 2 : 1,

    // disallow array constructors
    'no-array-constructor': 2,

    // disallow use of console in production
    'no-console': NODE_ENV === 'production' ? 2 : 1,

    // disallow reassigning const variables

    // disallow use of debugger in production
    'no-debugger': NODE_ENV === 'production' ? 2 : 1,

    // avoid duplicate class members
    'no-dupe-class-members': 2,

    // do not return in `else` if `if` returns
    'no-else-return': [
      'error',
      {
        allowElseIf: false
      }
    ],

    // disallow expression evaluations
    'no-eval': 2,

    // use scooping in switch case blocks
    'no-case-declarations': 2,

    // avoid iterators
    'no-iterator': 2,

    // disallow `if` statements as the only statement in `else` blocks
    'no-lonely-if': 2,

    // disallow function declaration in loops
    'no-loop-func': 2,

    // don't chain variable assignments
    'no-multi-assign': 2,

    // disallow function contructors
    'no-new-func': 2,

    // disallow Object constructors
    'no-new-object': 2,

    // disallow wrapper instances
    'no-new-wrappers': 2,

    // disallow direct use of Object.prototype methods
    'no-prototype-builtins': 2,

    // avoid dangerous gloabls
    'no-restricted-globals': [
      'error',
      'isFinite',
      'isNaN',
      'addEventListener',
      'blur',
      'close',
      'closed',
      'confirm',
      'defaultStatus',
      'event',
      'external',
      'defaultstatus',
      'find',
      'focus',
      'frameElement',
      'frames',
      'history',
      'innerHeight',
      'innerWidth',
      'length',
      'location',
      'locationbar',
      'menubar',
      'moveBy',
      'moveTo',
      'name',
      'onblur',
      'onerror',
      'onfocus',
      'onload',
      'onresize',
      'onunload',
      'open',
      'opener',
      'opera',
      'outerHeight',
      'outerWidth',
      'pageXOffset',
      'pageYOffset',
      'parent',
      'print',
      'removeEventListener',
      'resizeBy',
      'resizeTo',
      'screen',
      'screenLeft',
      'screenTop',
      'screenX',
      'screenY',
      'scroll',
      'scrollbars',
      'scrollBy',
      'scrollTo',
      'scrollX',
      'scrollY',
      'self',
      'status',
      'statusbar',
      'stop',
      'toolbar',
      'top'
    ],

    // disallow dangerous properties
    'no-restricted-properties': [
      2,
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.'
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.'
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.'
      }
    ],

    // avoid dangerous for loops
    'no-restricted-syntax': [
      2,
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.'
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],

    // disallow `javascript:` urls
    'no-script-url': 2,

    // disallow duplicate variable declaration
    'no-shadow': 2,

    // disallow trailing or leading underscore
    'no-underscore-dangle': [2, { allowAfterThis: true }],

    // disallow ternary operators when simpler alternatives exist
    'no-unneeded-ternary': 2,

    // require every var be used
    'no-unused-vars': [
      1,
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true
      }
    ],

    // avoid empty constructors
    'no-useless-constructor': 2,

    // disallow useless escape
    'no-useless-escape': 2,

    // disallow returns when they're don't affect the function call
    'no-useless-return': 2,

    // disallow vars
    'no-var': 2,

    // require object literal shorthands
    'object-shorthand': [
      2,
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],

    // require each variable have it's own type keyword
    'one-var': [2, 'never'],

    // use const variables
    'prefer-const': [2, { destructuring: 'any', ignoreReadBeforeAssign: true }],

    // prefer destructuring from arrays and objects
    'prefer-destructuring': [
      2,
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: true,
          object: true
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],

    // use ... instead of arguments
    'prefer-rest-params': 2,

    // use spread instead of .apply()
    'prefer-spread': 2,

    // use template strings instead of string concat
    'prefer-template': 2,

    // allow prettier to work without breaking
    'prettier/prettier': [
      2,
      {
        singleQuote: true,
        printWidth: 80
      },
      {
        usePrettierrc: false
      }
    ],

    // enforce single quotes
    quotes: [2, 'single', { avoidEscape: false, allowTemplateLiterals: true }],

    // require radix in `parseInt`
    radix: 2,

    // disallow async functions with no `await` expression
    'require-await': 2,

    // sort imports
    'sort-imports': 2,

    // start all comments with spaces
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!']
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!'],
          balanced: true
        }
      }
    ],

    // require all functions except expressions to have a return type
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true
      }
    ],

    // allow module declarations
    '@typescript-eslint/no-namespace': 0
  }
};
