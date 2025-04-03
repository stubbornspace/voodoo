import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
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
    if (!currentDocument) return;

    try {
      const updatedDoc = {
        ...currentDocument,
        content: documentContent,
        updatedAt: new Date().toISOString(),
      };

      const updatedDocuments = documents.map(doc => 
        doc.id === currentDocument.id ? updatedDoc : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument(updatedDoc);
      Alert.alert('Success', 'Document saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save document');
    }
  };

  const openDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        const newDoc = {
          id: Date.now().toString(),
          title: result.name,
          content: content,
          createdAt: new Date().toISOString(),
        };
        setDocuments([...documents, newDoc]);
        setCurrentDocument(newDoc);
        setDocumentContent(content);
        toggleMenu();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open document');
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
          
          <Animated.View 
            style={[
              styles.dropdown,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0]
                  })
                }]
              }
            ]}
          >
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
          </Animated.View>
        </View>

        <View style={styles.editorContainer}>
          {currentDocument ? (
            <TextInput
              style={styles.editor}
              multiline
              value={documentContent}
              onChangeText={setDocumentContent}
              placeholder="Start typing..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          ) : (
            <Text style={styles.placeholderText}>Create a new document or open an existing one to start editing</Text>
          )}
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
    zIndex: 1,
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 10,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
  },
  editorContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
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
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
