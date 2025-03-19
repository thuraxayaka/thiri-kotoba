import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/Theme";

type Props<T> = {
  selected: T;
  onSelect: React.Dispatch<React.SetStateAction<T>>;
  options: T[];
};
function SelectBox<T extends React.ReactNode>({
  selected,
  onSelect,
  options,
}: Props<T>) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
        <View
          className="flex-row items-center gap-1 w-[100%] py-[14] rounded-lg px-4 "
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <Ionicons
            name="caret-down-circle-outline"
            size={20}
            color={theme.textColor}
          />
          <Text>{selected}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent={true}>
        <View className="justify-center items-center flex-1">
          <View
            className="w-[80%] rounded-lg"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {options.map((option, i) => (
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                key={i}
                style={{
                  borderColor: theme.mutedColor,
                }}
                className="border-b-hairline"
                onPress={() => {
                  onSelect(option);
                  setIsVisible(false);
                }}
              >
                <Text className="px-4 py-4">{option}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default SelectBox;
