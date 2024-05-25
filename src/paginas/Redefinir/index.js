import react from "react";
import {
  View, 
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";


import{useNavigation} from "@react-navigation/native"




export default function Redefinir(){

  const navigation = useNavigation();

  
 

    return(
      
      <ScrollView style={{backgroundColor:"#fff"}}>

        <View style={styles.container}>
          
          
          
          <View style={styles.containerLogo}>
            
            <Text style={{ color:"#fff", fontSize:36}}>PEDE</Text>
          
            <Image
            source={require('../../assets/imagens/burger.png')}
            style={{}}
            />
            
            <Text style={{color:"#fff", fontSize:36}}>JÁ</Text>

          </View>

          
        
          <View style={styles.containerForm}>

            <Text style={{color:"#EA8841", fontSize:26, textAlign:"center", marginTop:"10%"}}>Problemas para entrar?</Text>
            
           <Text style={{textAlign:"center", marginTop:"10%"}}>Insira seu email e enviaremos um link para que você possa voltar a acessar sua conta.</Text>
            

            <View style={{flexDirection:"row", borderBottomWidth:1,         width:"85%", marginLeft:"7%", marginTop:"10%"}}>
            
            <Image source={require("../../assets/imagens/Letter.png")} style={{width:26,marginRight:"4%"}}/>
            
            <TextInput placeholder="Email"></TextInput>
            
          </View>

          
            
          


            

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            
            

          </View>

          
        </View>
        
        </ScrollView>
       
    )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#EA8841"
  },

 

  containerLogo:{
    marginTop:"15%",
    marginBottom:"0%",
    flexDirection:"row",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    
  },

  containerForm:{
    flex:1,
    backgroundColor:"#fff",
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    paddingStart:"5%",
    paddingEnd:"5%",
    marginTop:"15%"
  },

  button:{
    
    backgroundColor:"#EA8841",
    borderRadius:50,
    paddingVertical:8,
    width:"60%",
    alignSelf:"center",
    marginTop:"11%",
    alignItems:"center",
    justifyContent:"center",
    

  },

  buttonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight:"bold"
  }

}) 