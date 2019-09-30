import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { Header, Input, Button, Icon, Content, Footer, FooterTab, Item, Form, DatePicker, Card, Thumbnail, Body } from 'native-base'
import { firebaseDatabase } from './config'
import Hyperlink from 'react-native-hyperlink'
import ImagePicker from 'react-native-image-picker';
import FilePickerManager from 'react-native-file-picker';
import Toast from 'react-native-toast-native';
import { HeaderBackButton } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

const pub_eve_root = firebaseDatabase.ref();
const pub_eve_ref = pub_eve_root.child('Eventos_Publicos');
const pub_eve_part = pub_eve_root.child('Eventos_Publicos_Participantes');
export default class Gerenciar_Eventos extends React.Component {

  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
    this.state = ({
      titulo: '',
      descricao: '',
      local_link: '',
      usuario: [],
      evento: [],
      horario: '',
    });
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


  handleNovoEvento = (nome_usuario, nome_faculdade, nome_curso, selected_heroi, emailUsuario) => {
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca
    const { titulo, currentUser, descricao, chosenDate, local_link, horario } = this.state

    if (chosenDate == '' || titulo == '' || horario == '' || local_link == '') {
      Toast.show('O evento precisa de um titulo, local, data e horario', Toast.LONG, Toast.BOTTOM, toastInfo);
    } else {
      Toast.show('Evento criado com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
      pub_eve_ref.push({
        usuario: currentUser.uid,
        usuario_grupo: currentUser.uid + this.props.navigation.state.params.nome_grupo_publico,
        nome_usuario: nome_usuario,
        titulo: titulo,
        data_evento: chosenDate.toString().substr(4, 12),
        descricao: descricao,
        local_link: local_link,
        nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico,
        nome_faculdade: nome_faculdade,
        nome_curso: nome_curso,
        selected_heroi: selected_heroi,
        emailUsuario: emailUsuario,
        horario: horario,
        chave_seguranca: this.props.navigation.state.params.chave_seguranca,
        chave_seguranca_evento: this.props.navigation.state.params.chave_seguranca + titulo + chosenDate.toString().substr(4, 12) + currentUser.uid
      });

      pub_eve_part.push({
        titulo: titulo,
        usuario_email: currentUser.email,
        nome_usuario: ('Criador') + nome_usuario,
        nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico,
        chave_seguranca: this.props.navigation.state.params.chave_seguranca,
        chave_seguranca_evento: this.props.navigation.state.params.chave_seguranca + titulo + chosenDate.toString().substr(4, 12) + currentUser.uid
      });
      Toast.show('Evento criado com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
      this.setState({
        titulo: '',
        descricao: '',
        local_link: '',
        horario: ''
      });
    }
  }

  handleApagarEvento = (key) => {
    Toast.show('Evento excluido com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
    const caminho_exclusao = firebaseDatabase.ref('Eventos_Publicos/' + key)
    caminho_exclusao.remove()
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const rootUser = firebaseDatabase.ref('Users').orderByChild("idUsuario").equalTo(currentUser.uid);
    rootUser.on('value', (childSnapshot) => {
      const usuario = [];
      childSnapshot.forEach((doc) => {
        usuario.push({
          idUsuario: doc.toJSON().idUsuario,
          nome_usuario: doc.toJSON().nome_usuario,
          nome_faculdade: doc.toJSON().nome_faculdade,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          emailUsuario: doc.toJSON().emailUsuario,
        });
        this.setState({
          usuario: usuario.sort((a, b) => {
            return (a.idUsuario < b.idUsuario);
          }),
          loading: false,
        });
      });
    });


    const rootRef = firebaseDatabase.ref('Eventos_Publicos').orderByChild("usuario_grupo").equalTo(currentUser.uid + this.props.navigation.state.params.nome_grupo_publico);
    rootRef.on('value', (childSnapshot) => {
      const evento = [];
      childSnapshot.forEach((doc) => {
        evento.push({
          key: doc.key,
          titulo: doc.toJSON().titulo,
          data_evento: doc.toJSON().data_evento,
          descricao: doc.toJSON().descricao,
          nome_grupo_publico: doc.toJSON().nome_grupo_publico,
          horario: doc.toJSON().horario,
          local_link: doc.toJSON().local_link,
        });
        this.setState({
          evento: evento.sort((a, b) => {
            return (a.data_evento > b.data_evento);
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
          <Button vertical active style={{ backgroundColor: '#963BE0', width: '33%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Eventos_Publicos', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>EVENTOS</Text>
          </Button>
          <Button vertical active style={{ backgroundColor: '#6c05da', width: '33%', elevation: 0 }} onPress={() => this.props.navigation.navigate('Gerenciar_Eventos', { nome_grupo_publico: this.props.navigation.state.params.nome_grupo_publico, chave_seguranca: this.props.navigation.state.params.chave_seguranca })}>
            <Text style={{ fontSize: 12, color: 'white' }}>MEUS EVENTOS</Text>
          </Button>
        </Header>
        <ScrollView>

          <Form style={{ marginLeft: 20, marginRight: 20 }}>
            <Card style={{ elevation: 0, borderColor: 'transparent' }}>
              <Item style={{ marginTop: 20, marginBottom: 10, borderColor: 'transparent' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', color: '#666', fontWeight: "bold" }}>Criar novo evento</Text>
              </Item>
              <Item fixedLabel>
                <Input multiline placeholderTextColor='#aaa' placeholder='Adicionar titulo' onChangeText={titulo => this.setState({ titulo })} value={this.state.titulo} />
              </Item>
              <Item>
                <Text style={{ color: "#aaa" }}>Data (MM/DD/AAAA): </Text>
                <DatePicker
                  defaultDate={new Date(2019, 8, 8)}
                  minimumDate={new Date(2019, 1, 1)}
                  maximumDate={new Date(2019, 12, 31)}
                  locale={"br"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Selecionar uma data"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "black" }}
                  onDateChange={this.setDate}
                  disabled={false}
                />
              </Item>
              <Item fixedLabel last>
                <Input placeholderTextColor='#aaa' multiline placeholder='Horario' onChangeText={horario => this.setState({ horario })} value={this.state.horario} />
              </Item>
              <Item fixedLabel last>
                <Input multiline placeholderTextColor='#aaa' placeholder='Descrição' onChangeText={descricao => this.setState({ descricao })} value={this.state.descricao} />
              </Item>
              <Item fixedLabel last>
                <Input multiline placeholderTextColor='#aaa' placeholder='Local/Link do evento' onChangeText={local_link => this.setState({ local_link })} value={this.state.local_link} />
              </Item>
              <FlatList
                data={this.state.usuario}
                renderItem={({ item }) => {
                  return (
                    <Item body bordered >
                      <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} onPress={() => this.handleNovoEvento(item.nome_usuario, item.nome_faculdade, item.nome_curso, item.selected_heroi, item.emailUsuario)}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Adicionar Evento</Text>
                        <Icon name="add" style={{ color: 'white' }} />
                      </Button>
                    </Item>
                  );
                }}>
              </FlatList>
            </Card>
          </Form>
          <Content style={{ marginLeft: 20, marginRight: 20 }}>
            <FlatList
              data={this.state.evento}
              renderItem={({ item }) => {
                return (
                  <Card style={{ padding: 5 }} >
                    <Item header bordered >
                      <Text selectable={true} style={{ fontSize: 25, color: '#4F4F4F', padding: 15 }}>{item.titulo}</Text>
                      <TouchableOpacity style={{ marginLeft: 25, marginRight: 20, shadowOffset: { width: 0, height: 0, }, backgroundColor: 'transparent', position: 'absolute', right: 0 }} onPress={() => this.handleApagarEvento(item.key)}>
                        <Text style={{ position: 'absolute', right: 40, top: 10, width: 50, color: '#888' }}>Excluir</Text>
                        <Icon name="trash" type='FontAwesome' style={{ color: '#FF6C6C', fontSize: 35, marginLeft: 0 }} />
                      </TouchableOpacity>
                    </Item>
                    <Item style={{ padding: 10 }}>
                      <Icon name="calendar" type='FontAwesome' style={{ color: '#0088C4', fontSize: 35, marginLeft: 0 }} />
                      <Text style={{ paddingTop: 15 }}>{item.horario}, {item.data_evento}{'\n'}</Text>

                    </Item>
                    <Item>
                      <Icon name="place" type='MaterialIcons' style={{ color: '#0088C4', fontSize: 35, marginLeft: 10 }} />
                      <Hyperlink linkStyle={{ color: '#2980b9', fontSize: 14 }}>
                        <Text selectable={true} style={{ paddingTop: 15 }}>Onde: {item.local_link}{'\n'}</Text>
                      </Hyperlink>
                    </Item>
                    <Text style={{ fontSize: 17, padding: 20 }}>Descrição:</Text>
                    <Text style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>{item.descricao}</Text>
                  </Card>);
              }}>
            </FlatList>
          </Content>
        </ScrollView>
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