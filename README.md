# Tailify

React Tailwind Component Library

## Configuration

To configure Tailify with your TailwindCSS project, add the following line to the `content` section of your `tailwind.config.js` file:

```javascript
module.exports = {
  content: [
    "./node_modules/@nayeshdaggula/tailify/dist/**/*.{js,ts,jsx,tsx}",
    // other paths to your project files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

This ensures that TailwindCSS processes the styles from the Tailify component library.

## Available Components

Tailify provides a growing list of reusable React components built with TailwindCSS. Below is the list of currently available components:

- **Modal**: A customizable modal dialog with support for fullscreen, dynamic sizes, and z-index stacking.
- **Drawer**: A slide-in panel with configurable positions (left, right, top, bottom), sizes, and transitions.
- **Select**: A dropdown component with searchable options and custom styling.
- **Card**: A flexible card component with optional sections and border styles.

## Installation

Install the library via npm:

```bash
npm install @nayeshdaggula/tailify
```

Or via yarn:

```bash
yarn add @nayeshdaggula/tailify
```

## Usage Example

Here is an example of how to use the `Modal` component from Tailify:

```jsx
import React, { useState } from 'react';
import { Modal } from '@nayeshdaggula/tailify';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        Open Modal
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        padding="p-6"
      >
        <h1 className="text-lg font-bold">Hello, Tailify!</h1>
        <p>This is a modal example.</p>
      </Modal>
    </div>
  );
}

export default App;
```

## Contributing

Contributions are welcome! If you have a component you'd like to add or an improvement to suggest, feel free to open a pull request or file an issue on the GitHub repository.

## License

Tailify is licensed under the [MIT License](LICENSE).

