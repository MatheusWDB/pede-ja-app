import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Login from "../paginas/Login"
import Cadastro from "../paginas/Cadastro"
import Redefinir from "../paginas/Redefinir"
import Cardapio from "../paginas/Cardapio"
import AlterarDados from '../paginas/Alterar Dados'
import Pedidos from '../paginas/Pedidos'
import Cliente from '../paginas/Cliente'


const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login">
            
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Cardapio"
                component={Cardapio}
                options={{ headerShown: false }}
            />
            

            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Redefinir"
                component={Redefinir}
                options={{ headerShown: false }}
            />

            

            <Stack.Screen
                name="AlterarDados"
                component={AlterarDados}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Cliente"
                component={Cliente}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Pedidos"
                component={Pedidos}
                options={{ headerShown: false }}
            />

            

        </Stack.Navigator>
    )
}

