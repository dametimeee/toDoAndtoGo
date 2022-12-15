import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { theme } from "./colors";

const STORAGE_CONTENT_KEY = "@toDos";
const STORAGE_HEADERLOAD_KEY = "@header";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    loadToDos();
  }, []);
  useEffect(() => {
    loadHeader();
  }, []);

  const loadHeader = async () => {
    const h = await AsyncStorage.getItem(STORAGE_HEADERLOAD_KEY);
    h === "true" ? setWorking(true) : setWorking(false);
  };

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(STORAGE_HEADERLOAD_KEY, "false");
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(STORAGE_HEADERLOAD_KEY, "true");
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_CONTENT_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working, complete } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm sure",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
        style: "destructive",
      },
    ]);
  };
  const completeToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].complete = true;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          value={text}
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text
                style={
                  toDos[key].complete
                    ? { ...styles.toDoText, textDecorationLine: "line-through" }
                    : styles.toDoText
                }
              >
                {toDos[key].text}
              </Text>
              <View style={styles.toDoIcon}>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  <Feather name="check" size={24} color={theme.grey} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto
                    name="trash"
                    size={18}
                    color={theme.grey}
                    style={styles.toDoIconTrash}
                  ></Fontisto>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 34,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toDoIcon: {
    flexDirection: "row",
  },
  toDoIconTrash: {
    marginLeft: 10,
  },
});
