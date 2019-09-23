import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, FlatList, AsyncStorage, Linking } from 'react-native'
import { Badge, Header, Input, Button, Body, Icon, Content, Footer, FooterTab, Card, CardItem, Thumbnail, Right, Left, Container, Form, Item, Picker, Textarea } from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import { firebaseDatabase, firebaseStorage } from './config'
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import FilePickerManager from 'react-native-file-picker';
import Toast from 'react-native-toast-native';

const post_root = firebaseDatabase.ref();
const post_ref = post_root.child('post');

const options = {
  title: 'Tire uma foto ou escolha da galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Main extends React.Component {
  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      categoria: 'Sem assunto',
      texto_post: '',
      data_atual: '',
      usuario: [],
      posts: [],
      categoria_pesquisa: '',
      imgSource: '',
      images: [],
      files: [],
      validacao_imagem: '',
      validacao_file: '',
      fileSource: ''
    };
  }

  handleNovoPost = (nome_usuario, nome_faculdade, nome_curso, selected_heroi, emailUsuario) => {
    const { categoria, texto_post, currentUser, data_atual } = this.state
    if (texto_post == '' && this.state.validacao_imagem == '' && (this.state.validacao_file == '' || this.state.validacao_file == 'valido')) {
      Toast.show('Insira um texto ou foto na sua publicação', Toast.LONG, Toast.BOTTOM, toastErro);
    }
    /*Publicação apenas texto */
    if (texto_post != '' && this.state.validacao_imagem == '' && this.state.validacao_file == '') {
      post_ref.push({
        usuario: currentUser.uid,
        categoria: categoria,
        texto_post: texto_post,
        data_inclusao: data_atual,
        nome_usuario: nome_usuario,
        nome_faculdade: nome_faculdade,
        nome_curso: nome_curso,
        selected_heroi: selected_heroi,
        emailUsuario: emailUsuario,
        chave_seguranca_comentarios: currentUser.uid + data_atual + texto_post
      });
      this.setState({
        texto_post: ''
      });
      Toast.show('Publicação realizada com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
    }
    /*Publicação imagem e/ou texto */
    if (this.state.validacao_imagem == 'valido' && this.state.validacao_file == '') {
      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000) / Math.random() + 1;
      const ext = this.state.imageUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('images/' + randomNumber).putFile(this.state.imageUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Progresso postagem:' + progress + '%', Toast.SHORT, Toast.BOTTOM, toastInfo);

          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            if (publicar == 0) {
              const allImages = this.state.images;
              allImages.push(snapshot.downloadURL);
              post_ref.push({
                usuario: currentUser.uid,
                categoria: categoria,
                texto_post: texto_post,
                data_inclusao: data_atual,
                nome_usuario: nome_usuario,
                nome_faculdade: nome_faculdade,
                nome_curso: nome_curso,
                selected_heroi: selected_heroi,
                emailUsuario: emailUsuario,
                urlImagem: snapshot.downloadURL,
                chave_seguranca_comentarios: currentUser.uid + data_atual + texto_post + snapshot.downloadURL
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
            this.setState({
              texto_post: ''
            });
            this.setState(state);
          }

        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo', Toast.LONG, Toast.BOTTOM, toastErro);
        }
      );
    }

    /*Publicação imagem e arquivo */
    if (this.state.validacao_imagem == 'valido' && this.state.validacao_file == 'valido') {

      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000) / Math.random() + 1;
      const ext = this.state.imageUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('images/' + randomNumber).putFile(this.state.imageUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Fazendo Upload:' + progress + '%', Toast.SHORT, Toast.BOTTOM, toastInfo);

          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {

            var randomNumber = Math.floor(Math.random() * 1000) / Math.random() + 1;
            const ext = this.state.fileUri.split('.').pop(); // Extract image extension
            const filename = `${randomNumber}.${ext}`; // Generate unique name
            this.setState({ uploading: true });
            firebase.storage().ref('file/' + filename).putFile(this.state.fileUri).on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot2 => {
                let state = {};

                var progress = (snapshot2.bytesTransferred / snapshot2.totalBytes) * 100;
                Toast.show('Fazendo Upload:' + progress + '%', Toast.SHORT, Toast.BOTTOM, toastInfo);

                if (snapshot2.state === firebase.storage.TaskState.SUCCESS) {
                  if (publicar == 0) {
                    const allImages = this.state.images;
                    allImages.push(snapshot.downloadURL);
                    const allFiles = this.state.files;
                    allFiles.push(snapshot2.downloadURL);
                    post_ref.push({
                      usuario: currentUser.uid,
                      categoria: categoria,
                      texto_post: texto_post,
                      data_inclusao: data_atual,
                      nome_usuario: nome_usuario,
                      nome_faculdade: nome_faculdade,
                      nome_curso: nome_curso,
                      selected_heroi: selected_heroi,
                      emailUsuario: emailUsuario,
                      urlImagem: snapshot.downloadURL,
                      urlFile: snapshot2.downloadURL,
                      chave_seguranca_comentarios: currentUser.uid + data_atual + texto_post + snapshot.downloadURL
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
                      validacao_imagem: '',
                      fileSource: '',
                      fileUri: '',
                      files: allFiles,
                      validacao_file: ''
                    };
                    AsyncStorage.setItem('images', JSON.stringify(allImages));
                    AsyncStorage.setItem('files', JSON.stringify(allFiles));
                  }
                  this.setState({
                    texto_post: ''
                  });
                  this.setState(state);
                }
              }
            )

          }
        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo', Toast.LONG, Toast.BOTTOM, toastErro);
        }
      );
    }

    if (this.state.validacao_imagem == '' && this.state.validacao_file == 'valido' && this.state.texto_post != '') {
      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000) / Math.random() + 1;
      const ext = this.state.fileUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('file/' + filename).putFile(this.state.fileUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Publicando:' + progress + '%', Toast.SHORT, Toast.BOTTOM, toastInfo);

          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            if (publicar == 0) {
              const allFiles = this.state.files;
              allFiles.push(snapshot.downloadURL);
              post_ref.push({
                usuario: currentUser.uid,
                categoria: categoria,
                texto_post: texto_post,
                data_inclusao: data_atual,
                nome_usuario: nome_usuario,
                nome_faculdade: nome_faculdade,
                nome_curso: nome_curso,
                selected_heroi: selected_heroi,
                emailUsuario: emailUsuario,
                urlFile: snapshot.downloadURL,
                chave_seguranca_comentarios: currentUser.uid + data_atual + texto_post + snapshot.downloadURL
              });
              publicar = 1;
              Toast.show('Publicação realizada com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
              state = {
                ...state,
                uploading: false,
                fileSource: '',
                fileUri: '',
                progress: 0,
                files: allFiles,
                validacao_file: ''
              };
              AsyncStorage.setItem('files', JSON.stringify(allFiles));
            }
            this.setState({
              texto_post: ''
            });
            this.setState(state);
          }
        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo', Toast.LONG, Toast.BOTTOM, toastErro);
        }
      );
    }
  }

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        //Toast.show('Você fechou a opção de imagens');
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

  pickFile = () => {
    FilePickerManager.showFilePicker(null, (response) => {


      if (response.didCancel) {
        //Toast.show('Você fechou a opção de escolha de arquivos');
      }
      else if (response.error) {
        Toast.show(('O seguinte erro aconteceu: ', response.error), Toast.LONG, Toast.BOTTOM, toastErro);
      }
      else {
        const source = { uri: response.uri };
        this.setState({
          fileSource: source,
          fileUri: response.uri,
          validacao_file: 'valido'
        });
      }
    });
  };



  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };



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


  handleApagarPost = (key) => {
    Toast.show('Item excluido com sucesso', Toast.LONG, Toast.BOTTOM, toastSucesso);
    const caminho_exclusao = firebaseDatabase.ref('post/' + key)
    caminho_exclusao.remove()
  }

  handleFiltro = () => {
    const { categoria_pesquisa } = this.state
    if (categoria_pesquisa == 'Sem Filtro') {
      const rootPosts = firebaseDatabase.ref('post');
      rootPosts.on('value', (childSnapshot) => {
        const posts = [];
        childSnapshot.forEach((doc) => {
          posts.push({
            key: doc.key,
            usuario: doc.toJSON().usuario,
            categoria: doc.toJSON().categoria,
            texto_post: doc.toJSON().texto_post,
            data_inclusao: doc.toJSON().data_inclusao,
            nome_usuario: doc.toJSON().nome_usuario,
            nome_faculdade: doc.toJSON().nome_curso,
            nome_curso: doc.toJSON().nome_curso,
            selected_heroi: doc.toJSON().selected_heroi,
            emailUsuario: doc.toJSON().emailUsuario,
            urlImagem: doc.toJSON().urlImagem,
            urlFile: doc.toJSON().urlFile,
            chave_seguranca_comentarios: doc.toJSON().chave_seguranca_comentarios
          });
          this.setState({
            posts: posts.sort((a, b) => {
              return (a.key < b.key);
            }),
            loading: false,
          });
        });
      });
    } else {
      const rootPosts = firebaseDatabase.ref('post').orderByChild("categoria").equalTo(categoria_pesquisa);
      rootPosts.on('value', (childSnapshot) => {
        const posts = [];
        childSnapshot.forEach((doc) => {
          posts.push({
            key: doc.key,
            usuario: doc.toJSON().usuario,
            categoria: doc.toJSON().categoria,
            texto_post: doc.toJSON().texto_post,
            data_inclusao: doc.toJSON().data_inclusao,
            nome_usuario: doc.toJSON().nome_usuario,
            nome_faculdade: doc.toJSON().nome_curso,
            nome_curso: doc.toJSON().nome_curso,
            selected_heroi: doc.toJSON().selected_heroi,
            emailUsuario: doc.toJSON().emailUsuario,
            urlImagem: doc.toJSON().urlImagem,
            urlFile: doc.toJSON().urlFile,
            chave_seguranca_comentarios: doc.toJSON().chave_seguranca_comentarios
          });
          this.setState({
            posts: posts.sort((a, b) => {
              return (a.key < b.key);
            }),
            loading: false,
          });
        });
      });
    }

  }

  componentDidMount() {
    let images;
    AsyncStorage.getItem('images')
      .then(data => {
        images = JSON.parse(data) || [];
        this.setState({
          images: images
        });
      })
      .catch(error => {
        Toast.show(error, Toast.LONG, Toast.BOTTOM, toastErro);
      });

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

    const rootUser = firebaseDatabase.ref('Users').orderByChild("idUsuario").equalTo(currentUser.uid);
    rootUser.on('value', (childSnapshot) => {
      const usuario = [];
      childSnapshot.forEach((doc) => {
        usuario.push({
          key: doc.key,
          idUsuario: doc.toJSON().idUsuario,
          nome_usuario: doc.toJSON().nome_usuario,
          nome_faculdade: doc.toJSON().nome_faculdade,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          emailUsuario: doc.toJSON().emailUsuario,
        });
        this.setState({
          usuario: usuario.sort((a, b) => {
            return (a.key < b.key);
          }),
          loading: false,
        });
      });
    });


    const rootPosts = firebaseDatabase.ref('post');
    rootPosts.on('value', (childSnapshot) => {
      const posts = [];
      childSnapshot.forEach((doc) => {
        posts.push({
          key: doc.key,
          usuario: doc.toJSON().usuario,
          categoria: doc.toJSON().categoria,
          texto_post: doc.toJSON().texto_post,
          data_inclusao: doc.toJSON().data_inclusao,
          nome_usuario: doc.toJSON().nome_usuario,
          nome_faculdade: doc.toJSON().nome_curso,
          nome_curso: doc.toJSON().nome_curso,
          selected_heroi: doc.toJSON().selected_heroi,
          emailUsuario: doc.toJSON().emailUsuario,
          urlImagem: doc.toJSON().urlImagem,
          urlFile: doc.toJSON().urlFile,
          chave_seguranca_comentarios: doc.toJSON().chave_seguranca_comentarios
        });
        this.setState({
          posts: posts.sort((a, b) => {
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
      <Container style={styles.container}>
        <Header androidStatusBarColor="#6c05da" searchBar style={{
          backgroundColor: '#fff', margin: 15, marginBottom: 5, marginTop: 10, borderRadius: 100, shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
          <Item fixedLabel last >
            <Text style={{ paddingLeft: 10 }}>Filtre por assunto:</Text>
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
            <TouchableOpacity onPress={this.handleFiltro}>
              <Icon name="ios-search" />
            </TouchableOpacity>

          </Item>
        </Header>
        <Content style={{ margin: 10, marginTop: 0 }}>
          <FlatList
            data={this.state.usuario}
            renderItem={({ item }) => {
              return (
                <Card transparent>
                  <CardItem>
                    <Left>
                      <Thumbnail medium source={{ uri: item.selected_heroi }} />
                      <Body>
                        <Text style={[styles.texto, { margin: 10 }]}>{item.nome_usuario}</Text>
                        <Text style={{ marginLeft: 5 }} note> {item.nome_curso} </Text>
                        <TouchableOpacity style={styles.btnPerfil} onPress={() => this.props.navigation.navigate('Perfil')}>
                          <Text style={{ color: '#963BE0' }}>Editar perfil</Text>
                        </TouchableOpacity>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>);
            }}>
          </FlatList>

          <Form>
            <Card style={{ borderRadius: 10 }} >
              <Item fixedLabel  >
                <Text style={{ margin: 10 }}>Assunto</Text>
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
              <Input style={{ margin: 10 }} multiline={true} bordered placeholder='O que você está estudando?' onChangeText={texto_post => this.setState({ texto_post })} value={this.state.texto_post} />

              {this.state.imgSource ? (
                <Image source={this.state.imgSource} style={styles.image} />) : (null)}

              {this.state.fileSource ? (
                <Item>
                  <Text>Arquivo selecionado com sucesso</Text>
                </Item>
              ) : (null)}


              <FlatList
                data={this.state.usuario}
                renderItem={({ item }) => {
                  return (
                    <Item last>
                      <Button block light style={{ color: 'black', backgroundColor: '#963BE0', borderRadius: 5, width: '60%' }} onPress={() => this.handleNovoPost(item.nome_usuario, item.nome_faculdade, item.nome_curso, item.selected_heroi, item.emailUsuario)}>
                        <Icon name="add" style={{ color: 'white', marginLeft: 0, marginRight: 10 }} />
                        <Text style={{ color: 'white', fontSize: 20 }}>Adicionar Post</Text>
                      </Button>
                      <Button transparent block light style={{ color: 'black', backgroundColor: 'transparent', width: '20%' }} onPress={this.pickImage}>
                        <Icon name="camera" style={{ color: 'gray' }} />
                      </Button>
                      <Button transparent block light style={{ color: 'black', backgroundColor: 'transparent', borderColor: 'transparent', width: '20%' }} onPress={this.pickFile}>
                        <Icon name="paper" style={{ color: 'gray' }} />
                      </Button>
                    </Item>

                  );
                }}>
              </FlatList>
            </Card>
            <CardItem footer style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}/>
          </Form>



          <ScrollView>
          
            <FlatList
              data={this.state.posts}
              renderItem={({ item }) => {
                return (
                  <Card style={{ borderRadius: 10 }}>
                    <CardItem bordered header style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} header >
                      <Left>
                        <Thumbnail circle small source={{ uri: item.selected_heroi }} />
                        <Body>
                          <Text style={{ fontSize: 14 }}>{item.nome_usuario}</Text>
                          <Text style={{ color: 'gray', fontSize: 12 }}>{item.nome_faculdade}</Text>

                        </Body>
                        <Right>
                          <Text style={{ fontSize: 10, color: '#808080', padding: 5 }}>{item.data_inclusao}</Text>
                          <TouchableOpacity style={{
                            backgroundColor: 'transparent', borderColor: '#0082FF', borderRadius: 8, borderWidth: 0.5, margin: 0, marginLeft: 10, padding: 5
                          }}>
                            <Text style={{ color: '#0082FF', fontSize: 10, padding: 2, textAlign: 'center' }}>{item.categoria}</Text>
                          </TouchableOpacity>
                        </Right>
                      </Left>
                    </CardItem>

                    {item.texto_post ? (
                      <CardItem body bordered >
                        <Text selectable={true} style={{ fontSize: 18, color: '#505050'}}>{item.texto_post}</Text>
                      </CardItem>) : (null)}


                    {item.urlImagem ? (
                      <CardItem>
                        <Thumbnail square source={{ uri: item.urlImagem }} style={styles.image_post} />
                      </CardItem>) : (null)}

                    {item.urlImagem ? (
                      <TouchableOpacity block light style={{ color: 'black', width: '100%', marginBottom: 10 }} onPress={() => { Linking.openURL(item.urlImagem) }}>
                        <Text style={{ color: '#963BE0', textAlign: 'center' }}>Visualizar a foto no browser</Text>
                      </TouchableOpacity>
                    ) : (null)}



                    <CardItem footer style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <Left>
                        {item.urlFile ? (
                          <Button style={{ color: '#0082FF', padding: 10 }} transparent onPress={() => { Linking.openURL(item.urlFile) }}>
                            <Icon style={{ color: '#0082FF', fontSize: 20, padding: 10 }} name="download" />
                            <Text>Baixar arquivo</Text>
                          </Button>

                        ) : (null)}
                      </Left>
                      {item.usuario == currentUser.uid ? (
                        <Button style={{ color: '#0082FF', padding: 10 }} transparent onPress={() => this.handleApagarPost(item.key)} >
                          <Icon style={{ color: '#0082FF', fontSize: 20, padding: 10 }} name="remove" />
                          <Text>Excluir</Text>
                        </Button>

                      ) : (null)}
                      <Right>
                        <Button style={{ color: '#0082FF', padding: 10 }} transparent onPress={() => this.props.navigation.navigate('Comentarios', { chave_seguranca_comentarios: item.chave_seguranca_comentarios })}>
                          <Icon style={{ color: '#0082FF', padding: 10 }} active name="chatbubbles" />
                          <Text>Comentar</Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>);
              }}>
            </FlatList>
          </ScrollView>
        </Content>
      </Container>
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
  backgroundColor: "#61a465",
  height: 150,
  color: "#ffffff",
  fontSize: 17,
  borderRadius: 100,
  yOffset: 200
};

const toastInfo = {
  backgroundColor: "#7182e1",
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
    height: 100
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
  perfilImg: {
    width: 80,
    height: 80,
    resizeMode: 'center',
    borderRadius: 80 / 2,
  },
  texto: {
    color: 'black',
    marginBottom: 10,
    fontSize: 20,
  },
  perfil: {
    alignItems: 'center',
    marginTop: 50,
    borderWidth: 3,
    height: '20%',
    width: '80%',
  },
  btnPerfil: {
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#963BE0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    padding: 5
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