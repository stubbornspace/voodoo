import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Animated, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState({
    id: 'initial',
    title: 'Untitled',
    content: '',
    createdAt: new Date().toISOString(),
  });
  const [documentContent, setDocumentContent] = useState('');
  const [filename, setFilename] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const createNewDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setDocuments([...documents, newDoc]);
    setCurrentDocument(newDoc);
    setDocumentContent('');
    toggleMenu();
  };

  const saveDocument = async () => {
    if (!documentContent.trim()) {
      Alert.alert('Error', 'There is no content to save');
      return;
    }

    try {
      setIsSaving(true);
      
      // Prompt for filename
      Alert.prompt(
        'Save File',
        'Enter filename:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsSaving(false),
          },
          {
            text: 'Save',
            onPress: async (name) => {
              if (!name) {
                Alert.alert('Error', 'Please enter a filename');
                setIsSaving(false);
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
              } catch (error) {
                Alert.alert('Error', 'Failed to save file');
              } finally {
                setIsSaving(false);
              }
            },
          },
        ],
        'plain-text',
        currentDocument?.title || 'untitled'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save file');
      setIsSaving(false);
    }
  };

  const openDocument = async () => {
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
          
          // Update state
          setDocuments(prevDocs => [...prevDocs, newDoc]);
          setCurrentDocument(newDoc);
          setDocumentContent(content);
          
          // Close the drawer
          toggleMenu();
          
          // Show success message
          Alert.alert('Success', 'File opened successfully!');
        } catch (readError) {
          console.error('Error reading file:', readError);
          Alert.alert('Error', 'Failed to read file content');
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open file');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/space.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={toggleMenu}
          >
            <Ionicons name={isMenuOpen ? "close" : "menu"} size={30} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.drawer,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0]
                })
              }]
            }
          ]}
        >
          <View style={styles.drawerContent}>
            <TouchableOpacity style={styles.menuItem} onPress={createNewDocument}>
              <Ionicons name="document" size={20} color="white" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={saveDocument}>
              <Ionicons name="save" size={20} color="white" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={openDocument}>
              <Ionicons name="folder-open" size={20} color="white" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Open</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.editorContainer}>
          <TextInput
            style={styles.editor}
            multiline
            value={documentContent}
            onChangeText={setDocumentContent}
            placeholder="Make it so"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 3,
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 50, 0.8)',
    zIndex: 2,
  },
  drawerContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
  },
  editorContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editor: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    lineHeight: 32,
    borderRadius: 10,
    padding: 15,
    maxWidth: 800,
    width: '100%',
    marginTop: 40,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 24,
    textAlign: 'center',
    marginTop: -100,
  },
});
