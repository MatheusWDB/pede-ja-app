import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, ScrollView, Button, Modal, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default function Cardapio({ route }) {
  const navigation = useNavigation();
  const [visualizarQRCode, setVisualizarQRCode] = useState(false);
  const { idR } = route.params;
  const [data, setData] = useState([]);
  const [carregando, Carregando] = useState(false);
  const [pratoCriado, setPratoCriado] = useState(false)
  const [adicionar, setAdicionar] = useState(false);
  const [selecionar, setSelecionar] = useState(false);
  const [newPrato, setNewPrato] = useState({ nome: '', valor: '', ingredientes: [], imagem: null });
  const [selectedPrato, setSelectedPrato] = useState(null);
  const [menu, setMenu] = useState(false);

  const listarCaradapio = async () => {
    await axios.get(`https://pede-ja.onrender.com/${idR}/cardapio`)
      .then(function (resposta) {
        setData(resposta.data);
      })
      .catch(function (erro) {
        console.log(erro);
      });
  };

  const adicionarPrato = () => {
    Carregando(true)
    setAdicionar(true);
    Carregando(false)
  };

  const criarPrato = async () => {
    Carregando(true);
    await axios.post(`https://pede-ja.onrender.com/${idR}/cardapio`, newPrato)
      .then(function (resposta) {
      })
      .catch(function (erro) {
        console.log(erro);
      });
    setAdicionar(false);
    setNewPrato({ nome: '', valor: '', ingredientes: [], imagem: null })
    setPratoCriado(true);
    Carregando(false)
  };

  const pedirPermissao = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert('Permissão necessária', 'Você precisa conceder permissões para acessar a câmera e a galeria para usar este recurso.');
      return false;
    }
    return true;
  };

  const escolherImagem = async () => {
    const hasPermission = await pedirPermissao();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800, height: 600 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setNewPrato({ ...newPrato, imagem: base64 });
    }
  };

  const tirarFoto = async () => {
    const hasPermission = await pedirPermissao();
    if (!hasPermission) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800, height: 600 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setNewPrato({ ...newPrato, imagem: base64 });
    }
  };

  useEffect(() => {
    Carregando(true)
    listarCaradapio();
    setPratoCriado(false)
    Carregando(false)
  }, [pratoCriado]);

  const handleSelectPrato = async (prato) => {
    Carregando(true);
    setSelectedPrato(prato);
    setSelecionar(true);
    Carregando(false);
  };

  const atualizarPrato = async () => {
    Carregando(true);

    const idPr = parseInt(selectedPrato.idPrato, 10);

    await axios.put(`https://pede-ja.onrender.com/${idR}/cardapio/${idPr}`, selectedPrato)
      .then(function (resposta) {
      })
      .catch(function (erro) {
        console.log(erro);
      });
    Carregando(false);
    setSelecionar(false);
    setSelectedPrato(null);
    setPratoCriado(true)
    Carregando(false)
  };

  const deletarPrato = async () => {
    Carregando(true);

    const idPr = parseInt(selectedPrato.idPrato, 10);

    await axios.delete(`https://pede-ja.onrender.com/${idR}/cardapio/${idPr}`)
      .then(function (resposta) {

      })
      .catch(function (erro) {
        console.log(erro);
      });

    setSelecionar(false);
    setSelectedPrato(null);
    setPratoCriado(true)
    Carregando(false)
  };

  if (carregando) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const cancelarPrato = () => {
    setAdicionar(false)
    setNewPrato({ nome: '', valor: '', ingredientes: [], imagem: null })
  }

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}>
        <Text style={{ color: "#fff", fontSize: 36 }}>PEDE</Text>
        <Image
          source={require('../../assets/imagens/burger.png')}
        />
        <Text style={{ color: "#fff", fontSize: 36 }}>JÁ</Text>
        <TouchableOpacity >
          <Text style={{ fontSize: 24, color: '#ffffff', left:"1000%", ...Platform.select({
      android: {
        fontSize: 24,
        left: '300%'
      }
    }) }} onPress={() => setMenu(true)}
          >☰</Text>
        </TouchableOpacity>


      </View>

      <Modal visible={menu}
        transparent={true}
        onRequestClose={() => setMenu(false)}
      >

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, width: '80%', borderRadius: 25 }}>


            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Pedidos', { idR: idR }), setMenu(false)}}>
              <Text style={{ color: '#fff' }}>Ver pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: '#fff' }}>Sair da conta</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
              setMenu(!menu);
            }} style={styles.button}>
              <Text style={{ color: '#fff' }}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>

      <View style={{ flex: 10, backgroundColor: '#ffffff' }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.idPrato.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectPrato(item)} style={styles.pratoItem}>
              <ScrollView>

                <View style={styles.info}>
                  <View style={{ width: 90, height: 90, backgroundColor: 'gray', borderRadius: 15 }}>

                    {item.imagem ?
                      <Image
                        style={{ width: 90, height: 90, borderRadius: 15 }}
                        source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                      /> : <Image
                      style={{ width: 90, height: 90, borderRadius: 15 }}
                      source={require('../../assets/imagens/Imagenull.jpeg')}
                    />
                    }
                  </View>
                  <View style={styles.infoTexto}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.nome}</Text>
                    <Text >{item.ingredientes ? item.ingredientes.join(', ') : 'Ingredientes não disponíveis'}</Text>
                    <Text >R${item.valor.replace('.', ',')}</Text>
                  </View>
                </View>


              </ScrollView>
            </TouchableOpacity>
          )}
        />

      </View>
      
      <Modal visible={selecionar} animationType="slide">
        <View style={{ flex: 1 }}>
          {selectedPrato && (
            <View>
              <View style={{ width: 150, height: 150, borderRadius: 15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                {selectedPrato.imagem ?
                  <Image
                    style={{ width: 150, height: 150, borderRadius: 15, alignSelf: 'center' }}
                    source={{ uri: `data:image/jpeg;base64,${selectedPrato.imagem}` }}
                  /> : <Image
                  style={{ width: 150, height: 150, borderRadius: 15 }}
                  source={require('../../assets/imagens/Imagenull.jpeg')}
                />
                }
              </View>

              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Nome:</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={selectedPrato.nome}
                  onChangeText={(text) => setSelectedPrato({ ...selectedPrato, nome: text })}
                />
              </View>
              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Ingredientes:</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={selectedPrato.ingredientes.join(', ')}
                  onChangeText={(text) => setSelectedPrato({ ...selectedPrato, ingredientes: text.split(', ') })}
                />
              </View>
              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Preço: R$</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={selectedPrato.valor.replace('.', ',').toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => setSelectedPrato({ ...selectedPrato, valor: text.replace(',', '.') })}
                />
              </View>
            </View>
          )}

          <TouchableOpacity onPress={atualizarPrato} style={styles.button}>
            <Text style={{ color: '#fff' }}>Atualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelecionar(false); setSelectedPrato(null); }} style={styles.button}>
            <Text style={{ color: '#fff' }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deletarPrato} style={styles.button}>
            <Text style={{ color: '#fff' }}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={adicionar} animationType="slide">
        <View style={styles.modalView}>
          <View style={{ width: 150, height: 150, borderRadius: 15, alignSelf: 'center' }}>
            {newPrato.imagem ?
              <Image
                style={{ width: 150, height: 150, borderRadius: 15, alignSelf: 'center' }}
                source={{ uri: `data:image/jpeg;base64,${newPrato.imagem}` }}
              /> : <Image
              style={{ width: 150, height: 150, borderRadius: 15 }}
              source={require('../../assets/imagens/Imagenull.jpeg')}
            />
            }
          </View>
          <View style={{width:"30%" ,alignContent:'center', justifyContent:"center", alignSelf:"center", marginTop:"3%", marginBottom:'3%'}}>

          
          <TextInput
          style={{textAlign:"center"}}
            placeholder="Nome"
            onChangeText={(text) => setNewPrato({ ...newPrato, nome: text })}
          />

          <TextInput
          style={{textAlign:"center"}}
            placeholder="Valor"
            keyboardType="numeric"
            onChangeText={(text) => setNewPrato({ ...newPrato, valor: text.replace(',', '.') })}
          />

          <TextInput
          style={{textAlign:"center"}}
            placeholder="Ingredientes"
            onChangeText={(text) => setNewPrato({ ...newPrato, ingredientes: text.split(',').map(item => item.trim().toLowerCase()) })}
          />
</View>
          <TouchableOpacity onPress={escolherImagem} style={styles.button}>
            <Text style={{ color: '#fff' }}>Escolher a imagem</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={tirarFoto} style={styles.button}>
            <Text style={{ color: '#fff' }}>Tirar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={criarPrato} style={styles.button}>
            <Text style={{ color: '#fff' }}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(cancelarPrato)} style={styles.button}>
            <Text style={{ color: '#fff' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={visualizarQRCode} animationType="slide" >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <QRCode
                value={`${idR}`}
                size={200}
                style={{ borderWidth: 1 }}
              />

              <TouchableOpacity onPress={() => setVisualizarQRCode(false)} style={styles.button}>
                <Text style={{ color: '#fff' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ flex: 1, backgroundColor: '#FFF', padding: 10, flexDirection: 'row', borderWidth: 1, justifyContent:"center",   ...Platform.select({
      android: {
        padding: 10,
        
      }
    }) }}>
        <TouchableOpacity onPress={adicionarPrato} style={styles.buttonFim}>
          <Text style={{ color: '#fff' }}>Adicionar Prato</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisualizarQRCode(true)} style={styles.buttonFim}>
          <Text style={{ color: '#fff' }}>Mostrar QRcode</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA8841",
  },



  containerLogo: {
    flexDirection: "row",
    width:'100%',
    marginTop:'4%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#EA8841',
    marginBottom:'4%',
    ...Platform.select({
      android: {
        width: "100%",
        height: 80,
      }
    })
  },

  button: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    paddingVertical: 8,
    width: 200,
    alignSelf: "center",
    alignItems: "center",
    marginTop: '1%',
    borderWidth: 1,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        width: 200,
        paddingVertical: 8,
        marginTop: '5%',
      }
    })
  },

  buttonFim: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    padding: 8,
    width: 150,
    alignSelf: "center",
    alignItems: "center",
    alignContent: 'center',
    justifyContent:"center",
    borderWidth: 1,
    marginHorizontal: '5%',
    ...Platform.select({
      android: {
        marginHorizontal: '5%',
        width: 150,
      }
    })
  },
  pratoItem: {
    marginVertical: 15,
    padding: 5,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    ...Platform.select({
      android: {
        marginVertical: 15,
        padding: 5,
        width: '95%',
      }
    })
  },
  info: {
    flexDirection: 'row',
    ...Platform.select({
      android: {

        
      }
    })
  },
  infoTexto: {
    justifyContent: 'space-around',
    marginLeft: 50
  },
  selecionar: {
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    height: 35,
    justifyContent: 'flex-end'
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    
    width: 200,
    position: 'absolute',
    right: '45%',
    paddingLeft: 10,
    ...Platform.select({
      android: {
        width: 200,
        right: '15%',
        paddingLeft: 10,
        marginLeft: 5,
      }
    })
  },
  textInput: {
    borderWidth: 0,
    marginRight: '56%',
    ...Platform.select({
      android: {
        marginRight: '65%'
        
      }
    })
  },
});
