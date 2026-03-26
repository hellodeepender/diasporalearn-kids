import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  color: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GradientCard({ color, children, style }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
  },
});
