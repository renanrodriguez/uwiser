import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import {Header} from 'native-base';
import firebase from 'react-native-firebase';



export default class Login extends React.Component {
  state = { email: 'lukasrenan2009@hotmail.com', password: '123456', errorMessage: null };
  static navigationOptions = {
    headerStyle: {backgroundColor:'#6c05da',elevation: 0,shadowOpacity: 0},
  };
  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#6c05da" style={{ display: 'none' }} >
          <Text style={{ fontSize: 30, color: 'white', }}>Estudos</Text>
        </Header>
        <View style={styles.uconteiner}>
          <Image
            style={styles.img}
            source={require('../uwizer/assets/UWiserLight.png')}
          />
        </View>
        {this.state.errorMessage && (
          <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
        )}

        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
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
        <TouchableOpacity
          style={styles.btnStyleEsqueceu}
          onPress={() => this.props.navigation.navigate('ForgetPassword')}>
          <Text style={{ color: '#0094ff' }}>esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle} onPress={this.handleLogin}>
          <Text style={{ color: 'white' }}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnStyleNao}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text>Ainda não possuo cadastro</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  uconteiner: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#6c05da',
    height: '50%',
    width: '100%',
    marginBottom: 40,
  },
  textInput: {
    marginTop: 2,
    height: 50,
    width: '70%',
  },

  img: {
    width: 200,
    height: 200,
    resizeMode: 'center',
  },
  btnStyle: {
    height: '8%',
    marginTop: 30,
    marginBottom: 20,
    width: '70%',
    backgroundColor: '#6c05da',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  btnStyleNao: {
    height: '8%',
    width: '70%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  btnStyleEsqueceu: {
    height: '5%',
    marginTop: 2,
    width: '70%',
    borderRadius: 50,
  },
});
