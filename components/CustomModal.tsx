import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableHighlight,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { useTheme } from "@/hooks/Theme";
import Button from "./Button";
import CustomFormInput from "./CustomFormInput";
type inputData = {
  label: string;
  inputText: string;
};
type inputMapper = {
  [key: string]: string;
};
type Props = {
  data: inputData[];
  isVisible: boolean;
  transparent: boolean;
  animationType: "none" | "slide" | "fade" | undefined;
  closeModal: () => void;
};
const CustomModal = ({
  isVisible,
  transparent,
  animationType,
  data,
  closeModal,
}: Props) => {
  const theme = useTheme();
  const modalHeight = data.length === 1 ? 30 : data.length === 2 ? 45 : 50;
  const [inputs, setInputs] = React.useState<inputMapper>({});
  React.useEffect(() => {
    let modifiedData: inputMapper = {};
    data.map((data) => {
      modifiedData[data.label] = data.inputText;
    });

    setInputs(modifiedData);
  }, [data]);

  const confirmChanges = () => {
    console.log(Object.values(inputs));
  };

  const handleChange = (value: inputData, index: number) => {
    const key = value.label;
    const text = value.inputText;

    setInputs({ ...inputs, [key]: text });
  };
  return (
    <Modal
      visible={isVisible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={closeModal}
    >
      <View className="justify-end flex-1">
        <View
          className={`h-[${modalHeight}%] pt-4 px-4 pb-16`}
          style={{
            borderTopEndRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: theme.faintedColor,
          }}
        >
          <View className="flex-row justify-between items-center">
            <Text
              className="text-[20px] text-center"
              style={{ color: theme.textColor }}
            >
              Edit
            </Text>
            <TouchableHighlight
              underlayColor={theme.secondaryColor}
              onPress={closeModal}
              className="rounded-lg p-2 w-[38px] h-[38px]  justify-start items-start"
            >
              <AntDesign
                name="closecircleo"
                size={24}
                color={theme.textColor}
              />
            </TouchableHighlight>
          </View>
          <View className="justify-center">
            <View
              className="border-2  p-4 mt-4 rounded-md gap-2 "
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.secondaryColor,
              }}
            >
              {Object.keys(inputs).map((key, i) => {
                return (
                  <CustomFormInput
                    key={i}
                    index={i}
                    value={inputs[key]}
                    label={key}
                    handleChange={handleChange}
                  />
                );
              })}

              <View className="justify-end  items-start  mt-4">
                <Button
                  title="Confirm"
                  onPress={confirmChanges}
                  bg={theme.faintedColor}
                  color={theme.textColor}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({});
