# svelte preprocessor demo

You can use HTML, CSS and JS preprocessors with Svelte via `svelte.preprocess` — docs on the [README](https://github.com/sveltejs/svelte#preprocessor-options).

If you're using rollup-plugin-svelte, you can add a `preprocess: {...}` option to your config, and it'll take care of it for you.

Take a look at [App.html](src/App.html)...

```html
<h1>Hello {{name}}!</h1>

<style type='text/scss'>
  @import 'variables';

  h1 {
    color: $brand;
  }
</style>
```

...[variables.scss](src/variables.scss)...

```scss
$brand: rgb(170,30,30);
```

...and [rollup.config.js](rollup.config.js):

```js
plugins: [
  svelte({
    // ...
    preprocess: {
      style: ({ content, attributes }) => {
        if (attributes.type !== 'text/scss') return;

        return new Promise((fulfil, reject) => {
          sass.render({
            data: content,
            includePaths: ['src'],
            sourceMap: true,
            outFile: 'x' // this is necessary, but is ignored
          }, (err, result) => {
            if (err) return reject(err);

            fulfil({
              code: result.css.toString(),
              map: result.map.toString()
            });
          });
        });
      }
    }
  }),
  // ...
]
```

## Future work

This is a good start, but we also need the following:

* Svelte should compose sourcemaps from preprocessors, so that your devtools point all the way back to the code that you authored, *not* the output of `svelte.preprocess`
* Rather than manually building the preprocessor, as above, it would be better to have a svelte-preprocess-scss package that hid all the boilerplate
* Support in loaders besides rollup-plugin-svelte

As a stretch goal, it would nice if our bundler could know about the dependency on variables.scss.

