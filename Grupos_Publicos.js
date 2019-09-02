import React from 'react'
import { StyleSheet, Text, TextInput, View ,TouchableOpacity,Image,ScrollView,FlatList,AsyncStorage,Linking} from 'react-native'
import {Badge,Header,Input,Button, Icon, Content,Footer, FooterTab,Item,Form,Card,CardItem,Left,Right,Body,Thumbnail,HeaderTab} from 'native-base'
import firebase from 'react-native-firebase';
import {firebaseDatabase} from './config'
import ImagePicker from 'react-native-image-picker';
import FilePickerManager from 'react-native-file-picker';
import Toast from 'react-native-simple-toast';

const pub_pub_root = firebaseDatabase.ref();
const pub_pub_ref = pub_pub_root.child('Publicacao_Grupo_Publico');

const options = {
  title: 'Tire uma foto ou escolha da galeria',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Grupos_Publicos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null ,
      usuario : [],
      texto_publicacao:'',
      publicacao:[],
      imgSource:'',
      images:[],
      files:[],
      validacao_imagem:'',
      validacao_file:'',
      fileSource:''
    };
  }



  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

handleNovaPublicacao = (nome_usuario,nome_faculdade,nome_curso,selected_heroi,emailUsuario) => {
  const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca
  const {texto_publicacao,currentUser,data_atual} = this.state
  if(texto_publicacao=='' && this.state.validacao_imagem == '' && (this.state.validacao_file == '' || this.state.validacao_file == 'valido')){
      Toast.show('Coloque um texto ou foto na sua publicação')
  }
/*Publicação apenas texto */
  if(texto_publicacao!='' && this.state.validacao_imagem == '' && this.state.validacao_file==''){
    pub_pub_ref.push({
        usuario: currentUser.uid,
        texto_publicacao : texto_publicacao,
        data_inclusao : data_atual,
        nome_usuario:nome_usuario,
        nome_faculdade:nome_faculdade,
        nome_curso:nome_curso,
        selected_heroi:selected_heroi,
        emailUsuario:emailUsuario,
        chave_seguranca_comentarios:currentUser.uid+data_atual+texto_publicacao,
        nome_grupo_publico :     this.props.navigation.state.params.nome_grupo_publico,
        chave_seguranca:     this.props.navigation.state.params.chave_seguranca
      });
      Toast.show('Publicação realizada com sucesso')
  }
  /*Publicação imagem e/ou texto */
  if(this.state.validacao_imagem == 'valido' && this.state.validacao_file==''){
      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000)/Math.random() + 1;
      const ext = this.state.imageUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('images/'+randomNumber).putFile(this.state.imageUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Progresso postagem:'+ progress + '%')
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            if (publicar==0){
              const allImages = this.state.images;           
              allImages.push(snapshot.downloadURL);
              pub_pub_ref.push({
                usuario: currentUser.uid,
                texto_publicacao : texto_publicacao,
                data_inclusao : data_atual,
                nome_usuario:nome_usuario,
                nome_faculdade:nome_faculdade,
                nome_curso:nome_curso,
                selected_heroi:selected_heroi,
                emailUsuario:emailUsuario,
                urlImagem:snapshot.downloadURL,
                chave_seguranca_comentarios:currentUser.uid+data_atual+texto_publicacao+snapshot.downloadURL,
                nome_grupo_publico :     this.props.navigation.state.params.nome_grupo_publico,
                chave_seguranca:     this.props.navigation.state.params.chave_seguranca
              });
              publicar = 1;
              Toast.show('Publicação realizada com sucesso')
              state = {
                ...state,
                uploading: false,
                imgSource: '',
                imageUri: '',
                progress: 0,
                images: allImages,
                validacao_imagem:''
              };
              AsyncStorage.setItem('images', JSON.stringify(allImages));
            }
            this.setState(state);
            }     
          
        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo');
        }
      );
    }

    /*Publicação imagem e arquivo */
    if(this.state.validacao_imagem == 'valido' && this.state.validacao_file=='valido'){

      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000)/Math.random() + 1;
      const ext = this.state.imageUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('images/'+randomNumber).putFile(this.state.imageUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Progresso upload foto:'+ progress + '%')
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {

            var randomNumber = Math.floor(Math.random() * 1000)/Math.random() + 1;
            const ext = this.state.fileUri.split('.').pop(); // Extract image extension
            const filename = `${randomNumber}.${ext}`; // Generate unique name
            this.setState({ uploading: true });
            firebase.storage().ref('file/'+filename).putFile(this.state.fileUri).on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot2 => {
                let state = {};

                var progress = (snapshot2.bytesTransferred / snapshot2.totalBytes) * 100;
                Toast.show('Progresso upload arquivo:'+ progress + '%')

                if (snapshot2.state === firebase.storage.TaskState.SUCCESS) {
                  if (publicar==0){
                    const allImages = this.state.images;           
                    allImages.push(snapshot.downloadURL);
                    const allFiles = this.state.files;
                    allFiles.push(snapshot2.downloadURL);
                    pub_pub_ref.push({
                      usuario: currentUser.uid,
                      texto_publicacao : texto_publicacao,
                      data_inclusao : data_atual,
                      nome_usuario:nome_usuario,
                      nome_faculdade:nome_faculdade,
                      nome_curso:nome_curso,
                      selected_heroi:selected_heroi,
                      emailUsuario:emailUsuario,
                      urlImagem:snapshot.downloadURL,
                      urlFile:snapshot2.downloadURL,
                      chave_seguranca_comentarios:currentUser.uid+data_atual+texto_publicacao+snapshot.downloadURL,
                      nome_grupo_publico :     this.props.navigation.state.params.nome_grupo_publico,
                      chave_seguranca:     this.props.navigation.state.params.chave_seguranca
                    });
                    publicar = 1;
                    Toast.show('Publicação realizada com sucesso')
                    state = {
                      ...state,
                      uploading: false,
                      imgSource: '',
                      imageUri: '',
                      progress: 0,
                      images: allImages,
                      validacao_imagem:'',
                      fileSource:'',
                      fileUri:'',
                      files:allFiles,
                      validacao_file:''
                    };
                    AsyncStorage.setItem('images', JSON.stringify(allImages));
                    AsyncStorage.setItem('files', JSON.stringify(allFiles));
                  }
                  this.setState(state);
                }
              }
            )             
            
            }      
        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo');
        }
      );
    }

    if (this.state.validacao_imagem == '' && this.state.validacao_file=='valido' && this.state.texto_publicacao !=''){
      var publicar = 0;
      var randomNumber = Math.floor(Math.random() * 1000)/Math.random() + 1;
      const ext = this.state.fileUri.split('.').pop(); // Extract image extension
      const filename = `${randomNumber}.${ext}`; // Generate unique name
      this.setState({ uploading: true });
      firebase.storage().ref('file/'+filename).putFile(this.state.fileUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          Toast.show('Progresso postagem:'+ progress + '%')
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            if (publicar==0){
              const allFiles = this.state.files;           
              allFiles.push(snapshot.downloadURL);
              pub_pub_ref.push({
                usuario: currentUser.uid,
                texto_publicacao : texto_publicacao,
                data_inclusao : data_atual,
                nome_usuario:nome_usuario,
                nome_faculdade:nome_faculdade,
                nome_curso:nome_curso,
                selected_heroi:selected_heroi,
                emailUsuario:emailUsuario,
                urlFile:snapshot.downloadURL,
                chave_seguranca_comentarios:currentUser.uid+data_atual+texto_publicacao+snapshot.downloadURL,
                nome_grupo_publico :     this.props.navigation.state.params.nome_grupo_publico,
                chave_seguranca:     this.props.navigation.state.params.chave_seguranca
              });
              publicar = 1;
              Toast.show('Publicação realizada com sucesso')
              state = {
                ...state,
                uploading: false,
                fileSource: '',
                fileUri: '',
                progress: 0,
                files: allFiles,
                validacao_file:''
              };
              AsyncStorage.setItem('files', JSON.stringify(allFiles));
            }
            this.setState(state);
            }     
        },
        error => {
          unsubscribe();
          Toast.show('Ocorreu um erro tente de novo');
        }
      );
    }      
}

pickImage = () => {
  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      Toast.show('Você fechou a opção de imagens');
    } else if (response.error) {
      Toast.show('O seguinte erro aconteceu: ', response.error);
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
      Toast.show('Você fechou a opção de escolha de arquivos');
    }
    else if (response.error) {
      Toast.show('O seguinte erro aconteceu: ', response.error);
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
              return (a.idUsuario<b.idUsuario);
            }),
            loading: false,
          }); 
        });
    });

    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_publico
    this.props.navigation.state.params.chave_seguranca

    const rootPub = firebaseDatabase.ref('Publicacao_Grupo_Publico').orderByChild("chave_seguranca").equalTo(this.props.navigation.state.params.chave_seguranca);;
    rootPub.on('value', (childSnapshot) => {
      const publicacao = [];
      childSnapshot.forEach((doc) => {
        publicacao.push({
          key:doc.key,
          usuario: doc.toJSON().usuario,
          texto_publicacao : doc.toJSON().texto_publicacao,
          data_inclusao : doc.toJSON().data_inclusao,
          nome_usuario:doc.toJSON().nome_usuario,
          nome_faculdade:doc.toJSON().nome_curso,
          nome_curso:doc.toJSON().nome_curso,
          selected_heroi:doc.toJSON().selected_heroi,
          emailUsuario:doc.toJSON().emailUsuario,
          urlImagem: doc.toJSON().urlImagem,
          urlFile:doc.toJSON().urlFile,
          chave_seguranca_comentarios: doc.toJSON().chave_seguranca_comentarios 
          });
          this.setState({
            publicacao: publicacao.sort((a, b) => {
              return (a.key<b.key);
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
            <Header style={{color:'black',backgroundColor:'#a454ff',width:'100%'}} >
              <Text style={{fontSize: 25,color:'white'}}>{this.props.navigation.state.params.nome_grupo_publico}</Text>  
        </Header>
        <Header style={{color:'black',backgroundColor:'#a454ff',width:'100%'}} >
        <Button style={{backgroundColor:'#a454ff',width:'33%'}} vertical active onPress={() => this.props.navigation.navigate('Grupos_Publicos',{nome_grupo_publico:  this.props.navigation.state.params.nome_grupo_publico,chave_seguranca:   this.props.navigation.state.params.chave_seguranca })}>
              <Text style={{fontSize: 12,color:'white'}}>POSTS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#a454ff',width:'33%'}} onPress={() => this.props.navigation.navigate('Eventos_Publicos',{nome_grupo_publico:  this.props.navigation.state.params.nome_grupo_publico,chave_seguranca:   this.props.navigation.state.params.chave_seguranca })}>
              <Text style={{fontSize: 12,color:'white'}}>EVENTOS</Text>
            </Button>
            <Button vertical active style={{backgroundColor:'#a454ff',width:'33%'}} onPress={() => this.props.navigation.navigate('Gerenciar_Eventos',{nome_grupo_publico:  this.props.navigation.state.params.nome_grupo_publico,chave_seguranca:   this.props.navigation.state.params.chave_seguranca })}>       
              <Text style={{fontSize: 12,color:'white'}}>MEUS EVENTOS</Text>
            </Button>
        </Header>
          <Content>
        <Form>
        <Card>      
        <Item fixedLabel last > 
            <Input multiline={true} bordered placeholder='Texto da sua publicacao:' onChangeText={texto_publicacao => this.setState({ texto_publicacao })} value={this.state.texto_publicacao}/>
         </Item>   
         {this.state.imgSource ? (
          <Image source={this.state.imgSource} style={styles.image} />):(null)}

        {this.state.fileSource ? (
          <Item>
          <Text>Arquivo selecionado com sucesso</Text>
          </Item>
          ):(null)}
            <FlatList
      data={this.state.usuario}
      renderItem={({item}) => {
    return (
      <Item last>
            <Button block light style={{color:'black',backgroundColor:'#a454ff',width:'60%'}} onPress={() => this.handleNovaPublicacao(item.nome_usuario,item.nome_faculdade,item.nome_curso,item.selected_heroi,item.emailUsuario)}>
            <Text style={{color:'white',fontSize:20}}>Adicionar Post</Text>
            <Icon name="add" style={{color:'white'}}/>
        </Button>
        <Button block light style={{color:'black',backgroundColor:'#DC143C',width:'20%'}} onPress={this.pickImage}>
            <Icon name="camera" style={{color:'white'}}/>
        </Button>
        <Button block light style={{color:'black',backgroundColor:'#00ced1',width:'20%'}} onPress={this.pickFile}>
            <Icon name="paper" style={{color:'white'}}/>
        </Button>
            </Item>
      );}}>
      </FlatList>
      </Card>
      </Form>
      <ScrollView>

<FlatList
  data={this.state.publicacao}
  renderItem={({item}) => {
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
      {item.texto_publicacao ? (
              <CardItem body bordered >
              <Text selectable={true}  style={{fontSize: 20,color:'#505050E'}}>{item.texto_publicacao}</Text>       
              </CardItem>):(null)}

            
            {item.urlImagem ? (
              <CardItem>
          <Thumbnail square source={{uri: item.urlImagem}} style={styles.image_post}/>
         </CardItem>):(null)}

         {item.urlImagem ? (
          <TouchableOpacity block light style={{color:'black',backgroundColor:'#a454ff',width:'100%'}} onPress={ ()=>{ Linking.openURL(item.urlImagem)}}>
            <Text style={{color:'white'}}>Visualizar a foto no browser</Text>
          </TouchableOpacity>
         ):(null)}
    <CardItem>
              <Left>
              {item.urlFile ? (
            
            <Button block light style={{color:'black',backgroundColor:'#a454ff',width:'80%'}} onPress={ ()=>{ Linking.openURL(item.urlFile)}}>
            <Text style={{color:'white',fontSize:10}}>Baixar arquivo</Text>
          </Button>
            ):(null)}
              </Left>
              <Body>
                <Button transparent onPress={() => this.props.navigation.navigate('Comentarios',{chave_seguranca_comentarios:item.chave_seguranca_comentarios })}>
                  <Icon active name="chatbubbles" />
                  <Text>Comentar</Text>
                </Button>
              </Body>
              <Right>
              <Text style={{fontSize: 10,color:'#808080'}}>{item.data_inclusao}</Text>
              </Right>
            </CardItem>
    </Card>);}}>
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
    backgroundColor: '#A461FD',
  },
  item2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 40,
    backgroundColor: '#A461FD',
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
    backgroundColor: '#a454ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
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