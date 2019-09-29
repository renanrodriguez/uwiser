import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { Badge, Header, Input, Button, Icon, Content, Footer, FooterTab, Item, Form, Card, CardItem, Left, Right, Body, Thumbnail, HeaderTab } from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';
import { firebaseDatabase } from './config'
import { HeaderBackButton } from 'react-navigation';

const pub_pri_root = firebaseDatabase.ref();
const pub_pri_ref = pub_pri_root.child('Grupo_Privado');
export default class Gerenciar_Membros extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      usuario: [],
      email_membro: '',
      grupo_privado: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    //To hide the ActionBar/NavigationBar
    title: navigation.state.params.nome_grupo_privado,
    headerTitleStyle: { color: '#fff' },
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#963BE0'
    },

    headerLeft: (<HeaderBackButton tintColor='#fff' onPress={() => { navigation.navigate('tab') }} />)

  });


  handleNovoMembro = () => {
    const { currentUser, email_membro } = this.state
    const { navigate } = this.props.navigation;
    if (currentUser.uid + this.props.navigation.state.params.nome_grupo_privado != this.props.navigation.state.params.chave_seguranca) {
      Toast.show('Apenas o criador do grupo pode adicionar novos membros', Toast.LONG, Toast.BOTTOM, toastInfo);
    } else {
      pub_pri_ref.push({
        usuario: email_membro,
        nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado,
        chave_seguranca: this.props.navigation.state.params.chave_seguranca
      });
      Toast.show('Novo membro adicionado com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
      this.setState({
        email_membro: ''
      });
    }
  }


  handleExcluirMembro = (key) => {
    const { currentUser, email_membro } = this.state
    const { navigate } = this.props.navigation;
    if (currentUser.uid + this.props.navigation.state.params.nome_grupo_privado != this.props.navigation.state.params.chave_seguranca) {
      Toast.show('Apenas o criador do grupo pode excluir membros', Toast.LONG, Toast.BOTTOM, toastInfo);

    } else {
      Toast.show('Membro excluido com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
      const caminho_exclusao = firebaseDatabase.ref('Grupo_Privado/' + key)
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
            return (a.usuario < b.usuario);
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

        <Header androidStatusBarColor="#963BE0" style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} >
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '20%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Posts_Privados', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>POSTS</Text>
          </Button>
          <Button style={{ backgroundColor: '#6c05da', width: '33%', elevation: 0 }} vertical active onPress={() => this.props.navigation.navigate('Gerenciar_Membros', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>GERENCIAR MEMBROS</Text>
          </Button>

          <Button vertical active style={{ backgroundColor: '#963BE0', width: '25%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Eventos_Privados', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>EVENTOS</Text>
          </Button>
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '25%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Meus_Eventos', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>MEUS EVENTOS</Text>
          </Button>
        </Header>
        <Content>
          <Form style={{ marginLeft: 20, marginRight: 20 }}>
            <Card style={{ elevation: 0, borderColor: 'transparent', marginBottom: 20 }}>
              <Item style={{ marginTop: 30, marginBottom: 10, borderColor: 'transparent' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', color: '#666', fontWeight: "bold" }}>Adicionar novo membro</Text>
              </Item>
              <Item fixedLabel last >
                <Input multiline={true} bordered placeholder='Digite o e-mail do novo membro' onChangeText={email_membro => this.setState({ email_membro })} value={this.state.email_membro} />
              </Item>

              <Item body bordered >
                <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} onPress={() => this.handleNovoMembro()}>
                  <Text style={{ color: 'white', fontSize: 20 }}>Adicionar ao grupo</Text>
                  <Icon name="add" style={{ color: 'white' }} />
                </Button>
              </Item>
            </Card>
          </Form>
          <ScrollView>
            <Item style={{ marginTop: 30, borderColor: 'transparent' }} header>
              <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold', marginLeft: 20, marginRight: 20, marginBottom: 20, color: '#666' }}>Membros no grupo:</Text>
            </Item>
            <FlatList
              style={{ marginLeft: 20, marginRight: 20 }}
              data={this.state.grupo_privado}
              renderItem={({ item }) => {
                return (
                  <Card style={{ borderColor: 'transparent', elevation: 0 }}>
                    <TouchableOpacity style={{ color: 'black', backgroundColor: '#F7F7F7', marginTop: 10, elevation: 2, width: '100%', justifyContent: 'flex-start', borderRadius: 10, borderColor: '#ccc' }}>
                      <Text style={{ color: '#666', fontSize: 15, paddingLeft: 10, paddingTop: 20, paddingBottom: 20 }}>{item.usuario}</Text>
                    </TouchableOpacity>
                    <Button block light style={{ position: 'absolute', top: 10, right: 0, color: 'black', backgroundColor: '#ddd', width: '25%', borderRadius: 10 }} onPress={() => this.handleExcluirMembro(item.key)}>
                      <Text note style={{ color: 'white' }}>Excluir</Text>
                    </Button>
                  </Card>
                );
              }}>
            </FlatList>
          </ScrollView>
        </Content>
      </View>
    )
  }
}


const toastErro = {
  backgroundColor: "#001FA9",
  color: "#ffffff",
  fontSize: 17,
  borderRadius: 100,
  yOffset: 200
};

const toastSucesso = {
  backgroundColor: "#0A9300",
  height: 150,
  color: "#ffffff",
  fontSize: 17,
  borderRadius: 100,
  yOffset: 200
};

const toastInfo = {
  backgroundColor: "#001FA9",
  height: 150,
  color: "#ffffff",
  fontSize: 17,
  borderRadius: 100,
  yOffset: 200
};


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
    height: 240,
    width: '100%',
    backgroundColor: '#963BE0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
});