import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const [login, setLogin] = useState({ email: "felipegay@gmail.com", senha: "9931" });
  let idR = 0
  const [carregando, setCarregando] = useState(false);

  if (carregando) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }
  

  const realizarLogin = async () => {
    setCarregando(true)
    //if
    for (let propriedade in login) {
      if (login.hasOwnProperty(propriedade)) {
        if (login[propriedade] === null || login[propriedade] === '') {
          Alert.alert(`O campo ${propriedade} é obrigatório.`); 
        } else {
          await axios.post('http://192.168.0.8:3000/login', login).then(function (resposta) {
              idR = resposta.data.idRestaurante 
              setLogin({email: '', senha: ''})
              navigation.navigate('Cardapio', { idR: idR });
          }).catch(function (erro) {
              console.log(erro);
          })
        }
    }
    }
    

    //Fim if
    
    setCarregando(false)
};

  return (
    <ScrollView style={{ backgroundColor: '#ffffff' }}>
      <View style={styles.container}>
        <View style={styles.containerLogo}>
          <Text style={{ color: "#FFFFFF", fontSize: 36 }}>PEDE</Text>
          <Image source={require('../../assets/imagens/burger.png')} />
          <Text style={{ color: "#fff", fontSize: 36 }}>JÁ</Text>
        </View>
        <View style={styles.containerForm}>
          <Text style={{ color: "#EA8841", fontSize: 40, textAlign: "center", marginTop: "10%" }}>Login</Text>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, width: "85%", marginLeft: "7%", marginTop: "10%" }}>
            <Image source={require("../../assets/imagens/Documents.png")} style={{ width: 26, marginRight: "3%", }} />
            <TextInput
              placeholder="Email"
              value={login.email}
              onChangeText={(text) => setLogin({ ...login, email: text })}
              style={{ marginLeft: "3%" }}
            />
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, width: "85%", marginLeft: "7%", marginTop: "10%" }}>
            <Image source={require("../../assets/imagens/Lock.png")} />
            <TextInput
              placeholder="Senha"
              value={login.senha}
              onChangeText={(text) => setLogin({ ...login, senha: text })}
              style={{ marginLeft: "5%" }}
            />
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center", marginTop: "5%" }}>
            <Text>Não tem uma conta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Cadastro")}
            >
              <Text style={{ color: "#EA8841", marginLeft: 4 }}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={realizarLogin}>
            <Text style={{color: '#fff'}}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cliente')}>
            <Text style={{color: '#fff'}}>Área do cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA8841"
  },
  containerLogo: {
    marginTop: "15%",
    marginBottom: "0%",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#EA8841'
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
    marginTop: "15%"
  },
  button: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    alignSelf: "center",
    marginTop: "11%",
    alignItems: "center",
    justifyContent: "center",
    
  },
});
