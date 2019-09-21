import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image} from 'react-native'
import {Header,Input,Button, Icon, Content,Footer, FooterTab} from 'native-base'
import firebase from 'react-native-firebase';

export default class Grupos extends React.Component {
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
            <Header androidStatusBarColor="#6c05da" style={{color:'black',backgroundColor:'#963BE0'}}>
              <Text style={{fontSize: 30,color:'white',}}>Grupos</Text>
        </Header>
          <Content>


        <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Grupos_Publicos_Gerenciar')}>
                <Text style={{ color: 'white' }}>Grupos públicos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Grupos_Privados')}>
                <Text style={{ color: 'white' }}>Grupos privados</Text>
              </TouchableOpacity>

 
        </Content>
        <Footer style={{ backgroundColor: "white" }}>
          <FooterTab style={{ backgroundColor: "white" }}>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Main')}>
              <Icon style={{ color: 'gray', fontSize: 30 }} name="grid" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Feed</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Perfil')}>
              <Icon style={{ color: 'gray', fontSize: 30 }} name="person" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Perfil</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Grupos')}>
              <Icon style={{ color: '#7F1CFD', fontSize: 30 }} active name="contacts" />
              <Text style={{ fontSize: 12, color: '#7F1CFD' }}>Grupos</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Anotacoes')} >
              <Icon style={{ color: 'gray', fontSize: 30 }} name="bookmarks" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Anotações</Text>
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