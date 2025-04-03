import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

class DocumentService {
  static createNewDocument() {
    return {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      createdAt: new Date().toISOString(),
    };
  }

  static async saveDocument(documentContent, currentDocument) {
    if (!documentContent.trim()) {
      Alert.alert('Error', 'There is no content to save');
      return false;
    }

    try {
      // Prompt for filename
      return new Promise((resolve) => {
        Alert.prompt(
          'Save File',
          'Enter filename:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Save',
              onPress: async (name) => {
                if (!name) {
                  Alert.alert('Error', 'Please enter a filename');
                  resolve(false);
                  return;
                }

                const filename = name.endsWith('.txt') ? name : `${name}.txt`;
                const fileUri = `${FileSystem.documentDirectory}${filename}`;

                try {
                  // Write the file
                  await FileSystem.writeAsStringAsync(fileUri, documentContent);
                  
                  // Share the file to let user choose location
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/plain',
                    dialogTitle: 'Save your file',
                  });

                  Alert.alert('Success', 'File saved successfully!');
                  resolve(true);
                } catch (error) {
                  Alert.alert('Error', 'Failed to save file');
                  resolve(false);
                }
              },
            },
          ],
          'plain-text',
          currentDocument?.title || 'untitled'
        );
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save file');
      return false;
    }
  }

  static async openDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        try {
          // Read the file content
          const content = await FileSystem.readAsStringAsync(result.uri);
          
          // Create a new document with the content
          const newDoc = {
            id: Date.now().toString(),
            title: result.name,
            content: content,
            createdAt: new Date().toISOString(),
          };
          
          // Show success message
          Alert.alert('Success', 'File opened successfully!');
          
          return newDoc;
        } catch (readError) {
          console.error('Error reading file:', readError);
          Alert.alert('Error', 'Failed to read file content');
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open file');
      return null;
    }
  }
}

export default DocumentService; 