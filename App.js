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

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Button,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from 'react-native'
// import console from 'console';

const PAGE_LIMIT = 4

const ItemList = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        fetchItems()
    }, [fetchItems, page])

    const fetchItems = useCallback(async () => {
        console.log('fetch data =====', page)
        try {
            const response = await fetch(
                `https://rickandmortyapi.com/api/character?page=${page}`
            )
            const data = await response.json()

            setItems((state) => [...state, ...data.results])
        } catch (error) {
            console.error('Error al obtener los elementos:', error)
        } finally {
            setLoading(false)
        }
    }, [page])

    const renderItem = useCallback(({ item }) => {
        return (
            <View
                key={item.id}
                style={{
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                }}
            >
                <Text>
                    {item.id} - {item.name}
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

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop:
                    Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}
        >
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={15}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={<ListFooter page={page} />}
            />
        </SafeAreaView>
    )
}

export default ItemList

export const Loader = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export const ListFooter = ({ page }) => {
    if (page >= PAGE_LIMIT) return null
    return <Button title="Cargar Más" />
}
