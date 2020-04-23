import React, { Component } from "react";
import { View , Text , StyleSheet , ActivityIndicator } from "react-native";
import firebase from 'firebase';

class LoadingScreen extends Component {

    componentDidMount(){
        this.CheckIfLoggedIn();
    }

CheckIfLoggedIn = () =>{
    firebase.auth().onAuthStateChanged(user =>
    {
        if(user)
        {
            this.props.navigation.navigate('HomeScreen')
        }
        else
            {
            this.props.navigation.navigate('LoginScreen')
            }
    });
}

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>LoadingScreen</Text>
            </View>
        );
    }
}
export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});