import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { Badge, Header, Picker, Input, Button, Icon, Content, Footer, FooterTab, Item, Form, Card, CardItem, Left, Right, Body, Thumbnail, HeaderTab } from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';
import { firebaseDatabase } from './config'

const grupo_publico_root = firebaseDatabase.ref();
const grupo_publico_ref = grupo_publico_root.child('Grupo_Publico');
export default class Grupos_Publicos_Gerenciar extends React.Component {
  state = { currentUser: null }


  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      usuario: [],
      chave: '',
      nome_grupo: '',
      grupo_publico: [],
      categoria: '',
      categoria_pesquisa: ''
    };
  }

  static navigationOptions = (navigation) => ({
    //To hide the ActionBar/NavigationBar
    //To hide the ActionBar/NavigationBar
    title: 'Grupos Públicos',
    headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff' },
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#963BE0'
    },
  });

  onValueChange(value) {
    this.setState({
      categoria: value
    });
  }

  onValueChange1(value) {
    this.setState({
      categoria_pesquisa: value
    });
  }

  handleNovoGrupo = () => {
    const { nome_grupo, currentUser, categoria } = this.state
    if (nome_grupo == '' || categoria == '') {
      Toast.show('Um grupo precisa de um nome e um assunto!');
    } else {

      grupo_publico_ref.push({
        usuario: currentUser.email,
        nome_grupo_publico: nome_grupo,
        categoria: categoria,
        chave_seguranca: currentUser.uid + nome_grupo + categoria
      });
      Toast.show('Grupo criado com sucesso');
      this.setState({
        nome_grupo: ''
      });
    }
  }

  handleFiltro = () => {
    const { categoria_pesquisa } = this.state
    if (categoria_pesquisa == '') {
      Toast.show('Selecione um filtro!')
    } else {
      const rootGrupoPublico = firebaseDatabase.ref('Grupo_Publico').orderByChild("categoria").equalTo(categoria_pesquisa);
      rootGrupoPublico.on('value', (childSnapshot) => {
        const grupo_publico = [];
        childSnapshot.forEach((doc) => {
          grupo_publico.push({
            key: doc.key,
            usuario: doc.toJSON().usuario,
            nome_grupo_publico: doc.toJSON().nome_grupo_publico,
            chave_seguranca: doc.toJSON().chave_seguranca,
            categoria: doc.toJSON().categoria
          });
          this.setState({
            grupo_publico: grupo_publico.sort((a, b) => {
              return (a.key < b.key);
            }),
            loading: false,
          });
        });
      });
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    const rootGrupoAdm = firebaseDatabase.ref('Grupo_Publico');
    rootGrupoAdm.on('value', (childSnapshot) => {
      const grupo_publico = [];
      childSnapshot.forEach((doc) => {
        grupo_publico.push({
          key: doc.key,
          usuario: doc.toJSON().usuario,
          nome_grupo_publico: doc.toJSON().nome_grupo_publico,
          chave_seguranca: doc.toJSON().chave_seguranca,
          categoria: doc.toJSON().categoria
        });
        this.setState({
          grupo_publico: grupo_publico.sort((a, b) => {
            return (a.usuario < b.usuario);
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
              <CardItem>
                <Text>Criar grupo</Text>
              </CardItem>
              <Item fixedLabel  >
                <Text styles={backgroundColor = 'white'}>Assunto</Text>
                <Picker mode="dropdown"
                  iosHeader="Selecionar"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={this.state.categoria}
                  onValueChange={this.onValueChange.bind(this)}  >
                  <Picker.Item label="Selecione" value="Selecione" />
                  <Picker.Item label="Tecnologia da informação" value="Tecnologia da informação" />
                  <Picker.Item label="Letras" value="Letras" />
                  <Picker.Item label="Medicina" value="Medicina" />
                  <Picker.Item label="Biologia" value="Biologia" />
                  <Picker.Item label="Matemática" value="Matemática" />
                  <Picker.Item label="Odontologia" value="Odontologia" />
                </Picker>
              </Item>
              <Item fixedLabel>
                <Input multiline={true} bordered placeholder='Nome do Grupo' onChangeText={nome_grupo => this.setState({ nome_grupo })} value={this.state.nome_grupo} />
              </Item>
              <Item body bordered>
                <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} onPress={() => this.handleNovoGrupo()}>
                  <Text style={{ color: 'white', fontSize: 20 }}>Criar grupo</Text>
                  <Icon name="add" style={{ color: 'white' }} />
                </Button>
              </Item>
            </Card>
          </Form>
          <ScrollView>
            <Item header>
              <Text style={{ fontSize: 20, color: '#4F4F4F' }}>Todos os grupos publicos:</Text>
            </Item>


            <Item fixedLabel last >
              <Text styles={backgroundColor = 'white'}>Filtrar grupos por assunto:</Text>
              <Picker mode="dropdown"
                iosHeader="Selecionar"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                selectedValue={this.state.categoria_pesquisa}
                onValueChange={this.onValueChange1.bind(this)}  >
                <Picker.Item label="Sem Filtro" value="Sem Filtro" />
                <Picker.Item label="Tecnologia da informação" value="Tecnologia da informação" />
                <Picker.Item label="Letras" value="Letras" />
                <Picker.Item label="Medicina" value="Medicina" />
                <Picker.Item label="Biologia" value="Biologia" />
                <Picker.Item label="Matemática" value="Matemática" />
                <Picker.Item label="Odontologia" value="Odontologia" />
              </Picker>
              <Button onPress={this.handleFiltro}>
                <Icon name="ios-search" />
              </Button>

            </Item>
            <FlatList
              data={this.state.grupo_publico}
              renderItem={({ item }) => {
                return (
                  <Card>
                    <Item header bordered>

                      <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '100%' }} onPress={() => this.props.navigation.navigate('Grupos_Publicos', { nome_grupo_publico: item.nome_grupo_publico, chave_seguranca: item.chave_seguranca })}>
                        <Text style={{ color: 'white', fontSize: 20 }}>{item.nome_grupo_publico}
                          {'\n'}{item.categoria}</Text>
                        <Icon name="chatboxes" style={{ color: 'white' }} />
                      </Button>
                    </Item>
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