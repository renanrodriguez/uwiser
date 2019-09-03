import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image} from 'react-native'
import firebase from 'react-native-firebase';
import {Header,Input,Button, Icon, Content,Footer, FooterTab} from 'native-base'
export default class Calendario extends React.Component {

  state = { currentUser: null }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};
 
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  render() {
    const { currentUser } = this.state
    return (
        <View style={styles.container}>
            <Header style={{color:'black',backgroundColor:'#963BE0'}}>
              <Text style={{fontSize: 30,color:'white',}}>Calendário</Text>
        </Header>
          <Content>
        <Text>
          Olá {currentUser && currentUser.email}!
        </Text>
        <Text>
         Seja bem-vindo a tela de Calendario
        </Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical active onPress={() => this.props.navigation.navigate('Main')}>
              <Icon name="grid" />
              <Text style={{fontSize: 12,color:'white'}}>Feed</Text>
            </Button>
            <Button vertical active onPress={() => this.props.navigation.navigate('Perfil')}>
              <Icon name="person" />
              <Text style={{fontSize: 12,color:'white'}}>Perfil</Text>
            </Button>
            <Button vertical active onPress={() => this.props.navigation.navigate('Grupos')}>
              <Icon active name="contacts" />
              <Text style={{fontSize: 12,color:'white'}}>Grupos</Text>
            </Button>
            <Button vertical active  onPress={() => this.props.navigation.navigate('Anotacoes')} >
              <Icon name="bookmarks" />
              <Text style={{fontSize: 12,color:'white'}}>Estudos</Text>
            </Button>
          </FooterTab>
        </Footer>
        </View>
    )
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
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
});