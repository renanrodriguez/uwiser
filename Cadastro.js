import React from 'react'
import { StyleSheet, Platform, Image, Text, View,ScrollView,TouchableOpacity,Alert } from 'react-native'
import {Header,Input,Button, Icon, Content,Footer, FooterTab,Card,CardItem,Form,Item,Picker} from 'native-base'
import firebase from 'react-native-firebase';
import {firebaseDatabase} from './config'

export default class Cadastro extends React.Component {
  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      nome_usuario: '',
      nome_faculdade: '',
      nome_curso: '',
      idade: '',
      selected_heroi: '',
      selected_sexo:'',
      grau_satisfacao: '',
      modalidade: '',
      estado:''
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

  handleCadastroUsuario = () => {
    const { nome_usuario ,nome_faculdade,nome_curso,idade,selected_heroi,selected_sexo,currentUser,grau_satisfacao,modalidade,estado} = this.state
    const usuarioRoot = firebaseDatabase.ref('Users/'+currentUser.uid)
    alert("Cadastro realizado com sucesso"); 
    usuarioRoot.set({
      nome_usuario: nome_usuario,
      nome_faculdade: nome_faculdade,
      nome_curso: nome_curso,
      idade: idade,
      selected_heroi: selected_heroi,
      selected_sexo:selected_sexo,
      idUsuario: currentUser.uid,
      emailUsuario: currentUser.email,
      grau_satisfacao : grau_satisfacao,
      modalidade:modalidade,
      estado:estado
    });
  }

  onValueChange(value) {
    this.setState({
      selected_heroi: value
    });
  }

  onValueChange1(value) {
    this.setState({
      selected_sexo: value
    });
  }

  onValueChange2(value) {
    this.setState({
      grau_satisfacao: value
    });
  }

  onValueChange3(value) {
    this.setState({
      modalidade: value
    });
  }

  onValueChange4(value) {
    this.setState({
      estado: value
    });
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
          <Header androidStatusBarColor="#963BE0" style={{color:'black',backgroundColor:'#963BE0'}}>
              <Text style={{fontSize: 30,color:'white',}}>Cadastro</Text>
        </Header>
         <Form>
        <Item fixedLabel>
              <Input placeholder='Nome' onChangeText={nome_usuario => this.setState({ nome_usuario })} value={this.state.nome_usuario}/>
        </Item>
        <Item fixedLabel last>
        <Input placeholder='Faculdade' onChangeText={nome_faculdade => this.setState({ nome_faculdade })} value={this.state.nome_faculdade}/>
        </Item>
        <Item fixedLabel last>
        <Input placeholder='Curso' onChangeText={nome_curso => this.setState({ nome_curso })} value={this.state.nome_curso}/>
        </Item>
        <Item fixedLabel last>
        <Input keyboardType='numeric' placeholder='Idade' type='number' onChangeText={idade => this.setState({ idade })} value={this.state.idade}/>
        </Item>

        <Item fixedLabel last> 
        <Text>Genero</Text>
        <Picker
              mode="dropdown"
              iosHeader="Selecione o seu sexo"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.selected_sexo}
              onValueChange={this.onValueChange1.bind(this)} >
              <Picker.Item label="Selecionar" value="" />
              <Picker.Item label="Masculino" value="https://image.flaticon.com/icons/png/128/1889/1889229.png" />
              <Picker.Item label="Feminino" value="https://image.flaticon.com/icons/png/128/1889/1889223.png" />
              <Picker.Item label="Não definido" value="https://image.flaticon.com/icons/png/128/1880/1880665.png" />
            </Picker>
            </Item>

        <Item fixedLabel last> 
        <Text>Modalidade</Text>
        <Picker
              mode="dropdown"
              iosHeader="Selecione a sua modalide"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.modalidade}
              onValueChange={this.onValueChange3.bind(this)} >
              <Picker.Item label="Selecionar" value="" />
              <Picker.Item label="Presencial" value="Presencial" />
              <Picker.Item label="Ensino a distância" value="EAD" />
            </Picker>
            </Item>

            <Item fixedLabel last> 
            <Text>Avatar</Text>
            <Picker
              mode="dropdown"
              iosHeader="Selecione o herói do seu avatar"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.selected_heroi}
              onValueChange={this.onValueChange.bind(this)} >
              <Picker.Item label="Selecionar" value="" />
              <Picker.Item label="Homem de ferro" value="https://image.flaticon.com/icons/png/128/1466/1466118.png" />
              <Picker.Item label="Batman" value="https://image.flaticon.com/icons/png/128/1466/1466102.png" />
              <Picker.Item label="Mulher maravilha" value="https://image.flaticon.com/icons/png/128/1466/1466137.png" />
              <Picker.Item label="Mulher gato" value="https://image.flaticon.com/icons/png/128/1466/1466103.png" />
            </Picker>
            </Item>

            <Item fixedLabel last> 
            <Text>Estado</Text>
            <Picker
              mode="dropdown"
              iosHeader="Selecione o seu estado"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.estado}
              onValueChange={this.onValueChange4.bind(this)} >
              <Picker.Item label="Selecionar" value="" />
              <Picker.Item label="Alagoas" value="Alagoas" />
              <Picker.Item label="Amapá" value="Amapá" />
              <Picker.Item label="Amazonas" value="Amazonas" />
              <Picker.Item label="Bahia" value="Bahia" />
              <Picker.Item label="Ceará" value="Ceará" />
              <Picker.Item label="Distrito Federal" value="Distrito Federal" />
              <Picker.Item label="Espírito Santo" value="Espírito Santo" />
              <Picker.Item label="Goiás" value="Goiás" />
              <Picker.Item label="Maranhão" value="Maranhão" />
              <Picker.Item label="Mato Grosso" value="Mato Grosso" />
              <Picker.Item label="Mato Grosso do Sul" value="Mato Grosso do Sul" />
              <Picker.Item label="Minas Gerais" value="Minas Gerais" />
              <Picker.Item label="Pará" value="Pará" />
              <Picker.Item label="Paraíba" value="Paraíba" />
              <Picker.Item label="Paraná" value="Paraná" />
              <Picker.Item label="Pernambuco" value="Pernambuco" />
              <Picker.Item label="Piauí" value="Piauí" />
              <Picker.Item label="Rio Grande do Norte" value="Rio Grande do Norte" />
              <Picker.Item label="Rio Grande do Sul" value="Rio Grande do Sul" />
              <Picker.Item label="Rondônia" value="Rondônia" />
              <Picker.Item label="Roraima" value="Roraima" />
              <Picker.Item label="Santa Catarina" value="Santa Catarina" />
              <Picker.Item label="São Paulo" value="São Paulo" />
              <Picker.Item label="Sergipe" value="Sergipe" />
              <Picker.Item label="Tocantins" value="Tocantins" />
            </Picker>
            </Item>

            <Item fixedLabel last> 
            <Text>Avaliação geral da faculdade</Text>
            <Picker
              mode="dropdown"
              iosHeader="Selecionar"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.grau_satisfacao}
              onValueChange={this.onValueChange2.bind(this)} >
              <Picker.Item label="Ruim" value="https://image.flaticon.com/icons/png/128/148/148809.png" />
              <Picker.Item label="Razoavel" value="https://image.flaticon.com/icons/png/128/148/148808.png" />
              <Picker.Item label="Ótima" value="https://image.flaticon.com/icons/png/128/1053/1053399.png" />
            </Picker>
            </Item>
        <Button block light style={{color:'black',backgroundColor:'#963BE0'}}  onPress={this.handleCadastroUsuario}>
            <Text style={{color:'white',fontSize:20}}>Adicionar</Text>
            <Icon name="add" style={{color:'white'}}/>
        </Button>
      </Form>
        <Content>
        </Content>
        <Footer style={{ backgroundColor: "white" }}>
          <FooterTab style={{ backgroundColor: "white" }}>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Main')}>
              <Icon style={{ color: '#7F1CFD', fontSize: 30 }} name="grid" />
              <Text style={{ fontSize: 12, color: '#7F1CFD' }}>Feed</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Perfil')}>
              <Icon style={{ color: 'gray', fontSize: 30 }} name="person" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Perfil</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Grupos')}>
              <Icon style={{ color: 'gray', fontSize: 30 }} active name="contacts" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Grupos</Text>
            </Button>
            <Button style={{ backgroundColor: "white" }} vertical active onPress={() => this.props.navigation.navigate('Anotacoes')} >
              <Icon style={{ color: 'gray', fontSize: 30 }} name="bookmarks" />
              <Text style={{ fontSize: 12, color: 'gray' }}>Anotações</Text>
            </Button>
          </FooterTab>
        </Footer>
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
    flexDirection: 'row',
    width: 30,
    height: 30,
    resizeMode: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});