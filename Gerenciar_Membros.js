import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
import {firebaseDatabase} from './config'

const pub_pri_root = firebaseDatabase.ref();
const pub_pri_ref = pub_pri_root.child('Grupo_Privado');
export default class Gerenciar_Membros extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      email_membro:'',
      grupo_privado:[]
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

handleNovoMembro = () => {
  const {  currentUser,email_membro} = this.state
  const { navigate } = this.props.navigation;
  if (currentUser.uid+this.props.navigation.state.params.nome_grupo_privado != this.props.navigation.state.params.chave_seguranca){
    Toast.show('Apenas o criador do grupo pode adicionar novos membros')
  }else{
    Toast.show('Novo membro adicionado com sucesso')
    pub_pri_ref.push({
      usuario: email_membro,
      nome_grupo_privado : this.props.navigation.state.params.nome_grupo_privado,
      chave_seguranca:this.props.navigation.state.params.chave_seguranca
    });
  }
} 


  handleExcluirMembro = (key) => {
    const {  currentUser,email_membro} = this.state
    const { navigate } = this.props.navigation;
    if (currentUser.uid+this.props.navigation.state.params.nome_grupo_privado != this.props.navigation.state.params.chave_seguranca){
      Toast.show('Apenas o criador do grupo pode excluir membros')
    }else{
    Toast.show('Membro excluido com sucesso');
    const caminho_exclusao = firebaseDatabase.ref('Grupo_Privado/'+key)
    caminho_exclusao.remove()
  
}

}


  componentDidMount() {
    const { navigate } = this.props.navigation;
   this.props.navigation.state.params.nome_grupo_privado
   this.props.navigation.state.params.chave_seguranca

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

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
   

    const rootPub = firebaseDatabase.ref('Grupo_Privado').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);
    rootPub.on('value', (childSnapshot) => {
      const grupo_privado = [];
      childSnapshot.forEach((doc) => {
        grupo_privado.push({
          key: doc.key,
          usuario: doc.toJSON().usuario,
          });
          this.setState({
            grupo_privado: grupo_privado.sort((a, b) => {
              return (a.usuario<b.usuario);
            }),
            loading: false,
          }); 
        });
    });
  }

  render() {
    const { currentUser } = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca
    return (
        <View style={styles.container}>
       <Header style={{color:'black',backgroundColor:'#963BE0',width:'100%'}} >
              <Text style={{fontSize: 25,color:'white'}}>{this.props.navigation.state.params.nome_grupo_privado}</Text>  
        </Header>
        <Header style={{color:'black',backgroundColor:'#963BE0',width:'100%'}} >
        <Button vertical active style={{backgroundColor:'#963BE0',width:'25%'}} onPress={() => this.props.navigation.navigate('Posts_Privados',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>
              <Text style={{fontSize: 12,color:'white'}}>POSTS</Text>
            </Button>
        <Button style={{backgroundColor:'#963BE0',width:'33%'}} vertical active onPress={() => this.props.navigation.navigate('Gerenciar_Membros',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>
              <Text style={{fontSize: 12,color:'white'}}>GERENCIAR MEMBROS</Text>
            </Button>

            <Button vertical active style={{backgroundColor:'#963BE0',width:'25%'}} onPress={() => this.props.navigation.navigate('Eventos_Privados',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>       
              <Text style={{fontSize: 12,color:'white'}}>EVENTOS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#963BE0',width:'25%'}} onPress={() => this.props.navigation.navigate('Meus_Eventos',{nome_grupo_privado:    this.props.navigation.state.params.nome_grupo_privado,chave_seguranca: this.props.navigation.state.params.chave_seguranca})}>       
              <Text style={{fontSize: 12,color:'white'}}>MEUS EVENTOS</Text>
            </Button>
        </Header>
          <Content>
        <Form>
        <Card>
        <Item fixedLabel last > 
            <Input multiline={true} bordered placeholder='Digite o e-mail do novo membro' onChangeText={email_membro => this.setState({ email_membro })} value={this.state.email_membro}/>
         </Item>           
    
      <Item body bordered >
      <Button block light style={{color:'black',backgroundColor:'#963BE0',width:'100%'}} onPress={() => this.handleNovoMembro()}>
            <Text style={{color:'white',fontSize:20}}>Adicionar membro ao grupo</Text>
            <Icon name="add" style={{color:'white'}}/>
            </Button>
      </Item>
      </Card>
      </Form>
      <ScrollView>

<FlatList
  data={this.state.grupo_privado}
  renderItem={({item}) => {
  return (
    <Card>   
    <Item header bordered>
    <Button block light style={{color:'black',backgroundColor:'#963BE0',width:'75%'}}  >
           <Text style={{color:'white',fontSize:15}}>{item.usuario}</Text>
           </Button>
     <Button block light style={{color:'black',backgroundColor:'#DC143C',width:'25%'}}  onPress={() => this.handleExcluirMembro(item.key)}>
     <Text note style={{color:'white'}}>Excluir</Text>
    </Button>
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
    height: 240,
    width: '100%',
    backgroundColor: '#963BE0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});