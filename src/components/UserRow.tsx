import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';
import type { User } from '../types/user';
import Avatar from './Avatar';

const AVATAR_SIZE = 56;

interface IProps {
  onPress: (user: User) => void;
  user: User;
}

const UserRow = (props: IProps) => {
  const { onPress, user } = props;
  const colors = useThemeColors();
  const { avatar, email, first_name: firstName, last_name: lastName } = user;

  return (
    <Pressable
      accessibilityLabel={`${firstName} ${lastName}, ${email}`}
      accessibilityRole="button"
      onPress={() => onPress(user)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.pressed : colors.background,
          borderBottomColor: colors.separator,
        },
      ]}
    >
      <Avatar
        firstName={firstName}
        lastName={lastName}
        size={AVATAR_SIZE}
        uri={avatar}
      />
      <View style={styles.userText}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {firstName} {lastName}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.email, { color: colors.secondaryText }]}
        >
          {email}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  email: {
    fontSize: 15,
    marginTop: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  userText: {
    flex: 1,
    marginLeft: 16,
  },
});

export default memo(UserRow);
