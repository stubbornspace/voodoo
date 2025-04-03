import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground } from 'react-native';

// Import components
import Header from './components/Header';
import Drawer from './components/Drawer';
import Editor from './components/Editor';

// Import contexts
import { UIProvider } from './contexts/UIContext';
import { DocumentProvider } from './contexts/DocumentContext';

export default function App() {
  return (
    <UIProvider>
      <DocumentProvider>
        <View style={styles.container}>
          <ImageBackground 
            source={require('./assets/space.jpg')}
            style={styles.background}
            resizeMode="cover"
          >
            <Header />
            <Drawer />
            <Editor />
            <StatusBar style="light" />
          </ImageBackground>
        </View>
      </DocumentProvider>
    </UIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});
