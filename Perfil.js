import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Header, Input, Button, Icon, Content, Footer, FooterTab, Card, CardItem, Thumbnail, Label } from 'native-base'
import firebase from 'react-native-firebase';
import { firebaseDatabase } from './config'


export default class Perfil extends React.Component {
  state = { currentUser: null }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      usuario: [],
      urlImagem: ''
    };
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    title: "Perfil",
    headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff'}, 
    headerStyle: {
      backgroundColor: '#963BE0'
    },  };


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
          idade: doc.toJSON().idade,
          selected_heroi: doc.toJSON().selected_heroi,
          selected_sexo: doc.toJSON().selected_sexo,
          emailUsuario: doc.toJSON().emailUsuario,
          grau_satisfacao: doc.toJSON().grau_satisfacao,
          modalidade: doc.toJSON().modalidade,
          estado: doc.toJSON().estado
        });
        this.setState({
          usuario: usuario.sort((a, b) => {
            urlImagem = selected_heroi
            return (a.idUsuario > b.idUsuario);
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
        <FlatList
          data={this.state.usuario}
          renderItem={({ item }) => {
            return (
              <Card>

                <CardItem style={{ marginTop: 8 }} header bordered>
                  <Thumbnail medium source={{ uri: item.selected_heroi }} />
                  <Text selectable={true} style={{ fontSize: 28, color: '#000000' }}>{item.nome_usuario}</Text>
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>{item.nome_faculdade}, {item.nome_curso}</Text>
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>Modalidade: {item.modalidade}</Text>
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>{item.idade} Anos</Text>
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>Gênero : </Text>
                  <Thumbnail square small source={{ uri: item.selected_sexo }} />
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>{item.emailUsuario}</Text>
                </CardItem>

                <CardItem style={styles.carditem} bordered>
                  <Text selectable={true} style={{ fontSize: 22, color: '#333333' }}>Avaliação da faculdade: </Text>
                  <Thumbnail square small source={{ uri: item.grau_satisfacao }} />
                </CardItem>
              </Card>
            );
          }}>
        </FlatList>
        <Button block light style={{ color: 'black', width: '100%', backgroundColor: '#963BE0', height: 25 }} onPress={() => this.props.navigation.navigate('Cadastro')}>
          <Text style={{ color: 'white', fontSize: 20 }}>Editar Perfil</Text>
          <Icon name="add" style={{ color: 'white' }} />
        </Button>

      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f5fe',
  },
  carditem: {
    backgroundColor: '#e7f5fe',
    marginTop: 1
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
});