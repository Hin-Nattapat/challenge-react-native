import { StyleSheet, Text, View } from 'react-native';

const AddTeammateScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Add teammate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

export default AddTeammateScreen;
