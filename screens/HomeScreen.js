import React, { Component } from "react";
import { View , Text , StyleSheet ,Button } from "react-native";
import firebase from 'firebase';
 
class HomeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Button title='signout' onPress={() => firebase.auth().signOut()} />
            </View>
        );
    }
}
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});