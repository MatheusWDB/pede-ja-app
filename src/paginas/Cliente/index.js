import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, ScrollView, Button, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';

export default function Cliente({ route }) {
  const [Pratos, setPratos] = useState([])
  const  idR  = 2;
  const [cliente, setCliente] = useState({ nome: '', telefone: '', mesa: '' });
  const [formVisible, setFormVisible] = useState(true);
  const [selectedPrato, setSelectedPrato] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoVisible, setPedidoVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [modalQrcode, setModalQrcode] = useState(true)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  if (carregando) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const fetchPratos = async () => {
    await axios.get(`http://192.168.0.8:3000/${idR}/cardapio`)
      .then(function (resposta) {
        setPratos(resposta.data)
      })
      .catch(function (erro) {
        console.log(erro);
      });
  };

  const handleFormSubmit = () => {
    setCarregando(true)

    for (let propriedade in cliente) {
      if (cliente.hasOwnProperty(propriedade)) {
        if (cliente[propriedade] === null || cliente[propriedade] === '') {
          Alert.alert(`O campo ${propriedade} é obrigatório.`);
          return
        }
        setFormVisible(false);
        setPedidos([cliente])
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
    // Cria um objeto contendo apenas o idPrato e a quantidade
    const newPrato = { idPrato: selectedPrato.idPrato, quantidade, observacao };
    // Adiciona o novo pedido à lista de pedidos
    setPedidos([...pedidos, newPrato]);
    // Limpa os campos e fecha o modal
    setModalVisible(false);
    setSelectedPrato(null);
    setObservacao('');
    setQuantidade(1);
    setCarregando(false)
    console.log(pedidos)
  };

  const handleFinalizarPedido = () => {
    setCarregando(true)
    setPedidoVisible(true);
    console.log(pedidos)
    setCarregando(false)
  };

  const handleConfirmarPedido = async () => {
    setCarregando(true)
    await axios.post(`http://192.168.0.8:3000/${idR}/cliente/realizar_pedido`, pedidos)
      .then(function (resposta) {
        setPedidoVisible(false); // Fecha o modal de finalizar pedido
        setPedidos([cliente]); // Limpa a lista de pedidos
      })
      .catch(function (erro) {
        console.log(erro);
      });
    setCarregando(false)
  };

  return (
    <ScrollView style={{ backgroundColor: '#ffffff' }}>

      <View style={styles.container}>
        <View style={styles.containerLogo}>
          <Text style={{ color: "#fff", fontSize: 36 }}>PEDE</Text>

          <Image
            source={require('../../assets/imagens/burger.png')}
            style={{}}
          />

          <Text style={{ color: "#fff", fontSize: 36 }}>JÁ</Text>
        </View>

        <View style={styles.containerForm}>
          <Modal visible={formVisible} animationType="slide">
            <TextInput
              placeholder="Nome"
              onChangeText={(text) => setCliente({ nome: text })}
            />
            <TextInputMask
              placeholder="Telefone"
              onChangeText={(text) => setCliente({ telefone: text })}
              type="cel-phone"
              options={{
                maskType: "BRL",
                withDDD: true,
                dddMask: '(99) '
              }}
            />
            <TextInput
              placeholder="Mesa"
              keyboardType='number-pad'
              onChangeText={(text) => setCliente({ mesa: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
              <Text>Enviar</Text>
            </TouchableOpacity>
          </Modal>

          <Modal visible={isModalVisible} animationType="slide">
            {selectedPrato && (
              <>
                {selectedPrato.imagem ?
                  <Image
                    style={{ width: 90, height: 90, borderRadius: 100, alignSelf: 'center' }}
                    source={{ uri: `data:image/jpeg;base64,${selectedPrato.imagem}` }}
                  /> : null
                }

                <Text style={{ alignSelf: 'center' }}>Nome: {selectedPrato.nome}</Text>
                <Text style={{ alignSelf: 'center' }}>Valor: R${selectedPrato.valor.replace('.', ',')}</Text>
                <Text style={{ alignSelf: 'center' }}>Ingredientes: {selectedPrato.ingredientes ? selectedPrato.ingredientes.join(', ') : 'Ingredientes não disponíveis'}</Text>
                <TextInput
                  placeholder="Observação"
                  onChangeText={(text) => setObservacao(text)}
                  style={{ alignSelf: 'center' }}
                />

                <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: '10%' }}>

                  <Button title="-" onPress={() => setQuantidade(Math.max(1, quantidade - 1))} />
                  <Text>{quantidade}</Text>
                  <Button title="+" onPress={() => setQuantidade(quantidade + 1)} />
                </View>
              </>
            )}

            <TouchableOpacity onPress={handleAddPedido} style={styles.button}>
              <Text>Adicionar ao Pedido</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedPrato(null); }} style={styles.button2} >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </Modal>

          <Modal visible={!modalQrcode} animationType='slide'>
            <View >
              {scanned && <Button title={'Toque para escanear novamente'} onPress={() => setScanned(false)} />}
              <TouchableOpacity onPress={() => setModalQrcode(false)}>
                <Text>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal visible={pedidoVisible} animationType="slide">
            <FlatList
              data={pedidos.slice(1)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ marginTop: '10%' }}>
                  <Text>Nome: {item.nome}</Text>
                  <Text>Quantidade: {item.quantidade}</Text>
                  <Text>Observação: {item.observacao}</Text>

                </View>
              )}
            />
            <Text>Valor Final: R$</Text>
            <Button title="Confirmar Pedido" onPress={handleConfirmarPedido} />
            <Button title="Cancelar" onPress={() => setPedidoVisible(false)} />
          </Modal>

          <FlatList
            data={Pratos}
            keyExtractor={(item) => item.idPrato.toString()}
            renderItem={({ item }) => (
              <View style={styles.pratoItem}>
                {item.imagem ?
                  <Image
                    style={{ width: 90, height: 90, alignSelf: 'center', borderRadius: 100 }}
                    source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                  /> : null
                }
                <Text style={{ alignSelf: 'center' }}>{item.nome}</Text>
                <Text style={{ alignSelf: 'center' }}>R${item.valor.replace('.', ',')}</Text>
                <Text style={{ alignSelf: 'center' }}>{item.ingredientes ? item.ingredientes.join(', ') : 'Ingredientes não disponíveis'}</Text>
                <TouchableOpacity style={styles.button2} onPress={() => handleSelectPrato(item)}>
                  <Text>Selecionar</Text>
                </TouchableOpacity>

              </View>
            )}
          />
          <TouchableOpacity onPress={handleFinalizarPedido} style={styles.button2}>
            <Text>Finalizar Pedido</Text>
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
    marginTop: "15%"
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
    marginTop: 20,
    marginBottom: 20,
    width: '70%',
    alignItems: "center",
    alignSelf: 'center',
    borderRadius: 40,
    borderWidth: 1
  },
});
