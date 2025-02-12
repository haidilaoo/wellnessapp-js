import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {  PaperProvider, Provider, Snackbar } from 'react-native-paper';
import { COLORS, theme } from '../globalStyles';

const CustomSnackbar = ( {message, onDismiss, visible, onUndo, style}) => {
    // const [visible, setVisible] = React.useState(false);
    const onDismissSnackBar = () => setVisible(false);

    const onToggleSnackBar = () => setVisible(!visible);
    return (  
        <>
        <Provider>
        {/* <Button title="Show Snackbar" onPress={onToggleSnackBar} >{visible ? 'Hide' : 'Show'}</Button> */}
        <Snackbar
        
          visible={visible}
          onDismiss={onDismiss}
          duration={5000}
          action={{
            label: 'Undo',
            onPress: onUndo, // Calls handleUndo when pressed
            textColor: COLORS.secondary2,
          }}
          style = {style}>
          {message}
        </Snackbar>
        </Provider>
        </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
  });
  
  export default CustomSnackbar;
