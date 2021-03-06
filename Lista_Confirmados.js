import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { Badge, Header, Input, Button, Icon, Content, Footer, FooterTab, Item, Form, Card, CardItem, Left, Right, Body, Thumbnail, HeaderTab } from 'native-base'
import firebase from 'react-native-firebase';
import Toast from 'react-native-toast-native';
import { firebaseDatabase } from './config'

export default class Lista_Confirmados extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      usuario: [],
      grupo_privado_participantes: []
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




  componentDidMount() {
    const { navigate } = this.props.navigation;
    this.props.navigation.state.params.nome_grupo_privado
    this.props.navigation.state.params.chave_seguranca_evento

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })


    const rootPub = firebaseDatabase.ref('Eventos_Privados_Participantes').orderByChild("chave_seguranca_evento").equalTo(this.props.navigation.state.params.chave_seguranca_evento);
    rootPub.on('value', (childSnapshot) => {
      const grupo_privado_participantes = [];
      childSnapshot.forEach((doc) => {
        grupo_privado_participantes.push({
          usuario_email: doc.toJSON().usuario_email,
        });
        this.setState({
          grupo_privado_participantes: grupo_privado_participantes.sort((a, b) => {
            return (a.usuario_email < b.usuario_email);
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
    this.props.navigation.state.params.chave_seguranca_evento
    this.props.navigation.state.params.nome_evento
    return (
      <View style={styles.container}>
        <Content>
          <ScrollView>
            <Card style={{ padding: 10 }}>
              <CardItem>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#4F4F4F' }}>Usuarios que realizaram check-in no evento:</Text>
              </CardItem>
              <CardItem>
                <Text style={{ fontSize: 25, color: '#4F4F4F' }}>{this.props.navigation.state.params.nome_evento}</Text>
              </CardItem>
            </Card>

            <FlatList
              data={this.state.grupo_privado_participantes}
              renderItem={({ item }) => {
                return (
                  <Card style={{ marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'transparent', borderColor: 'transparent', elevation: 0 }}>
                    <Item style={{ color: 'black', backgroundColor: '#fff', elevation: 2, width: '100%', justifyContent: "center", padding: 10, borderRadius: 10, borderColor: '#ccc' }}>
                      <Text style={{ color: '#666', fontSize: 15, paddingLeft: 10, paddingTop: 5, paddingBottom: 10 }}>{item.usuario_email}</Text>
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