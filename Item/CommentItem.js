import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CommentItem = ({ username, title, avatar, onEdit, canEdit }) => {
  const defaultAvatar = require('../Image/usercm.png');

  // Xác định nguồn ảnh phù hợp
  const imageSource = avatar ? { uri: avatar } : defaultAvatar;

  return (
    <View style={styles.commentContainer}>
      <Image source={imageSource} style={styles.userImage} />
      <View style={styles.commentContentContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.commentContent}>{title}</Text>
      </View>
      {canEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Icon name="edit" size={20} color="#319AB4" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20, // To make it a circular image
  },
  commentContentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#319AB4',
  },
  commentContent: {
    fontSize: 16,
  },
  editButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
});

export default CommentItem;
