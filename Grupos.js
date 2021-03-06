import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native'
import { Header, Input, Button, Icon, Content, Footer, FooterTab } from 'native-base'
import firebase from 'react-native-firebase';

export default class Grupos extends React.Component {
  state = { currentUser: null }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    title: "Grupos",
    headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff'}, 
    headerStyle: {
      backgroundColor: '#963BE0'
    },
  };

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  render() {
    const { currentUser } = this.state
    return (
      <View style={styles.container}>
        <Content>
          <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Grupos_Publicos_Gerenciar')}>
            <Text style={{ color: 'white' }}>Grupos públicos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Grupos_Privados')}>
            <Text style={{ color: 'white' }}>Grupos privados</Text>
          </TouchableOpacity>


        </Content>

      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#708090',
  },
  button: {
    height: 50,
    width: '25%',
    backgroundColor: '#708090',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    marginBottom: 20,
  },

  item: {
    alignItems: 'center',
    flexGrow: 1,
    margin: 4,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#963BE0',
  },
  item2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 40,
    backgroundColor: '#963BE0',
    width: '80%',
    height: '10%',
    marginLeft: '10%',
  },
  texto: {
    color: '#DCF5F7',
    textAlign: 'center',
    fontSize: 55,
  },
  itemEmpty: {
    backgroundColor: 'transparent',
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'center',
  },
  btnPerfil: {
    height: 50,
    width: '100%',
    backgroundColor: '#963BE0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});