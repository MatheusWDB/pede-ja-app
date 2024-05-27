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
  Platform
} from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const [login, setLogin] = useState({ email: '', senha: '' });
  let idR = 0
  const [carregando, setCarregando] = useState(false);

  if (carregando) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }


  const realizarLogin = async () => {
    setCarregando(true)
    for (let propriedade in login) {
      if (login.hasOwnProperty(propriedade)) {
        if (login[propriedade] === null || login[propriedade] === '') {
          Alert.alert(`O campo ${propriedade} é obrigatório.`);
          return;
        }

      }
    }
    console.log(login)
    await axios.post('https://pede-ja.onrender.com/login', login).then(function (resposta) {
      idR = resposta.data.idRestaurante
      setLogin({ email: '', senha: '' })
      navigation.navigate('Cardapio', { idR: idR });
    }).catch(function (erro) {
      console.log(erro);
    })
    setCarregando(false)
  };

  return (
    <ScrollView style={{ backgroundColor: '#ffffff' }}>
      
      <View style={styles.container}>
      
        <View style={styles.containerLogo}>
          
          <Text style={{ color: "#FFFFFF", fontSize:36,...Platform.select({
      android: {
        fontSize: 36
      }
    }) }}>PEDE</Text>
          
          <Image source={require('../../assets/imagens/burger.png')} />
          
          <Text style={{ color: "#fff", fontSize: 36 }}>JÁ</Text>
        
        </View>
        
        <View style={styles.containerForm}>
          
          <Text style={{ color: "#EA8841", fontSize: 40, textAlign: "center", marginTop: "5%", ...Platform.select({
      android: {
        marginTop: "10%",
        fontSize: 40
      }
    })}}>Login</Text>

          <View style={{ flexDirection: "row", borderBottomWidth: 1, width: "30%", alignSelf:'center', marginTop: "3%", ...Platform.select({
      android: {
        marginTop: "10%",
        marginLeft: "7%",
         width: "85%"
      }
    })}}>
            
            <Image source={require("../../assets/imagens/Letter.png")} style={{ width: 26, }} />
            
            <TextInput
              placeholder="Email"
              value={login.email}
              onChangeText={(text) => setLogin({ ...login, email: text })}
              style={{ marginLeft: "3%", width:'100%', ...Platform.select({
                android: {
                  marginLeft: "5%",
                  width:'85%'

                }
              })}}
            />
         
          </View>
          
          <View style={{ flexDirection: "row", borderBottomWidth: 1, width: "30%", alignSelf:"center", marginTop: "3%", ...Platform.select({
      android: {
        marginTop: "10%",
        marginLeft: "7%",
         width: "85%"
      }
    })
          
      }}>
            <Image source={require("../../assets/imagens/Lock.png")} />
            <TextInput
              placeholder="Senha"
              value={login.senha}
              onChangeText={(text) => setLogin({ ...login, senha: text })}
              style={{ marginLeft: "3%", width:'100%',  }}
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
            <Text style={{ color: '#fff' }}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cliente')}>
            <Text style={{ color: '#fff' }}>Área do cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA8841",
    ...Platform.select({
      android: {

      }
    })
  },
  containerLogo: {
    
    
    flexDirection: "row",
    width:'100%',
    marginTop:'7%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#EA8841',
    marginBottom:'7%',
    
    ...Platform.select({
      android: {
        width: "100%",
        marginTop: "15%",
        marginBottom: "0%",
        
      }
    })
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    
    ...Platform.select({
      android: {
        paddingStart: "5%",
        paddingEnd: "5%",
        marginTop: "15%"
        
      }
    })
  },
  button: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    width: "20%",
    marginTop: "1%",
    paddingVertical: 8,
    
    alignSelf: "center",
    
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: {
        width: "60%",
        marginTop: "9%",
        paddingVertical: 8,
      }
    })

  },
});
