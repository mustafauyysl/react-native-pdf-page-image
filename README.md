# react-native-pdf-page-image

This module enables React Native applications to generate images from PDF document pages. It uses PDFKit on iOS and PdfRenderer on Android to render PDF pages as images.

## Installation
```sh
npm install react-native-pdf-page-image
```
#### iOS
`$ cd ios & pod install`

## Usage

Importing the Module
```js
import PdfPageImage from 'react-native-pdf-page-image';
```


### Generating Images for All PDF Pages

You can generate images for all pages in a PDF document with the following method:
```js
const uri = "https://pdfobject.com/pdf/sample.pdf";
const scale = 1.0;

// Generate images from all pages
PdfPageImage.generateAllPages(uri, scale)
  .then(images => images.forEach((image, index) => console.log(`Page ${index+1}: ${image.uri}, Width: ${image.width}, Height: ${image.height}`)))
  .catch(error => console.error('Error generating images:', error));

// Generate images from all pages and save to a specific folder
PdfPageImage.generateAllPages(uri, scale, 'my_pdf_folder')
  .then(images => {
    console.log(`Generated ${images.length} pages in 'my_pdf_folder'`);
    // Also creates a thumbnail.png file for the first page
    images.forEach((image, index) => console.log(`Page ${index}: ${image.uri}`));
  })
  .catch(error => console.error('Error generating images:', error));
```

**Note:** When you provide a `folderName` parameter, the method will:
- Create a folder with the specified name in the app's documents directory
- Save each page as `0.png`, `1.png`, `2.png`, etc.
- Automatically create a `thumbnail.png` file (optimized thumbnail of first page, max 300px)

**Folder structure example:**
```
📁 Documents/my_pdf_folder/
  ├── 📄 thumbnail.png (First page thumbnail - max 300px)
  ├── 📄 0.png (Page 0 - full scale)
  ├── 📄 1.png (Page 1 - full scale)
  └── 📄 2.png (Page 2 - full scale)
```


### Generating an Image for a Specific Page

If you only need to generate an image for a single page, use the generate method:
```js
const uri = "https://pdfobject.com/pdf/sample.pdf";
const scale = 1.0;

// Generate an image from a specific page
PdfPageImage.generate(uri, 1, scale)  // Example uses page number 1
  .then(image => console.log(`Generated image: ${image.uri}, Width: ${image.width}, Height: ${image.height}`))
  .catch(error => console.error('Error generating image:', error));
```


### Optional: Getting PDF Information

To open a PDF document and retrieve its information, use the open method:
```js
PdfPageImage.open(uri)
  .then(info => console.log(`PDF opened with URI: ${info.uri}, Page count: ${info.pageCount}`))
  .catch(error => console.error('Error opening PDF:', error));
```


### Optional: Closing the PDF Document

After processing, you can close the PDF document and delete any temporary files that were generated. Use the close method:
```js
PdfPageImage.close(uri)
  .then(() => console.log('PDF closed successfully.'))
  .catch(error => console.error('Error closing PDF:', error));
```

# API

`open(uri: string): Promise<PdfInfo>`

  Opens a PDF document and returns its basic information.
  - uri: Path to the PDF file.

`generate(uri: string, page: number, scale?: number): Promise<PageImage>`

  Generates an image from a specific PDF page.
  - uri: Path to the PDF file.
  - page: Page number to render.
  - scale: Scale of the generated image, optional

`generateAllPages(uri: string, scale?: number, folderName?: string): Promise<PageImage[]>`

  Generates images from all pages of the PDF document.
  - uri: Path to the PDF file.
  - scale: Scale of the generated images, optional.
  - folderName: Name of the folder to save images in, optional. When provided:
    - Creates a folder in the app's documents directory
    - Saves pages as `0.png`, `1.png`, `2.png`, etc.
    - Automatically creates `thumbnail.png` (optimized thumbnail of first page, max 300px)

`close(uri: string): Promise<void>`

  Clean up resources, deleting temporary files and closing connections..
  - uri: Path to the PDF file that is currently open.

# Types

```typescript
type PdfInfo = {
  uri: string;
  pageCount: number;
};

type PageImage = {
  uri: string;
  width: number;
  height: number;
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
