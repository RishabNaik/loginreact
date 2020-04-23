import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import firebase from 'firebase';
import * as Google from "expo-google-app-auth";
import * as Facebook from 'expo-facebook';

class LoginScreen extends Component {

     isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}


     onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.

            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );

            // Sign in with credential from the Google user.

            firebase.auth().signInWithCredential(credential)
            .then(function(result){
                console.log('user signed in');
                if(result.additionalUserInfo.isNewUser) {

                
                firebase
                    .database()
                    .ref('/users/' + result.user.uid)
                    .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()
                    })

                }else {
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid).update({last_logged_in : Date.now()})
                }

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        } else {
            console.log('User already signed-in Firebase.');
        }
    }.bind(this));
}

    signInWithGoogleAsync= () => {
    try {
        const result = Google.logInAsync({
            behaviour:'web',
            androidClientId:'1092057614213-1qf6oho4vdi2aiqm5b46vdce09sl6nje.apps.googleusercontent.com',
            iosClientId: '1092057614213-immhnu3nt79fvhmq1st8dl32qlk6o352.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
    } catch (e) {
        return { error: true };
    }
}

     logIn= () => {
    try {
         Facebook.initializeAsync('2926256467492608');
        const {
            type,
            token,
        
        } = Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
        });
        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${( response.json()).name}!`);
        } else {
            // type === 'cancel'
        }
    } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
    }
}




async loginWithFacebook(){
        const { type , token } = Facebook.loginWithReadPermissionsAsync
            ('2926256467492608' , { permissions: ['public_profile'] } )

        if (type == 'success' ) {

            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential).catch(error => {
                console.log(error);
            })
        }

}

    render() {
        return (
            <View style={styles.container}>
                <Button title='sign in with google' onPress={()=> this.signInWithGoogleAsync()}
                />
            

                <Button title='sign in with Facebook' onPress={() => this.logIn()}
                />
            </View>
        );
    }
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});