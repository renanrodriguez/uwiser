import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Header, Input, Button, Body, Icon, Content, Footer, FooterTab, Card, CardItem, Thumbnail, Right, Left, Container, Form, Item, Picker, Textarea } from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import { firebaseDatabase } from './config'
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import FilePickerManager from 'react-native-file-picker';
import Toast from 'react-native-toast-native';
import { HeaderBackButton } from 'react-navigation';

const pub_eve_root = firebaseDatabase.ref();
const pub_eve_part = pub_eve_root.child('Eventos_Publicos_Participantes');
var global = ''

export default class Eventos_Publicos extends React.Component {

  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      eventos: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    //To hide the ActionBar/NavigationBar
    title: navigation.state.params.nome_grupo_publico,
    headerTitleStyle: { color: '#fff' },
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#963BE0'
    },

    headerLeft: (<HeaderBackButton tintColor='#fff' onPress={() => { navigation.navigate('tab') }} />)

  });


  handleConfirmarPresenca = (chave_seguranca_evento, titulo, data_evento) => {

    const { currentUser } = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca

    if (chave_seguranca_evento == this.props.navigation.state.params.chave_seguranca + titulo + data_evento + currentUser.uid) {
      Toast.show('Como criador do evento, você já fez check-in', Toast.LONG, Toast.BOTTOM, toastInfo);
    } else {
      if (global == '') {
        Toast.show('Check-in realizado com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
        pub_eve_part.push({
          titulo: titulo,
          usuario_email: currentUser.email,
          nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico,
          chave_seguranca: this.props.navigation.state.params.chave_seguranca,
          chave_seguranca_evento: chave_seguranca_evento
        });
        global = chave_seguranca_evento + currentUser.uid
      } else {
        if (global = chave_seguranca_evento + currentUser.uid) {
          Toast.show('Você já realizou check-in nesse evento, seu nome está na lista de confirmados!', Toast.LONG, Toast.BOTTOM, toastInfo);
        }
      }
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca

    const rootPosts = firebaseDatabase.ref('Eventos_Publicos').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);
    rootPosts.on('value', (childSnapshot) => {
      const eventos = [];
      childSnapshot.forEach((doc) => {
        eventos.push({
          usuario: doc.toJSON().usuario,
          nome_usuario: doc.toJSON().nome_usuario,
          titulo: doc.toJSON().titulo,
          data_evento: doc.toJSON().data_evento,
          horario: doc.toJSON().horario,
          descricao: doc.toJSON().descricao,
          local_link: doc.toJSON().local_link,
          nome_grupo_publico: doc.toJSON().nome_grupo_publico,
          nome_faculdade: doc.toJSON().nome_faculdade,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          chave_seguranca_evento: doc.toJSON().chave_seguranca_evento
        });
        this.setState({
          eventos: eventos.sort((a, b) => {
            return (a.data_evento < b.data_evento);
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
    this.props.navigation.state.params.chave_seguranca
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#963BE0" style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} >
          <Button style={{ backgroundColor: '#963BE0', width: '33%', elevation: 0 }} vertical active onPress={() => this.props.navigation.navigate('Grupos_Publicos', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>POSTS</Text>
          </Button>
          <Button vertical active style={{ backgroundColor: '#6c05da', width: '33%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Eventos_Publicos', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>EVENTOS</Text>
          </Button>
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '33%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Gerenciar_Eventos', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>MEUS EVENTOS</Text>
          </Button>
        </Header>
        <Content style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <FlatList
            data={this.state.eventos}
            renderItem={({ item }) => {
              return (
                <Card style={{ elevation: 0, borderColor: 'transparent', marginTop: 20 }} >
                  <Item header bordered >
                    <Text selectable={true} style={{ fontSize: 28, fontWeight: 'bold', color: '#4F4F4F' }}>{item.titulo}</Text>
                  </Item>
                  <Item style={{ flexDirection: 'column', alignItems: 'flex-start' , padding:20}}>
                    <Text selectable={true} style={{ fontSize: 14, color: '#4F4F4F ' }}>
                      Criador: {item.nome_usuario}{'\n'}
                    </Text>
                    <Text selectable={true} style={{ fontSize: 14, color: '#4F4F4F' }}>
                      Quando: {item.horario}, {item.data_evento}{'\n'}
                    </Text>
                    <Text selectable={true} style={{ fontSize: 14, color: '#4F4F4F' }}>
                      Onde: {item.local_link}{'\n'}
                    </Text>
                    <Text selectable={true} style={{ fontSize: 14, color: '#4F4F4F' }}>
                      Descrição: {item.descricao}
                    </Text>
                  </Item>
                  <Item style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button block light style={{ color: 'black', width: '50%', backgroundColor: '#963BE0', width: '50%', height: '100%', padding: 10 }} onPress={() => this.handleConfirmarPresenca(item.chave_seguranca_evento, item.titulo, item.data_evento)} >
                      <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>Realizar check-in</Text>
                    </Button>
                    <Button block light style={{ color: 'black', backgroundColor: '#0088C4', width: '25%', width: '50%', height: '100%', padding: 10 }} onPress={() => this.props.navigation.navigate('Lista_Confirmados_Publica', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca_evento: item.chave_seguranca_evento, nome_evento: item.titulo })}>
                      <Text note style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>Visualizar confirmados</Text>
                    </Button>
                  </Item>
                </Card>);
            }}>
          </FlatList>

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
  height: 200,
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
});