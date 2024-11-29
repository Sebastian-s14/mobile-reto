//Pregunta: Depuración de un Componente de React Native con Expo
//Se te proporciona el siguiente componente de React Native que tiene como objetivo obtener y
//mostrar una lista de elementos desde una API. El componente utiliza el flujo de trabajo administrado de Expo.
//Revisa el código a continuación e identifica los varios posibles problemas que podrían llevar a
//fallas, bloqueos o comportamientos ineficientes. Propone optimizaciones o correcciones donde sea necesario.
//
//Instrucciones:
//1. Identifica y describe dichos problemas.
//2. Sugiere modificaciones específicas al código para abordar los problemas identificados.
//3. Explica por qué cada modificación soluciona el problema.

import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Button,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native'
// Se comenta la importación de console ya que no es necesaria
// import console from 'console';

const PAGE_LIMIT = 4

const ItemList = () => {
    const [items, setItems] = useState([]) // Se cambia null por [] para que sea un arreglo vacío
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        fetchItems()

        // Se cambia [items] por [page] para que se ejecute fetchItems cada vez que cambie la página
    }, [fetchItems, page])

    // se agrega useCallback para evitar que se cree una nueva función cada vez que se renderiza el componente
    const fetchItems = useCallback(async () => {
        console.log('fetch data =====', page)
        try {
            const response = await fetch(
                `https://rickandmortyapi.com/api/character?page=${page}`
            )
            // Se agrega await a la respuesta para esperar a que se resuelva la promesa
            // const data = response.json();
            const data = await response.json()

            /**
             * Se cambia setItems(data.results) por setItems((state) => [...state, ...data.results])
             * para que se agreguen los nuevos elementos a los ya existentes
             */
            // setItems(data.results);
            setItems((state) => [...state, ...data.results])
        } catch (error) {
            console.error('Error al obtener los elementos:', error)
        } finally {
            setLoading(false)
        }
    }, [page])


    // const renderItem = ({ item }) => {
    //     return items.map((itm) => (
    //       <View
    //         key={itm.id}
    //         style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    //       >
    //         <Text>{itm.name}</Text>
    //       </View>
    //     ));
    //   };

    /**
     * Se cambia renderItem para que renderice un solo item
     * Se agrega useCallback para evitar que se cree una nueva función cada vez que se renderiza el componente
     */
    const renderItem = useCallback(({ item }) => {
        return (
            <View
                key={item.id}
                style={styles.item}
            >
                <Text>
                    {item.name}
                </Text>
            </View>
        )
    }, [])

    const handleLoadMore = () => {
        if (page < PAGE_LIMIT) {
            setPage(page + 1)
        }
    }

    if (loading) return <Loader />

    /**
     * Se agrega SafeAreaView para evitar que el contenido se superponga
     * en algunos dispositivos con notch o barra de estado
     */
    return (
        <SafeAreaView
            style={styles.container}
        >
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={15} // Se agrega initialNumToRender para renderizar los primeros 15 elementos
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={<ListFooter page={page} />}
            />
        </SafeAreaView>
    )
}

export default ItemList

// Se separan los estilos en un objeto para mejorar la legibilidad del código
const styles = StyleSheet.create({
    container: {
        flex: 1,
        /**
         * Se agrega paddingTop para evitar que el contenido se superponga
         * ya que SafeAreaView no funciona en Android
         */
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


// Se separan los componentes Loader y ListFooter para mejorar la legibilidad del código

export const Loader = () => {
    return (
        <View
            style={styles.loader}
        >
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export const ListFooter = ({ page }) => {
    if (page >= PAGE_LIMIT) return null
    return <Button title="Cargar Más" />
}
