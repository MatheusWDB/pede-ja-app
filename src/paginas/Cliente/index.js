import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, ScrollView, Button, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { TextInputMask, TextMask } from 'react-native-masked-text';

export default function Cliente() {

  const [Pratos, setPratos] = useState([])
  const [idR, setIdR] = useState(0);
  const [cliente, setCliente] = useState({ nome: '', telefone: '', mesa: '' });
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPrato, setSelectedPrato] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoVisible, setPedidoVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [modalQrcode, setModalQrcode] = useState(true)
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [valorFinal, setValorFinal] = useState(0);

  const incrementarQuantidade = (index) => {
    const novosPedidos = [...pedidos];
    novosPedidos[index + 1].quantidade += 1; // index + 1 para ignorar o primeiro item (dados do cliente)
    setPedidos(novosPedidos);
    setValorFinal(calcularValorFinal(novosPedidos));
    console.log(pedidos)
  };

  const decrementarQuantidade = (index) => {
    const novosPedidos = [...pedidos];
    novosPedidos[index + 1].quantidade -= 1; // index + 1 para ignorar o primeiro item (dados do cliente)
    if (novosPedidos[index + 1].quantidade === 0) {
      novosPedidos.splice(index + 1, 1); // Remove o item se a quantidade for zero
    }
    setPedidos(novosPedidos);
    setValorFinal(calcularValorFinal(novosPedidos));
    console.log(pedidos)
  };

  const handleBarCodeScanned = async ({ typ, data }) => {
    setIdR(parseInt(data));
    if (typeof idR === 'number' && idR > 0) {
      console.log(typeof idR)
      console.log(idR)
      setModalQrcode(false);
      setFormVisible(true)
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (carregando) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const fetchPratos = async () => {
    setCarregando(true);
    await axios.get(`http://192.168.0.8:3000/${idR}/cardapio`)
      .then(function (resposta) {
        setPratos(resposta.data)
      })
      .catch(function (erro) {
        console.log(erro);
      });
    setCarregando(false);
  };

  const handleFormSubmit = () => {
    setCarregando(true)

    for (let propriedade in cliente) {
      if (cliente.hasOwnProperty(propriedade)) {
        if (cliente[propriedade] === null || cliente[propriedade] === '') {
          Alert.alert(`O campo ${propriedade} é obrigatório.`);
          return
        }
        setPedidos([cliente])
        setFormVisible(false);
        fetchPratos();
      }
    }
    setCarregando(false)
  };

  const handleSelectPrato = async (prato) => {
    setCarregando(true)
    setSelectedPrato(prato);
    setModalVisible(true);
    setCarregando(false)
  };

  const handleAddPedido = () => {
    setCarregando(true)
    const newPrato = { idPrato: selectedPrato.idPrato, quantidade, observacao, nome: selectedPrato.nome, valor: selectedPrato.valor };
    // Adiciona o novo pedido à lista de pedidos
    setPedidos([...pedidos, newPrato]);
    // Limpa os campos e fecha o modal
    setModalVisible(false);
    setSelectedPrato(null);
    setObservacao('');
    setQuantidade(1);
    setCarregando(false)

  };

  const handleFinalizarPedido = () => {
    setCarregando(true)
    setPedidoVisible(true);
    setValorFinal(calcularValorFinal(pedidos));
    setCarregando(false)
    console.log(pedidos)
  };

  const handleConfirmarPedido = async () => {
    setCarregando(true)

    let novoPedido = pedidos.map((obj, index) => {
      if (index === 0) {
        return obj; // Mantém o primeiro objeto inalterado
      } else {
        const { idPrato, observacao, quantidade } = obj;
        return { idPrato, observacao, quantidade };
      }
    });
    console.log(novoPedido)
    await axios.post(`http://192.168.0.8:3000/${idR}/cliente/realizar_pedido`, novoPedido)
      .then(function (resposta) {
        setPedidoVisible(false); // Fecha o modal de finalizar pedido
        setPedidos([cliente]); // Limpa a lista de pedidos
      })
      .catch(function (erro) {
        console.log(erro);
      });
    setCarregando(false)
  };

  const calcularValorFinal = (pedidos) => {
    const total = pedidos.slice(1).reduce((acc, item) => acc + item.quantidade * item.valor, 0);
    return total.toFixed(2).replace('.', ',');
  };

  return (
    <View style={styles.container}>

      <Modal visible={modalQrcode} animationType='slide'>
        <View>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '50%', height: 20, borderWidth: 0 }}>Aponte a câmera para o código QR</Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', }}>

          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            <View style={styles.buttonContainer}>
            </View>
          </CameraView>
          <TouchableOpacity style={styles.buttonC} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Virar Camera</Text>
          </TouchableOpacity>

        </View>
      </Modal>

      <Modal visible={formVisible} animationType="slide">
        <View style={styles.containerForm}>
          <Text style={{ fontWeight: 'bold', color: "#EA8841", }}>Preencha os campos do cliente</Text>
          <TextInput
            placeholder="Nome"
            value={cliente.nome}
            onChangeText={(text) => setCliente({...cliente,  nome: text })}
            style={{ borderWidth: 1, width: 200, textAlign: 'center' }}
          />
          <TextInputMask
            placeholder="Telefone"
            value={cliente.telefone}
            onChangeText={(text) => setCliente( {...cliente, telefone: text })}
            type="cel-phone"
            keyboardType='phone-pad'
            options={{
              maskType: "BRL",
              withDDD: true,
              dddMask: '(99) '
            }}
            style={{ borderWidth: 1, width: 200, textAlign: 'center' }}
          />
          <TextInput
            placeholder="Mesa"
            value={cliente.mesa}
            keyboardType='number-pad'
            onChangeText={(text) => setCliente( {...cliente, mesa: text })}
            style={{ borderWidth: 1, width: 200, textAlign: 'center' }}
          />
          <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
            <Text>Enviar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isModalVisible} animationType="slide">

        <View style={{ flex: 1 }}>
          {selectedPrato && (
            <View>
              <View style={{ width: 150, height: 150, backgroundColor: 'gray', borderRadius: 15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                {selectedPrato.imagem ?
                  <Image
                    style={{ width: 150, height: 150, borderRadius: 15, alignSelf: 'center' }}
                    source={{ uri: `data:image/jpeg;base64,${selectedPrato.imagem}` }}
                  /> : null
                }
              </View>

              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Nome:</Text>
                <Text style={styles.input}>{selectedPrato.nome}</Text>
              </View>

              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Ingredientes:</Text>
                <Text style={styles.input}>
                  {selectedPrato.ingredientes.join(', ')}
                </Text>

              </View>
              <View style={styles.selecionar}>
                <Text style={styles.textInput}>Preço: R$</Text>
                <Text style={styles.input}>
                  {selectedPrato.valor.replace('.', ',').toString()}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>


                <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))} style={styles.buttonAdd}>
                  <Text style={{ fontSize: 20, color: 'white' }}>-</Text>
                </TouchableOpacity>

                <Text style={{ marginHorizontal: 10, width: 20, textAlign: 'center', color: "#EA8841", fontWeight: 'bold' }}>{quantidade}</Text>

                <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)} style={styles.buttonAdd}>
                  <Text style={{ fontSize: 20, color: 'white' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

          )}
        </View>

        <TouchableOpacity onPress={handleAddPedido} style={styles.button}>
          <Text style={{ color: 'white' }}>Adicionar ao Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedPrato(null); }} style={styles.button2} >
          <Text style={{ color: 'white' }}>Cancelar</Text>
        </TouchableOpacity>
      </Modal>

      <Modal visible={pedidoVisible} animationType="slide">

        <View style={{ flex: 1, justifyContent: 'center', }}>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: '#EA8841', fontSize: 20, alignSelf: 'center', }}>Seu Pedido</Text>
          </View>
          <View style={{ borderWidth: 0, flexDirection: 'row', flex: 0.3, marginBottom: 15 }}>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.textInput}>Nome:</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.textInput}>Qtd:</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={styles.textInput}>Valor:</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={styles.textInput}>Observação:</Text>
            </View>
          </View>
          <View style={{ borderWidth: 1, flex: 3 }}>
            <FlatList
              data={pedidos.slice(1)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ScrollView>
                  <View style={{ marginTop: 10, flexDirection: 'row' }}>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text>{item.nome}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => decrementarQuantidade(index)}
                        style={{ backgroundColor: "#EA8841", width: 20, height: 20, alignItems: 'center', }}
                      >
                        <Text style={{ color: 'white' }}>-</Text>
                      </TouchableOpacity>

                      <Text style={{ marginHorizontal: 10 }}>{item.quantidade}</Text>

                      <TouchableOpacity
                        onPress={() => incrementarQuantidade(index)}
                        style={{ backgroundColor: "#EA8841", width: 20, height: 20, alignItems: 'center', }}
                      >
                        <Text style={{ color: 'white' }}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                      <Text>{`R$${(item.quantidade * item.valor).toFixed(2).replace('.', ',')}`}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                      <Text>{item.observacao ? item.observacao : 'N/A'}</Text>
                    </View>
                  </View>
                </ScrollView>
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textInput}>Valor Final: R${valorFinal}</Text>
            <View>
              <TouchableOpacity onPress={handleConfirmarPedido} style={styles.button2}>
                <Text>Confirmar Pedido</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setPedidoVisible(false)} style={styles.button2}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>

      <View style={styles.containerLogo}>
        <Text style={{ color: "#fff", fontSize: 36 }}>PEDE</Text>

        <Image
          source={require('../../assets/imagens/burger.png')}
          style={{}}
        />

        <Text style={{ color: "#fff", fontSize: 36 }}>JÁ</Text>
      </View>

      <View style={{ flex: 10, backgroundColor: '#ffffff' }}>
        <FlatList
          data={Pratos}
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
                      /> : null
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

      <TouchableOpacity onPress={handleFinalizarPedido} style={styles.button2}>
        <Text>Finalizar Pedido</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA8841",
  },
  containerLogo: {
    marginTop: "7%",
    backgroundColor: '#EA8841',
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
    marginTop: "15%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: '10%'
  },
  button2: {
    backgroundColor: "#EA8841",
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    alignSelf: "center",
    marginTop: "5%",
    alignItems: "center",
    justifyContent: "center",
    bottom: 10
  },
  pratoItem: {
    marginVertical: 15,
    padding: 5,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
  },
  info: {
    flexDirection: 'row',
  },
  infoTexto: {
    justifyContent: 'space-around',
    marginLeft: 50
  },
  camera: {
    height: 200,
    width: 200,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  buttonC: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: "#EA8841",
    borderRadius: 50,
    paddingVertical: 8,
    width: 200,
    justifyContent: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
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
    marginLeft: 5,
    width: 200,
  },
  textInput: {
    borderWidth: 0,
    color: "#EA8841",
    fontWeight: 'bold'
  },
  buttonAdd: {
    backgroundColor: "#EA8841",
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
