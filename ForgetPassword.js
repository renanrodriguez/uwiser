import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image} from 'react-native'
import firebase from 'react-native-firebase';

export default class ForgetPassword extends React.Component {
  state = {email: '', errorMessage: null }

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
    backgroundColor: '#f6f6f6',
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
    backgroundColor: '#6c05da',
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