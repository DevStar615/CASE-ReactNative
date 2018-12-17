import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { Constants } from "expo";

class CommentInputButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedService: undefined,
      selectedServiceOption: undefined,
      selectedServices: {},
      expandedService: null,
      images: [],
      modalVisible: false,
      comments: this.props.value || [],
      draftCommentFirstName: "",
      draftCommentLastName: "",
      draftComment: ""
    };
    if (this.state.comments && this.state.comments.length > 0)
      this.state.draftComment =
        "" + (this.state.comments[0] ? this.state.comments[0].comment : "");
  }
  componentDidMount() {}

  _commentModalCancel() {
    this.setState({
      showCommentsModal: false,

      draftComment:
        "" + (this.state.comments[0] ? this.state.comments[0].comment : "")
    });
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showCommentsModal: true });
        }}
        style={{
          marginTop: 7,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../Assets/noteIcon.png")}
            style={{ height: 20, width: 20 }}
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
            Add Comments{" "}
            {this.state.comments.length > 0
              ? "(" + this.state.comments.length + ")"
              : ""}
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
        <Modal
          visible={this.state.showCommentsModal === true}
          onRequestClose={this._commentModalCancel.bind(this)}
          onShow={() => {
            this.__commentInput.focus();
          }}
        >
          <ImageBackground
            style={{
              flex: 1,
              paddingTop: 20
            }}
            source={require("../Assets/HomeScreenBackground.png")}
          >
            <KeyboardAvoidingView
              behavior="height"
              style={{
                flex: 1,
                // paddingTop: 100,
                paddingLeft: 10,
                paddingRight: 10,
                alignItems: "center",
                flexDirection: "column",
                // alignContent: "center",
                alignContent: "space-around"
              }}
              keyboardVerticalOffset={Constants.statusBarHeight}
            >
              <Text style={{ color: "white", fontSize: 32, paddingBottom: 0 }}>
                Comments
              </Text>
              <Text
                style={{ color: "white", margin: 4, padding: 5, fontSize: 15 }}
              >
                Please document all pre-existing damages or other concerns that
                may impact service. If the site map needs adjustment please
                contact our office directly.
              </Text>

              <TextInput
                ref={input => {
                  this.__commentInput = input;
                }}
                style={{
                  flex: 2,
                  backgroundColor: "white",
                  margin: 4,
                  padding: 9,
                  width: "100%",
                  maxHeight: 200,
                  textAlignVertical: "top" // required by android
                }}
                multiline={true}
                placeholder="Enter comments here..."
                value={this.state.draftComment}
                onChangeText={t => this.setState({ draftComment: t })}
              />
              <View style={{ flexDirection: "row", padding: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: "center" }}
                  onPress={() => {
                    var newState = {
                      showCommentsModal: false,
                      comments: [
                        // only doing one comment for now
                        {
                          comment: this.state.draftComment
                        }
                      ]
                    };
                    this.setState(newState);
                    if (this.props.onChange)
                      this.props.onChange(newState.comments);
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: "center" }}
                  onPress={this._commentModalCancel.bind(this)}
                >
                  <Text
                    style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ImageBackground>
        </Modal>
      </TouchableOpacity>
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
)(CommentInputButton);
