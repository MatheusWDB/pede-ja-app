
import {StatusBar} from "react-native";
import {NavigationContainer} from "@react-navigation/native"
import Routes from "./src/routes";

export default function login(){
    return(
        <NavigationContainer>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content"/>
          <Routes/>
        </NavigationContainer>
    )
}
