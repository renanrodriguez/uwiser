import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
// import the different screens
import SignUp from './SignUp'
import Login from './Login'
import Main from './Main'
import ForgetPassword from './ForgetPassword'
import Calendario from './Calendario'
import Grupos from './Grupos'
import Anotacoes from './Anotacoes'
import Cadastro from './Cadastro'
import Perfil from './Perfil'
import Grupos_Publicos from './Grupos_Publicos'
import Grupos_Privados from './Grupos_Privados'
import Eventos_Publicos from './Eventos_Publicos'
import Gerenciar_Eventos from './Gerenciar_Eventos'
import Meus_Eventos from './Meus_Eventos'
import Eventos_Privados from './Eventos_Privados'
import Posts_Privados from './Posts_Privados'
import Gerenciar_Membros from './Gerenciar_Membros'
import Lista_Confirmados from './Lista_Confirmados'
import Comentarios from './Comentarios'
import Grupos_Publicos_Gerenciar from './Grupos_Publicos_Gerenciar'
import Lista_Confirmados_Publica from './Lista_Confirmados_Publica'


// create our app's navigation stack
const App = createStackNavigator(
  {
    SignUp,
    Login,
    Main,
    ForgetPassword,
    Calendario,
    Grupos,
    Anotacoes,
    Cadastro,
    Perfil,
    Grupos_Publicos,
    Grupos_Privados,
    Eventos_Publicos,
    Gerenciar_Eventos,
    Meus_Eventos,
    Eventos_Privados,
    Posts_Privados,
    Gerenciar_Membros,
    Lista_Confirmados,
    Comentarios,
    Grupos_Publicos_Gerenciar,
    Lista_Confirmados_Publica
  },
  {
    initialRouteName: 'Login'
  },{
    defaultNavigationOptions: {
      header: null
    },
  }
)

const AppContainer = createAppContainer(App);
export default AppContainer