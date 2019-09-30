import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image} from 'react-native'
import firebase from 'react-native-firebase';
import { Header, Icon } from 'native-base';

export default class ForgetPassword extends React.Component {
  state = {email: '', errorMessage: null }
  static navigationOptions = {
    title: "Esqueci minha senha",
    headerStyle: { backgroundColor: '#963BE0', elevation: 0, shadowOpacity: 0 },
    headerTintColor: 'white',
  };

  resetSenha = () => {
    const { email } = this.state
    firebase
      .auth()
      .sendPasswordResetEmail(email,null)
      .then(() => this.props.navigation.navigate('Login'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
       
       <View style={{width:'65%'}}>

        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <Icon style={{ position: 'absolute', right: 0, top: 5, color: '#888', padding: 10, fontSize: 20 }} name="mail" />

          <TextInput
          autoCapitalize='none'
          placeholder="Digite aqui o seu e-mail"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
       </View>

        <TouchableOpacity style={styles.btnStyle} onPress={this.resetSenha}>
          <Text style={ {color: 'white'} }>Enviar link para o meu Email</Text>
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
    backgroundColor: '#fff',
    height: '100%',
    width: '100%'
  },
  textInput: {
    height: '14%',
    width: '70%',
    marginTop: 2,
  }, 

  textView: {
    height: '8%',
    width: '80%',
    color: '#191919',
    marginTop: 2,
  }, 
  img: {
    height: '40%',
    width: '100%',
    resizeMode: 'stretch'
  }, 
  btnStyle: {
    height: '8%',
    marginTop: 10,
    width: '70%',
    backgroundColor: '#963BE0',
    justifyContent: 'center',
    alignItems: 'center' ,
    borderRadius: 50
  },
  btnStyleNao: {
    height: '8%',
    marginTop: 10,
    width: '70%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center' ,
    borderRadius: 50
  },
  btnStyleEsqueceu: {
    height: '8%',
    marginTop: 2,
    marginBottom: 10,
    width: '70%',
    borderRadius: 50
  }
}

)