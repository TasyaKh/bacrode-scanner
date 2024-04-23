import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeCtx } from "../../context/themeCtx";
import { colors } from "../../config/theme";
import { Icon } from "@rneui/base";

interface Props {
  onPressed: () => void;
}

const BackButton: React.FC<Props> = ({onPressed }) => {
  const theme = useContext(ThemeCtx);
  let activeColors = colors[theme.mode];

  return (
      <TouchableOpacity onPress={onPressed} style={[styles.backButton]}>
        <Icon name="arrow-back" size={24} color={activeColors.main} />
        <Text style={[styles.backText, {color:activeColors.text}]}>Назад</Text>
      </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical:15
  },
  backText: {
    fontSize: 16,
    marginLeft: 5
  },
});

export default BackButton;
