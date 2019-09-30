import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Image, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import { Header, Icon, Item } from 'native-base';

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null };
  static navigationOptions = {
    title: "Cadastro",
    headerStyle: { backgroundColor: '#963BE0', elevation: 0, shadowOpacity: 0 },
    headerTintColor: 'white',
  };

  handleSignUp = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleSignUp')
  }
  render() {
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#963BE0" style={{ display: 'none' }} >
        </Header>

        <Item style={{ marginTop: 60, borderColor: 'transparent' }} header>
          <Text style={{ fontSize: 28, textAlign: 'center', fontWeight: 'bold', marginBottom:150, color: '#666' }}>Crie sua conta</Text>
        </Item>

          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <View style={{ width: '65%' }}>
            <Icon style={{ position: 'absolute', right: 0, top: 5, color: '#888', padding: 10, fontSize: 20 }} name="mail" />

            <TextInput
              autoCapitalize='none'
              placeholder="Digite aqui o seu e-mail"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={{ width: '65%' }}>
            <Icon style={{ position: 'absolute', right: 3, top: 5, color: '#888', padding: 10, fontSize: 20 }} name="lock" />

            <TextInput
              secureTextEntry
              autoCapitalize="none"
              placeholder="Digite aqui a sua senha"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>


          <TouchableOpacity style={styles.btnStyle} onPress={this.handleSignUp}>
            <Text style={{ color: 'white' }}>Realizar cadastro</Text>
          </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
    width: '100%'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  },
  img: {
    height: '40%',
    width: '100%',
    resizeMode: 'stretch'
  },
  textInput: {
    height: '14%',
    width: '70%',
    marginTop: 2,
  },
  btnStyle: {
    height: '8%',
    marginTop: 50,
    marginBottom: 20,
    width: '70%',
    backgroundColor: '#963BE0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
})