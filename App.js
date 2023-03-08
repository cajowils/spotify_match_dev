import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Buffer } from 'buffer';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
const local = "http://localhost:3000/";
const server = "http://spotify-match.us-west-1.elasticbeanstalk.com/profilepictures/";
const host = server;
const userId = "0";





export default function App() {

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [sentPic, setSentPic] = useState(null);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [1, 1],
      quality: 1,
      selectionLimit: 4,
      orderedSelection: true

    });


    if (!result.canceled) {
      setImage1(result.assets[0].uri);
      setImage2(result.assets[1].uri);
      setImage3(result.assets[2].uri);
      setImage4(result.assets[3].uri);
    }
  };

  const formatImage = async (image) => {
    const resizedImage = await ImageManipulator.manipulateAsync(
      image,
      [{ resize: { width: 200, height: 200 } }],
      { format: 'jpeg' }
    );

    const newuri = resizedImage.uri
      
    var base64 = await FileSystem.readAsStringAsync(newuri, { encoding: 'base64' }).catch(error => console.log(error));


    const byteArray = Buffer.from(base64, 'base64');
    const byteaValue = `\\x${byteArray.toString('hex')}`;

    const test64 = new Buffer.from(byteArray).toString('base64');
      console.log("base 64 of sent image:");
      console.log(test64);
      setSentPic(test64);

    return byteaValue;

  }

    const sendPictures = async () => {

      const profilepictures = {
      id: userId,
      picture1: await formatImage(image1),
      picture2: await formatImage(image2),
      picture3: await formatImage(image3),
      picture4: await formatImage(image4)
      };

      console.log(profilepictures);

    axios.put(host + userId, profilepictures)
          .then((response) => {
              console.log(response.data)
          })
          .catch(error => console.log(error));
    };

    const [picture1, setPicture1] = useState("");
    const [picture2, setPicture2] = useState("");
    const [picture3, setPicture3] = useState("");
    const [picture4, setPicture4] = useState("");


    const getPictures = () => {
            axios
                .get(host + userId)
                .then((response) => {
                    console.log(response.data)
                    const picture1 = response.data[0].picture1.data;
                    const picture2 = response.data[0].picture2.data;
                    const picture3 = response.data[0].picture3.data;
                    const picture4 = response.data[0].picture4.data;

                    pic1 = new Buffer.from(picture3).toString('base64');

                    console.log(pic1);



                  
                    setPicture1(new Buffer.from(picture1).toString('base64'));
                    setPicture2(new Buffer.from(picture2).toString('base64'));
                    setPicture3(new Buffer.from(picture3).toString('base64'));
                    setPicture4(new Buffer.from(picture4).toString('base64'));


                })
                .catch(error => console.log(error));
        };

  return (
    <View style={styles.container}>
      <View styles={styles.picturebox}>
      <Image
            style={styles.image}
            source={{
              uri: "data:image/jpeg;base64," + picture1,
            }}
          />
          <Image
            style={styles.image}
            source={{
              uri: "data:image/jpeg;base64," + picture2,
            }}
          />
          <Image
            style={styles.image}
            source={{
              uri: "data:image/jpeg;base64," + picture3,
            }}
          />
          <Image
            style={styles.image}
            source={{
              uri: "data:image/jpeg;base64," + picture4,
            }}
          />
      </View>
        
      <Button title={"Get Pictures"}
                      onPress={getPictures} color="green" />
      <Button title={"Send Picture"}
                      onPress={sendPictures} color="red" />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image1 && <Image source={{ uri: image1 }} style={styles.image} />}
      <Image
            style={styles.image}
            source={{
              uri: "data:image/jpeg;base64," + sentPic,
            }}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
          flex: 0.5,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "flex-start",
      },
  picturebox: {
          flex: 0.5,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
  },
  image: {
          width: 100,
          height: 100,
          resizeMode: 'cover',
          backgroundColor: 'red',
      },
  text: {
          fontSize: 1,
  }
});