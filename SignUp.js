import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Image,TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }
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
     <Image style={styles.img} source={require('../uwizer/assets/UWiserLight.png')}/>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
          style={styles.textInput}
          autoCapitalize='none'
          placeholder="Digite aqui o seu e-mail"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none" 
          placeholder="Digite aqui a sua senha"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity style={styles.btnStyle} onPress={this.handleSignUp}>    
          <Text style={ {color: 'white'} }>Realizar cadastro</Text> 
        </TouchableOpacity>


        <TouchableOpacity style={styles.btnStyle} onPress={() => this.props.navigation.navigate('Login')} >
        <Text style={ {color: 'white'} }>Já tem uma conta? Faça seu Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
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
    marginTop: 10,
    width: '70%',
    backgroundColor: '#6c05da',
    justifyContent: 'center',
    alignItems: 'center' ,
    borderRadius: 50
  },
})