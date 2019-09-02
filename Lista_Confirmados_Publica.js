import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
import {firebaseDatabase} from './config'

export default class Lista_Confirmados_Publica extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      grupo_publico_participantes:[]
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

 


  componentDidMount() {
    const { navigate } = this.props.navigation;
   this.props.navigation.state.params.nome_grupo_publico
   this.props.navigation.state.params.chave_seguranca_evento
   this.props.navigation.state.params.nome_evento

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
   

    const rootPub = firebaseDatabase.ref('Eventos_Publicos_Participantes').orderByChild("chave_seguranca_evento").equalTo(this.props.navigation.state.params.chave_seguranca_evento);
    rootPub.on('value', (childSnapshot) => {
      const grupo_publico_participantes = [];
      childSnapshot.forEach((doc) => {
        grupo_publico_participantes.push({
            usuario_email: doc.toJSON().usuario_email,
          });
          this.setState({
            grupo_publico_participantes: grupo_publico_participantes.sort((a, b) => {
              return (a.usuario_email<b.usuario_email);
            }),
            loading: false,
          }); 
        });
    });
  }

  render() {
    const { currentUser } = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca_evento
    this.props.navigation.state.params.nome_evento
    return (
        <View style={styles.container}>
               <Header style={{color:'black',backgroundColor:'#a454ff',width:'100%'}} >
              <Text style={{fontSize: 25,color:'white'}}>{this.props.navigation.state.params.nome_grupo_publico}</Text>  
        </Header>
          <Content>
      <ScrollView>
          <Card>
          <CardItem block light style={{width:'100%',justifyContent:"center"}}>
          <Text>Usuarios que realizaram check-in no evento: {this.props.navigation.state.params.nome_evento} </Text>
          </CardItem>
          </Card>

<FlatList
  data={this.state.grupo_publico_participantes}
  renderItem={({item}) => {
  return (
    <Card>   
    <Item header bordered>
    <CardItem block light style={{color:'black',backgroundColor:'#a454ff',width:'100%',justifyContent:"center"}}>
           <Text style={{color:'white',fontSize:15}}>{item.usuario_email}</Text>
           </CardItem>
    </Item>
    </Card>
    );}}>
</FlatList>
</ScrollView>
        </Content>
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
    backgroundColor: '#A461FD',
  },
  item2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 40,
    backgroundColor: '#A461FD',
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
    height: 240,
    width: '100%',
    backgroundColor: '#a454ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});