import * as React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
//import PdfPageImage, { PageImage } from 'react-native-pdf-page-image';
import PdfPageImage, { PageImage } from '../../';

type ErrorType = { code: string; message: string };

export default function App() {
  const [thumbnail, setThumbnail] = React.useState<PageImage | undefined>();
  const [pageCount, setPageCount] = React.useState<number | undefined>();
  const [error, setError] = React.useState<ErrorType | undefined>();

  const onPress = async () => {
    try {
      const { uri } = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      const result = await PdfPageImage.generate(uri, 0, 1.0);
      setThumbnail(result);
      setPageCount(undefined);
      setError(undefined);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        setThumbnail(undefined);
        setPageCount(undefined);
        setError(err as ErrorType);
      }
    }
  };

  const onPressAllPages = async () => {
    try {
      const { uri } = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      const result = await PdfPageImage.generateAllPages(uri, 1.0, 'deneme');
      setPageCount(result);
      setThumbnail(undefined);
      setError(undefined);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        setThumbnail(undefined);
        setPageCount(undefined);
        setError(err as ErrorType);
      }
    }
  };

  const ThumbnailResult = thumbnail ? (
    <>
      <Image
        source={thumbnail}
        resizeMode="contain"
        style={styles.thumbnailImage}
      />
      <Text style={styles.thumbnailInfo}>uri: {thumbnail.uri}</Text>
      <Text style={styles.thumbnailInfo}>width: {thumbnail.width}</Text>
      <Text style={styles.thumbnailInfo}>height: {thumbnail.height}</Text>
    </>
  ) : null;

  const PageCountResult = pageCount ? (
    <>
      <Text style={styles.successText}>✅ Successfully generated {pageCount} pages!</Text>
      <Text style={styles.thumbnailInfo}>Files saved in 'deneme' folder:</Text>
      <Text style={styles.thumbnailInfo}>• thumbnail.png (first page preview)</Text>
      {Array.from({ length: pageCount }, (_, i) => (
        <Text key={i} style={styles.thumbnailInfo}>• {i}.png (page {i})</Text>
      ))}
    </>
  ) : null;

  const ThumbnailError = error ? (
    <>
      <Text style={styles.thumbnailError}>Error code: {error.code}</Text>
      <Text style={styles.thumbnailError}>Error message: {error.message}</Text>
    </>
  ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Pick PDF File (Single Page)" />
        <Button onPress={onPressAllPages} title="Pick PDF File (All Pages to 'deneme' folder)" />
      </View>
      <ScrollView>
        <View style={styles.thumbnailPreview}>
          {ThumbnailResult}
          {PageCountResult}
          {ThumbnailError}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 20,
    gap: 10,
  },
  thumbnailPreview: {
    padding: 0,
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#eee',
  },
  thumbnailInfo: {
    color: 'darkblue',
    padding: 10,
  },
  thumbnailError: {
    color: 'crimson',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 16,
  },
});
