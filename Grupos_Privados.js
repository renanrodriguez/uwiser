import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';
import {firebaseDatabase} from './config'

const pub_pri_root = firebaseDatabase.ref();
const pub_pri_ref = pub_pri_root.child('Grupo_Privado');
export default class Grupos_Privados extends React.Component {
  state = { currentUser: null }


  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      chave:'',
      nome_grupo:'',
      email1:'',
      email2:'',
      email3:'',
      grupo_privado_adm:[],
      grupo_privado:[]
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    title: "Grupos Privados",
    headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff'}, 
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#963BE0'
    },
  };


handleNovoGrupo = () => {


  const {nome_grupo,currentUser,email1,email2,email3} = this.state
  if (nome_grupo==''){
    Toast.show('Um grupo precisa de um nome!');
  }else{
    if(email1==''){
      Toast.show('Um grupo precisa ter no minimo 2 pessoas!');
    }else{
      Toast.show('Grupo criado com sucesso');
      pub_pri_ref.push({
        usuario: currentUser.email,
        nome_grupo_privado : nome_grupo,
        chave_seguranca : currentUser.uid+nome_grupo
      });
    
      if (email1 !=''){
        pub_pri_ref.push({
          usuario: email1,
          nome_grupo_privado : nome_grupo,
          chave_seguranca : currentUser.uid+nome_grupo
        });
      }
    
      if (email2 !=''){
        pub_pri_ref.push({
          usuario: email2,
          nome_grupo_privado : nome_grupo,
          chave_seguranca : currentUser.uid+nome_grupo
        });
      }
    
      if (email3 !=''){
        pub_pri_ref.push({
          usuario: email3,
          nome_grupo_privado : nome_grupo,
          chave_seguranca : currentUser.uid+nome_grupo
        });
      }

      this.setState({
        nome_grupo: '',
        email1: '',
        email2: '',
        email3: '',
      });
    }
  }
 
}

handleApagarGrupo = (key) => {
  const caminho_exclusao = firebaseDatabase.ref('Grupo_Privado/'+key)
  caminho_exclusao.remove()
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const rootGrupoAdm = firebaseDatabase.ref('Grupo_Privado').orderByChild("usuario").equalTo(currentUser.email);
    rootGrupoAdm.on('value', (childSnapshot) => {
      const grupo_privado_adm = [];
      childSnapshot.forEach((doc) => {
        grupo_privado_adm.push({
          key: doc.key,
          usuario: doc.toJSON().usuario,
          nome_grupo_privado: doc.toJSON().nome_grupo_privado,
          chave_seguranca : doc.toJSON().chave_seguranca
          });
          this.setState({
            grupo_privado_adm: grupo_privado_adm.sort((a, b) => {
              return (a.usuario<b.usuario);
            }),
            loading: false,
          }); 
        });
    });

  }

  render() {
    const { currentUser } = this.state
    return (
        <View style={styles.container}>    
          <Content>
          <Form>
            <Card>
            <Item fixedLabel> 
            <Input multiline={true} bordered placeholder='Nome do Grupo' onChangeText={nome_grupo => this.setState({ nome_grupo })} value={this.state.nome_grupo}/>
             </Item>
             <Item fixedLabel> 
            <Input multiline={true} bordered placeholder='Email membro 1' onChangeText={email1 => this.setState({ email1 })} value={this.state.email1}/>
             </Item>
             <Item fixedLabel> 
            <Input multiline={true} bordered placeholder='Email membro 2' onChangeText={email2 => this.setState({ email2 })} value={this.state.email2}/>
             </Item>
             <Item fixedLabel> 
            <Input multiline={true} bordered placeholder='Email membro 3' onChangeText={email3 => this.setState({ email3 })} value={this.state.email3}/>
             </Item>
     <Item body bordered>
      <Button block light style={{color:'black',backgroundColor:'#963BE0',width:'100%'}} onPress={() => this.handleNovoGrupo()}>
            <Text style={{color:'white',fontSize:20}}>Criar grupo</Text>
            <Icon name="add" style={{color:'white'}}/>
            </Button>
      </Item> 
            </Card>
            </Form>
   <ScrollView>
    <Item header>
     <Text style={{fontSize: 20,color:'#4F4F4F'}}>Seus grupos:</Text> 
    </Item>
      <FlatList
      data={this.state.grupo_privado_adm}
      renderItem={({item}) => {
    return (
      <Card>   
     <Item header bordered>
     <Button block light style={{color:'black',backgroundColor:'#963BE0',width:'75%'}}  onPress={() => this.props.navigation.navigate('Posts_Privados', {nome_grupo_privado: item.nome_grupo_privado,chave_seguranca:item.chave_seguranca })}>
            <Text style={{color:'white',fontSize:20}}>{item.nome_grupo_privado}</Text>
            <Icon name="chatboxes" style={{color:'white'}}/>
            </Button>
      <Button block light style={{color:'black',backgroundColor:'#DC143C',width:'25%'}}  onPress={() => this.handleApagarGrupo(item.key)}>
      <Text note style={{color:'white'}}>Sair do grupo</Text>
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