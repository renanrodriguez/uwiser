import React from 'react'
import { StyleSheet, StatusBar, View, Text, FlatList, TouchableOpacity, AsyncStorage, Image } from 'react-native'
import { Header, Input, Button, Icon, Content, Footer, FooterTab, Form, Item, Label, Card, CardItem, Body, Thumbnail } from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';
import { firebaseDatabase } from './config'
import Hyperlink from 'react-native-hyperlink'
import ImagePicker from 'react-native-image-picker';

const tarefa_root = firebaseDatabase.ref();
const tarefa_ref = tarefa_root.child('tarefa');

const options = {
  title: 'Tire uma foto ou escolha da galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Anotacoes extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      titulo: '',
      errorMessage: null,
      currentUser: null,
      descricao: '',
      tarefa: [],
      data_atual: '',
      validacao_imagem: '',
      imgSource: '',
      images: [],
    });
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    title: "Anotações",
    headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff' },
    headerStyle: {
      backgroundColor: '#963BE0'
    },
  };

  handleCadastroTarefa = (nome_usuario, nome_faculdade, nome_curso, selected_heroi, emailUsuario) => {
    const { titulo, currentUser, descricao, data_atual } = this.state
    if (titulo == '' && this.state.validacao_imagem == '') {
      Toast.show('Coloque um texto ou foto na sua anotação', Toast.LONG, Toast.BOTTOM, toastInfo);
    } else {
      if (titulo != '' && this.state.validacao_imagem == '') {
        tarefa_ref.push({
          usuario: currentUser.uid,
          titulo_tarefa: titulo,
          descricao_tarefa: descricao,
          data_inclusao: data_atual
        });
        this.setState({
          titulo: '',
          descricao: ''
        });
        Toast.show('Publicação realizada com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
      } else {
        var publicar = 0;
        var randomNumber = Math.floor(Math.random() * 1000) / Math.random() + 1;
        const ext = this.state.imageUri.split('.').pop(); // Extract image extension
        const filename = `${randomNumber}.${ext}`; // Generate unique name
        this.setState({ uploading: true });
        firebase.storage().ref('images/' + filename).putFile(this.state.imageUri).on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            let state = {};

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            Toast.show('Progresso anotação:' + progress + '%', Toast.SHORT, Toast.BOTTOM, toastInfo);

            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              if (publicar == 0) {
                const allImages = this.state.images;
                allImages.push(snapshot.downloadURL);
                tarefa_ref.push({
                  usuario: currentUser.uid,
                  titulo_tarefa: titulo,
                  descricao_tarefa: descricao,
                  data_inclusao: data_atual,
                  urlImagem: snapshot.downloadURL
                });
                publicar = 1;
                Toast.show('Publicação realizada com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
                state = {
                  ...state,
                  uploading: false,
                  imgSource: '',
                  imageUri: '',
                  progress: 0,
                  images: allImages,
                  validacao_imagem: ''
                };
                AsyncStorage.setItem('images', JSON.stringify(allImages));
              }
              this.setState(state);
              this.setState({
                titulo: '',
                descricao: ''
              });
            }

          },
          error => {
            unsubscribe();
            Toast.show('Ocorreu um erro tente de novo', Toast.LONG, Toast.BOTTOM, toastErro);
          }
        );
      }

    }

  }

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // Toast.show('Você fechou a opção de imagens');
      } else if (response.error) {
        Toast.show(('O seguinte erro aconteceu: ', response.error), Toast.LONG, Toast.BOTTOM, toastErro);
      } else {
        const source = { uri: response.uri };
        this.setState({
          imgSource: source,
          imageUri: response.uri,
          validacao_imagem: 'valido'
        });
      }
    });
  };

  handleApagarTarefa = (key) => {
    Toast.show('Item excluido com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
    const caminho_exclusao = firebaseDatabase.ref('tarefa/' + key)
    caminho_exclusao.remove()
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

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    const rootRef = firebaseDatabase.ref('tarefa').orderByChild("usuario").equalTo(currentUser.uid);
    rootRef.on('value', (childSnapshot) => {
      const tarefa = [];
      childSnapshot.forEach((doc) => {
        tarefa.push({
          key: doc.key,
          titulo_tarefa: doc.toJSON().titulo_tarefa,
          usuario: doc.toJSON().usuario,
          descricao_tarefa: doc.toJSON().descricao_tarefa,
          data_inclusao: doc.toJSON().data_inclusao,
          urlImagem: doc.toJSON().urlImagem
        });
        this.setState({
          tarefa: tarefa.sort((a, b) => {
            return (a.key < b.key);
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
        <Form>
          <Item fixedLabel>
            <Input multiline placeholder='Digite aqui o titulo' onChangeText={titulo => this.setState({ titulo })} value={this.state.titulo} />
          </Item>
          <Item fixedLabel last>
            <Input multiline placeholder='Digite aqui a descrição' onChangeText={descricao => this.setState({ descricao })} value={this.state.descricao} />
          </Item>
        </Form>
        <Item>
          <Button block light style={{ color: 'black', backgroundColor: '#963BE0', width: '60%' }} onPress={this.handleCadastroTarefa}>
            <Icon name="add" style={{ color: 'white', marginLeft: 0 }} />
            <Text style={{ color: 'white', fontSize: 20 }}>Adicionar</Text>
          </Button>
          <Button transparent block light style={{ color: 'black', backgroundColor: 'transparent', width: '40%' }} onPress={this.pickImage}>
            <Icon name="camera" style={{ color: 'gray' }} />
          </Button>
          <Button block transparent light style={{color:'black',backgroundColor:'#00ced1',width:'20%'}} >
            <Icon name="paper" style={{color:'white'}}/>
        </Button>
        </Item>


        {this.state.imgSource ? (
          <Image source={this.state.imgSource} style={styles.image} />) : (null)}

        <Content>

          <FlatList
            data={this.state.tarefa}
            renderItem={({ item }) => {
              return (
                <Card >
                  <CardItem header bordered >
                    <Text selectable={true} style={{ fontSize: 25, color: 'black' }}>{item.titulo_tarefa}</Text>
                    <TouchableOpacity style={{ marginLeft: 25, marginRight: 20, shadowOffset: { width: 0, height: 0, }, backgroundColor: 'transparent', position: 'absolute', right: 10 }} onPress={() => this.handleApagarTarefa(item.key)}>
                      <Text style={{ position: 'absolute', right: 40, top: 10, width: 50, color: '#888' }}>Excluir</Text>
                      <Icon name="trash" type='FontAwesome' style={{ color: '#FF6C6C', fontSize: 35, marginLeft: 0 }} />
                    </TouchableOpacity>
                  </CardItem>

                  {item.descricao_tarefa ? (
                    <CardItem>
                      <Body>
                        <Hyperlink linkStyle={{ color: '#2980b9', fontSize: 20 }}>
                          <Text selectable={true} style={{ fontSize: 20, color: '#4F4F4F' }}>{item.descricao_tarefa}</Text>
                        </Hyperlink>
                      </Body>
                    </CardItem>) : (null)}


                  {item.urlImagem ? (
                    <CardItem>
                      <Thumbnail square source={{ uri: item.urlImagem }} style={styles.image_post} />
                    </CardItem>) : (null)}
                  <CardItem footer>
                    <Text selectable={true} style={{ fontSize: 10, color: 'grey' }}>Data inclusão: {item.data_inclusao}</Text>
                  </CardItem>
                </Card>);
            }}>
          </FlatList>

        </Content>
      </View>
    )
  }
}

const toastErro = {
  backgroundColor: "#FF6C6C",
  height: 200,
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