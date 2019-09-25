import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Header, Input, Button, Body, Icon, Content, Footer, FooterTab, Card, CardItem, Thumbnail, Right, Left, Container, Form, Item, Picker, Textarea } from 'native-base'
import { firebaseDatabase } from './config'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';

const pri_eve_root = firebaseDatabase.ref();
const pri_eve_part = pri_eve_root.child('Eventos_Privados_Participantes');
var global = ''
export default class Eventos_Privados extends React.Component {

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
    title: navigation.state.params.nome_grupo_privado,
    headerTitleStyle: { color: '#fff' },
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#963BE0'
    },
  });

  handleConfirmarPresenca = (chave_seguranca_evento, titulo, data_evento) => {

    const { currentUser } = this.state
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca

    if (chave_seguranca_evento == this.props.navigation.state.params.chave_seguranca + titulo + data_evento + currentUser.uid) {
      Toast.show('Como criador do evento, você já fez check-in')
    } else {
      if (global == '') {
        Toast.show('Check-in realizado com sucesso')
        pri_eve_part.push({
          titulo: titulo,
          usuario_email: currentUser.email,
          nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado,
          chave_seguranca: this.props.navigation.state.params.chave_seguranca,
          chave_seguranca_evento: chave_seguranca_evento
        });
        global = chave_seguranca_evento + currentUser.uid
      } else {
        if (global = chave_seguranca_evento + currentUser.uid) {
          Toast.show('Você já realizou check-in nesse evento, seu nome está na lista de confirmados!')
        }
      }
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca

    const rootPub = firebaseDatabase.ref('Eventos_Privados').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);
    rootPub.on('value', (childSnapshot) => {
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
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca

    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#6c05da" style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} >
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '25%' }} onPress={() => this.props.navigation.navigate('Posts_Privados', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>POSTS</Text>
          </Button>
          <Button style={{ backgroundColor: '#963BE0', width: '33%' }} vertical active onPress={() => this.props.navigation.navigate('Gerenciar_Membros', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>GERENCIAR MEMBROS</Text>
          </Button>

          <Button vertical active style={{ backgroundColor: '#963BE0', width: '25%' }} onPress={() => this.props.navigation.navigate('Eventos_Privados', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>EVENTOS</Text>
          </Button>
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '25%' }} onPress={() => this.props.navigation.navigate('Meus_Eventos', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>MEUS EVENTOS</Text>
          </Button>
        </Header>
        <Content>
          <FlatList
            data={this.state.eventos}
            renderItem={({ item }) => {
              return (
                <Card >
                  <Item header bordered >
                    <Text selectable={true} style={{ fontSize: 18, color: '#4F4F4F' }}>{item.titulo}</Text>
                  </Item>
                  <Item>
                    <Text selectable={true} style={{ fontSize: 14, color: '#4F4F4F', width: '50%' }}>
                      Criador: {item.nome_usuario}{'\n'}
                      Quando: {item.horario}, {item.data_evento}{'\n'}
                      Onde: {item.local_link}{'\n'}
                      Descrição: {item.descricao}
                    </Text>
                    <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '25%', height: '100%' }} onPress={() => this.handleConfirmarPresenca(item.chave_seguranca_evento, item.titulo, item.data_evento)} >
                      <Text style={{ color: 'white', fontSize: 15 }}>Realizar check-in</Text>
                    </Button>
                    <Button block light style={{ color: 'black', backgroundColor: '#DC143C', width: '25%', height: '100%' }} onPress={() => this.props.navigation.navigate('Lista_Confirmados', { nome_grupo_privado: this.props.navigation.state.params.nome_grupo_privado, chave_seguranca_evento: item.chave_seguranca_evento, nome_evento: item.titulo })}>
                      <Text note style={{ color: 'white', fontSize: 15 }}>Visualizar confirmados</Text>
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