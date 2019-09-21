import React from 'react'
import { StyleSheet, StatusBar, View ,Text, FlatList,TouchableOpacity,AsyncStorage,Image } from 'react-native'
import {Header,Input,Button, Icon, Content,Footer, FooterTab,Form,Item,Label,Card,CardItem,Body,Thumbnail,Left} from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
import {firebaseDatabase} from './config'
import Hyperlink from 'react-native-hyperlink'

const comentarios_root = firebaseDatabase.ref();
const comentarios_ref = comentarios_root.child('comentarios');


export default class Comentarios extends React.Component {
constructor(props){
  super(props);
      this.state = ({
        errorMessage: null,
         currentUser: null ,
         texto_comentario: '',
         comentarios: [],
         data_atual: '',
         usuario:[]
    });
}

static navigationOptions = {
  //To hide the ActionBar/NavigationBar
  header: null,
};

 handleNovoComentario = (nome_usuario,nome_faculdade,nome_curso,selected_heroi,emailUsuario) => {
    const { texto_comentario ,currentUser,data_atual} = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.chave_seguranca_comentarios
    if(texto_comentario==''){
        Toast.show('Coloque um texto no seu comentário')
    }else{
        comentarios_ref.push({
          usuario: currentUser.uid,
          nome_usuario:nome_usuario,
          texto_comentario:texto_comentario,
          data_inclusao : data_atual,
          selected_heroi:selected_heroi,
          chave_seguranca_comentarios:this.props.navigation.state.params.chave_seguranca_comentarios
        });
        this.setState({
          texto_comentario: '',
        });
        Toast.show('Comentário realizado com sucesso')
      }
     
    }

  componentDidMount() {
    var that = this;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    that.setState({
      data_atual:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min
    });

    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.chave_seguranca_comentarios

    const { currentUser } = firebase.auth()
    this.setState({ currentUser})

    
    const rootUser = firebaseDatabase.ref('Users').orderByChild("idUsuario").equalTo(currentUser.uid);
    rootUser.on('value', (childSnapshot) => {
      const usuario = [];
      childSnapshot.forEach((doc) => {
        usuario.push({
          key:doc.key,
          idUsuario: doc.toJSON().idUsuario,
          nome_usuario: doc.toJSON().nome_usuario,
          nome_faculdade: doc.toJSON().nome_faculdade,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          emailUsuario: doc.toJSON().emailUsuario,
          });
          this.setState({
            usuario: usuario.sort((a, b) => {
              return (a.key<b.key);
            }),
            loading: false,
          }); 
        });
    });


    const rootRef = firebaseDatabase.ref('comentarios').orderByChild("chave_seguranca_comentarios").equalTo(this.props.navigation.state.params.chave_seguranca_comentarios);
    rootRef.on('value', (childSnapshot) => {
      const comentarios = [];
      childSnapshot.forEach((doc) => {
        comentarios.push({
            key: doc.key,
            texto_comentario: doc.toJSON().texto_comentario,
            nome_usuario : doc.toJSON().nome_usuario ,
            data_inclusao : doc.toJSON().data_inclusao,
            selected_heroi:doc.toJSON().selected_heroi,
          });
          this.setState({
            comentarios: comentarios.sort((a, b) => {
                return (a.key < b.key);
            }),
            loading: false,
        });
      });
  });
  }

  render() {
    const { currentUser } = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.chave_seguranca_comentarios

    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#6c05da" style={{color:'black',backgroundColor:'#963BE0'}}>
              <Text style={{fontSize: 30,color:'white',}}>Comentarios</Text>
        </Header>
      <Form>
          <Card>
        <Item fixedLabel last>
        <Input multiline placeholder='Escreva um comentário' onChangeText={texto_comentario => this.setState({ texto_comentario })} value={this.state.texto_comentario} />
        </Item>
        <FlatList
          data={this.state.usuario}
          renderItem={({item}) => {
          return (
            <Item last>
         <Button block light style={{color:'black',backgroundColor:'#963BE0',width:'100%'}} onPress={() => this.handleNovoComentario(item.nome_usuario,item.nome_faculdade,item.nome_curso,item.selected_heroi,item.emailUsuario)}>
            <Text style={{color:'white',fontSize:20}}>Comentar</Text>
            <Icon name="add" style={{color:'white'}}/>
            </Button>
            </Item>
        );}}>
        </FlatList>
        </Card>
      </Form>
     

      <Content>
        <FlatList
          data={this.state.comentarios}
          renderItem={({ item}) => {
          return (
            <Card>
                    <CardItem header bordered>
      <Left>
      <Thumbnail square small source={{uri:item.selected_heroi }} />
        <Body>
          <Text>{item.nome_usuario}</Text>
        </Body>
      </Left>
      </CardItem> 
              <CardItem>
              <Hyperlink linkStyle={ { color: '#2980b9', fontSize: 20 } }>
                <Text selectable={true}   style={{fontSize: 20,color:'#4F4F4F'}}>{item.texto_comentario}</Text>
                </Hyperlink>            
            </CardItem>
            <CardItem   footer>
                <Text selectable={true}  style={{fontSize: 10,color:'grey'}}>Data inclusão: {item.data_inclusao}</Text>
            </CardItem>
            </Card>);}}>
        </FlatList>

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
    quadrado1: {
      height: 150,
      width: '100%',
      backgroundColor: '#708090',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      marginBottom: 20,
    },
    quadrado2: {
      height: 150,
      width: '100%',
      backgroundColor: '#708090',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      marginBottom: 20,
    },
    quadrado3: {
      height: 150,
      width: '100%',
      backgroundColor: '#708090',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      marginBottom: 20
    },
    item: {
      alignItems: 'center',
      flexGrow: 1,
      margin: 2,
      padding: 20,
      backgroundColor: '#F0F8FF',
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
    textInput: {
      marginTop: 2,
      height: 70,
      width: '70%',
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
    image: {
      width: '100%',
      height: 230
    },
    image_post: {
      width: '100%',
      height: 230
    }
  });