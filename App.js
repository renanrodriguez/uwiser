import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation'
import { Icon } from 'native-base'
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



const TopTabs = createMaterialTopTabNavigator(
  {
    Grupos_Publicos: Grupos_Publicos,
    Grupos_Privados: Grupos_Privados,
  },
  {
    initialRouteName: 'Grupos_Publicos',
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
  }
);

const AuthStack = createStackNavigator(
  {
    SignUp,
    Login,
    ForgetPassword,
    Cadastro,
  },
  {
    initialRouteName: 'Login'
  }, {
  defaultNavigationOptions: {
  },
}
)

const FeedStack = createStackNavigator(
  {
    Main,
    Calendario,
    Posts_Privados,
    Comentarios,
  },
  {
    initialRouteName: 'Main'
  }, {
  defaultNavigationOptions: {
  },
}
)


const PerfilStack = createStackNavigator(
  {
    Perfil,
  },
  {
    initialRouteName: 'Perfil'
  }, {
  defaultNavigationOptions: {
  },
}
)



const tab = createMaterialTopTabNavigator({

  Grupos_Publicos_Gerenciar,
  Grupos_Privados,

},
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#963BE0',
      },
      indicatorStyle: {
        height: '10%',
        backgroundColor: '#fff'
      },
    }
  });

tab.navigationOptions = {
  header: null,
  title: "Grupos",
  headerTitleStyle: { width: '90%', textAlign: 'center', color: '#fff' },

};

const GruposStack = createStackNavigator(
  {
    tab,
    Calendario,
    Grupos,
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
    initialRouteName: 'tab'
  }, {
  defaultNavigationOptions: {
  },
}
)

const AnotacoesStack = createStackNavigator(
  {
    Anotacoes,
    Posts_Privados,
    Comentarios,
  },
  {
    initialRouteName: 'Anotacoes'
  }, {
  defaultNavigationOptions: {
  },
}
)


let navOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

FeedStack.navigationOptions = navOptions;
PerfilStack.navigationOptions = navOptions;
GruposStack.navigationOptions = navOptions;
AnotacoesStack.navigationOptions = navOptions;



const bottomTab = createBottomTabNavigator(
  {
    FeedStack: {
      screen: FeedStack,
      navigationOptions: {
        tabBarLabel: "Feed",
        tabBarIcon: ({ tintColor }) => (
          <Icon style={{ color: tintColor, fontSize: 30, padding: 10 }} name="grid" />
        )
      },
    },
    PerfilStack: {
      screen: PerfilStack,
      navigationOptions: {
        tabBarLabel: "Perfil",
        tabBarIcon: ({ tintColor }) => (
          <Icon style={{ color: tintColor, fontSize: 30, padding: 10 }} name="person" />
        )
      },
    },
    GruposStack: {
      screen: GruposStack,

      navigationOptions: {
        tabBarLabel: "Grupos",
        tabBarIcon: ({ tintColor }) => (
          <Icon style={{ color: tintColor, fontSize: 30, padding: 10 }} name="contacts" />
        )
      },
    },
    AnotacoesStack: {
      screen: AnotacoesStack,
      navigationOptions: {
        tabBarLabel: "Anotações",
        tabBarIcon: ({ tintColor }) => (
          <Icon style={{ color: tintColor, fontSize: 30, padding: 10 }} name="bookmarks" />
        )
      },
    }
  },
  {
    tabBarOptions: {
      keyboardHidesTabBar: true, 
      activeTintColor: '#7F1CFD'
    }
  });



const AppContainer = createAppContainer(
  createSwitchNavigator({
    AuthStack: AuthStack,
    App: bottomTab,
  },
    {
      initialRouteName: 'AuthStack',
    }
  ));
export default AppContainer;