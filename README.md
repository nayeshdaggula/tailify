# Tailify

React Tailwind Component Library

## Configuration

To configure Tailify with your TailwindCSS project, add the following code on global.css file on your project.

```global.css
@source "../node_modules/@nayeshdaggula/tailify";

@custom-variant dark (&:where([data-tailify-theme-variant=dark], [data-tailify-theme-variant=dark] *));

/* Ensure dark mode applies to `body` */
[data-tailify-theme-variant="dark"] body {
  @apply bg-neutral-900 text-white;
}

[data-tailify-theme-variant="light"] body {
  @apply bg-white text-black;
}
```

Add data-tailify-theme-variant to html tag.

```
<html data-tailify-theme-variant="light">
```


## Components

When you use Richtexteditor for placeholder use below css code on your project.

```
.richtexteditor-main .tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

````


## Contributing

Contributions are welcome! If you have a component you'd like to add or an improvement to suggest, feel free to open a pull request or file an issue on the GitHub repository.

## License

Tailify is licensed under the [MIT License](LICENSE).

