import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { ImageManipulator, ImagePicker, Permissions } from "expo";

const imageOpts = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  exif: true
  // base64: true,
  // quality: 0.5
};

class PhotoButtonAndSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.value || []
    };
  }

  setStateX(v) {
    if (v && v.images && this.props.onChange) this.props.onChange(v.images);
    this.setState(v);
  }

  _camera = async _ => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    if (cameraPerm === "granted") {
      return ImagePicker.launchCameraAsync(imageOpts);
    }
  };

  _library = async _ => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (cameraRollPerm === "granted") {
      return ImagePicker.launchImageLibraryAsync(imageOpts);
    }
  };

  _pickImage = async () => {
    try {
      let res = await this._camera();
      if (res.cancelled) res = await this._library();
      this._handleImagePicked(res);
    } catch (e) {
      this._handleImagePicked(await this._library());
    }
  };

  // handle padding the images list for uniform layout
  _fixPhotoListSize(images) {
    var newImagesList = images.filter(e => !e.uri.startsWith("empty-"));
    while (newImagesList.length % 3 !== 0)
      newImagesList.push({ uri: "empty-" + Math.random() });
    return newImagesList;
  }

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;
    console.log("pickerResult: " + JSON.stringify(pickerResult));

    if (!pickerResult || pickerResult.cancelled) {
      console.log("not adding photo because cancelled");
      return;
    }

    var resized = await ImageManipulator.manipulate(
      pickerResult.uri,
      [{ resize: { width: 1024 } }],
      {
        format: "jpeg",
        compress: 0.5
      }
    );
    pickerResult.uri = resized.uri;

    this.setState({
      uploading: true
    });
    if (!pickerResult.cancelled) {
      this.setStateX({
        images: [...this.state.images, pickerResult]
      });
      this.setStateX({});
    }
  };

  render() {
    var images = this._fixPhotoListSize(this.state.images);
    let imageCount = images.filter(i => !i.uri.startsWith("empty-")).length;
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            marginTop: 7,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 15,
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderBottomColor: "#2884C6",
            borderBottomWidth: 1
          }}
          onPress={() => this._pickImage()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../Assets/pictureIcon.png")}
              style={{ height: 25, width: 25 }}
              resizeMode={"contain"}
            />
            <Text
              style={{
                fontSize: 20,
                letterSpacing: 0,
                color: "#231F20",
                //fontFamily: "Univers LT Std";
                marginLeft: 20
              }}
            >
              Add Photos
              {imageCount > 0 && ` (${imageCount})`}
            </Text>
          </View>
          <View>
            <Image
              style={{
                height: 25,
                width: 25,
                paddingHorizontal: 5,
                paddingVertical: 5
              }}
              resizeMode={"contain"}
              source={require("../Assets/plusIcon.png")}
            />
          </View>
        </TouchableOpacity>
        <FlatList
          ref="photoList"
          numColumns={3}
          style={{
            flex: 1,
            marginHorizontal: 15,
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: "#eee",
            marginBottom: 10
          }}
          data={images}
          showsVerticalScrollIndicator={true}
          onContentSizeChange={(x, y, z) => {
            if (y < 1) return;
            this.refs.photoList.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => {
            if (item.uri.startsWith("empty-"))
              return <View style={{ flex: 1, margin: 1 }} />;
            return (
              <TouchableOpacity
                onPress={e =>
                  Alert.alert(
                    "Delete Photo?",
                    "Please be careful this is a permanent action",
                    [
                      {
                        text: "Delete",
                        onPress: () => {
                          this.setStateX({
                            images: this.state.images.filter(
                              x => x.uri != item.uri
                            )
                          });
                        }
                      },
                      { text: "Cancel", style: "cancel" }
                    ],
                    { cancelable: false }
                  )
                }
                style={{
                  backgroundColor: "red",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 1,
                  height: 100
                }}
              >
                <Image
                  source={item}
                  style={{
                    height: "100%",
                    width: "100%"
                  }}
                  onError={err => Alert.alert("Error loading image")}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.uri}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  // setServicesPerformed
};

const mapStateToProps = state => ({
  selectedLocation: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoButtonAndSection);
