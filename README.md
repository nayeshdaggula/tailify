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

- **Textinput**: Input field with validation and description.
- **Textarea**: Multiline input field with validation.
- **Passwordinput**: Password input with validation and description.
- **Pininput**: Input component for entering PIN codes.
- **Modal**: A customizable modal dialog with support for fullscreen, dynamic sizes, and z-index stacking.
- **Drawer**: A slide-in panel with configurable positions (left, right, top, bottom), sizes, and transitions.
- **Card**: A flexible card component with optional sections and border styles.
- **Select**: A dropdown component with searchable options and custom styling.

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

Below is an example of how to use multiple components from Tailify in a single page:

```tsx
'use client';
import React, { useState } from 'react';
import { Textinput, Textarea, Passwordinput, Pininput, Modal, Card, Select, Drawer } from '@nayeshdaggula/tailify';

function Page() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = () => {
    if (!text) {
      setError("This field is required.");
    } else {
      setError('');
      alert(`Submitted: ${text}`);
    }
  };

  return (
    <div>
      <Textinput
        label="Name"
        description="Please enter your full name"
        placeholder="John Doe"
        value={text}
        onChange={(e) => setText(e.target.value)}
        withAsterisk
        error={error}
      />
      <Textarea
        label="Description"
        description="Please enter your description"
        placeholder="Description"
        withAsterisk
      />
      <Passwordinput
        label="Password"
        description="Please enter your password"
        placeholder="Password"
        withAsterisk
      />
      <Pininput
        numberOfInputs={6}
        value={pinInput}
        onChange={(value) => {
          setPinInput(value);
        }}
        label="Pin"
        description="Please enter your pin"
        placeholder="*"
      />
      {pinInput}

      <br />
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Modal
      </button>
      <br />
      <br />
      <button
        onClick={() => setDrawerOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Drawer
      </button>
      <br />
      <br />

      {/* Modal Component */}
      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        size="md"
        zIndex={9999}
      >
        <h2 className="text-lg font-bold">Modal Title</h2>
        <p className="text-gray-600">This is the modal content.</p>
        <button
          onClick={() => setModalOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </Modal>

      {/* Drawer Component */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="lg"
        closeOnClickOutside={true}
      >
        <h2 className="text-lg font-bold">Drawer Title</h2>
        <p className="text-gray-600">This is the drawer content.</p>
        <button
          onClick={() => setDrawerOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Modal
        </button>
      </Drawer>

      {/* Card Component */}
      <Card
        withBorder
        padding="p-0"
        shadow="shadow-md"
      >
        <Card.Section withBorder>
          <h2 className="text-lg font-bold">Card Title</h2>
          <p className="text-gray-600">This is the card content.</p>
        </Card.Section>
        <Card.Section withBorder>
          <h2 className="text-lg font-bold">Card Title</h2>
          <p className="text-gray-600">This is the card content.</p>
        </Card.Section>
      </Card>

      {/* Select Component */}
      <Select
        label="Select"
        description="Please select an option"
        data={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
        searchable
        withAsterisk
      />

      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default Page;
```


```

## Contributing

Contributions are welcome! If you have a component you'd like to add or an improvement to suggest, feel free to open a pull request or file an issue on the GitHub repository.

## License

Tailify is licensed under the [MIT License](LICENSE).

