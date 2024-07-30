import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

// Import the avatar image
import avatar from './Src/avater.png'; // Adjust the path based on your folder structure

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    image: null,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (isModalVisible) {
      // Reset the form when the modal is closed
      setNewTask({title: '', description: '', image: null});
      setIsEditing(false);
      setEditTaskId(null);
    }
  };

  const handleAddOrUpdateTask = () => {
    if (isEditing) {
      setTasks(
        tasks.map(task =>
          task.id === editTaskId ? {...newTask, id: editTaskId} : task,
        ),
      );
    } else {
      setTasks([...tasks, {...newTask, id: Date.now().toString()}]);
    }
    toggleModal();
  };

  const handleEditTask = task => {
    setNewTask({
      title: task.title,
      description: task.description,
      image: task.image,
    });
    setEditTaskId(task.id);
    setIsEditing(true);
    toggleModal();
  };

  const handleDeleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setNewTask({...newTask, image: {uri: image.path, mime: image.mime}});
    });
  };

  const renderTask = ({item}) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{uri: item.image.uri}} style={styles.profileImage} />
      ) : (
        <Image source={avatar} style={styles.profileImage} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Icon name="edit" size={30} color="darkgray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Icon name="delete" size={30} color="darkgray" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>ToDo Task List</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Task' : 'Add Task'}
          </Text>
          {newTask.image ? (
            <Image
              source={{uri: newTask.image.uri}}
              style={styles.previewImage}
            />
          ) : (
            <TouchableOpacity
              style={styles.avatarPlaceholder}
              onPress={handleImagePicker}>
              <Image source={avatar} style={styles.previewImage} />
            </TouchableOpacity>
          )}
          <TextInput
            placeholder="Title"
            value={newTask.title}
            onChangeText={text => setNewTask({...newTask, title: text})}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newTask.description}
            onChangeText={text => setNewTask({...newTask, description: text})}
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleAddOrUpdateTask}>
            <Text style={styles.modalButtonText}>
              {isEditing ? 'Update Task' : 'Add Task'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f2f2f2'},
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2089dc',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth:1,
    borderColor:'lightgray'
  },
  profileImage: {width: 100, height: 100, borderRadius: 50, marginBottom: 10},
  avatarPlaceholder: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  title: {fontSize: 18, fontWeight: 'bold', marginTop: 10},
  description: {fontSize: 14, color: '#888', marginTop: 5},
  iconContainer: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginTop: 10,
    width: '100%',
  },
  modal: {backgroundColor: '#fff', padding: 20, borderRadius: 8},
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 5,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 5,
    textAlignVertical: 'top',
    height: 100, // Adjust based on your preference
    borderRadius:10
  },
  modalButton: {
    backgroundColor: '#2089dc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {color: '#fff'},
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
});

export default App;
