
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  category: 'safety' | 'hostel' | 'complaint' | 'general';
  replies: number;
  likes: number;
  isAnonymous: boolean;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'hostel' | 'harassment' | 'safety' | 'other';
  status: 'pending' | 'investigating' | 'resolved';
  timestamp: string;
  isAnonymous: boolean;
}

// Mock forum posts
const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Safety tips for late night travel',
    content: 'What are some good practices when traveling alone at night?',
    author: 'SafetyFirst',
    timestamp: '2 hours ago',
    category: 'safety',
    replies: 12,
    likes: 25,
    isAnonymous: false,
  },
  {
    id: '2',
    title: 'Review: Downtown Women\'s Hostel',
    content: 'Just stayed here for a week. Great security and friendly staff.',
    author: 'TravelGirl',
    timestamp: '5 hours ago',
    category: 'hostel',
    replies: 8,
    likes: 15,
    isAnonymous: false,
  },
  {
    id: '3',
    title: 'Harassment incident report',
    content: 'Need advice on how to report inappropriate behavior.',
    author: 'Anonymous',
    timestamp: '1 day ago',
    category: 'complaint',
    replies: 6,
    likes: 18,
    isAnonymous: true,
  },
];

export default function ForumScreen() {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedTab, setSelectedTab] = useState<'forum' | 'complaints'>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as ForumPost['category'],
    isAnonymous: false,
  });
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'other' as Complaint['category'],
    isAnonymous: false,
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const savedComplaints = await AsyncStorage.getItem('complaints');
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
    } catch (error) {
      console.log('Error loading complaints:', error);
    }
  };

  const saveComplaints = async (updatedComplaints: Complaint[]) => {
    try {
      await AsyncStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      setComplaints(updatedComplaints);
    } catch (error) {
      console.log('Error saving complaints:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety':
        return colors.danger;
      case 'hostel':
        return colors.secondary;
      case 'complaint':
        return colors.warning;
      case 'harassment':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return colors.accent;
      case 'investigating':
        return colors.warning;
      default:
        return colors.grey;
    }
  };

  const submitPost = () => {
    if (!newPost.title || !newPost.content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.isAnonymous ? 'Anonymous' : 'You',
      timestamp: 'Just now',
      category: newPost.category,
      replies: 0,
      likes: 0,
      isAnonymous: newPost.isAnonymous,
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'general', isAnonymous: false });
    setShowNewPostModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const submitComplaint = () => {
    if (!newComplaint.title || !newComplaint.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const complaint: Complaint = {
      id: Date.now().toString(),
      title: newComplaint.title,
      description: newComplaint.description,
      category: newComplaint.category,
      status: 'pending',
      timestamp: new Date().toLocaleDateString(),
      isAnonymous: newComplaint.isAnonymous,
    };

    const updatedComplaints = [complaint, ...complaints];
    saveComplaints(updatedComplaints);
    setNewComplaint({ title: '', description: '', category: 'other', isAnonymous: false });
    setShowComplaintModal(false);
    
    Alert.alert(
      'Complaint Submitted',
      'Your complaint has been submitted to the Women\'s Association. You will receive updates on the status.',
      [{ text: 'OK' }]
    );
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <View style={commonStyles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={commonStyles.title}>Community Support</Text>
        <Text style={commonStyles.textSecondary}>Connect, share, and support each other</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, selectedTab === 'forum' && styles.activeTab]}
          onPress={() => setSelectedTab('forum')}
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Text style={[styles.tabText, selectedTab === 'forum' && styles.activeTabText]}>
            Forum
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'complaints' && styles.activeTab]}
          onPress={() => setSelectedTab('complaints')}
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Text style={[styles.tabText, selectedTab === 'complaints' && styles.activeTabText]}>
            Complaints
          </Text>
        </Pressable>
      </View>

      {selectedTab === 'forum' ? (
        <>
          {/* Category Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'safety', label: 'Safety' },
              { key: 'hostel', label: 'Hostels' },
              { key: 'complaint', label: 'Complaints' },
              { key: 'general', label: 'General' },
            ].map((category) => (
              <Pressable
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.key && styles.categoryTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Forum Posts */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {filteredPosts.map((post) => (
              <View key={post.id} style={commonStyles.card}>
                <View style={styles.postHeader}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(post.category) },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>{post.category}</Text>
                  </View>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                </View>
                
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content}</Text>
                
                <View style={styles.postFooter}>
                  <Text style={styles.author}>
                    {post.isAnonymous ? '👤 Anonymous' : `👤 ${post.author}`}
                  </Text>
                  <View style={styles.postStats}>
                    <View style={styles.stat}>
                      <IconSymbol name="heart" size={16} color={colors.danger} />
                      <Text style={styles.statText}>{post.likes}</Text>
                    </View>
                    <View style={styles.stat}>
                      <IconSymbol name="bubble.left" size={16} color={colors.secondary} />
                      <Text style={styles.statText}>{post.replies}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {filteredPosts.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="bubble.left.and.bubble.right" size={48} color={colors.grey} />
                <Text style={styles.emptyTitle}>No posts found</Text>
                <Text style={commonStyles.textSecondary}>
                  Be the first to start a discussion!
                </Text>
              </View>
            )}
          </ScrollView>

          {/* New Post Button */}
          <Pressable
            style={styles.fab}
            onPress={() => setShowNewPostModal(true)}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <IconSymbol name="plus" size={24} color="white" />
          </Pressable>
        </>
      ) : (
        <>
          {/* Complaints List */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {complaints.map((complaint) => (
              <View key={complaint.id} style={commonStyles.card}>
                <View style={styles.complaintHeader}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(complaint.category) },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>{complaint.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(complaint.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{complaint.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.complaintTitle}>{complaint.title}</Text>
                <Text style={styles.complaintDescription}>{complaint.description}</Text>
                
                <View style={styles.complaintFooter}>
                  <Text style={styles.complaintDate}>Filed: {complaint.timestamp}</Text>
                  {complaint.isAnonymous && (
                    <Text style={styles.anonymousLabel}>Anonymous</Text>
                  )}
                </View>
              </View>
            ))}

            {complaints.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="doc.text" size={48} color={colors.grey} />
                <Text style={styles.emptyTitle}>No complaints filed</Text>
                <Text style={commonStyles.textSecondary}>
                  File a complaint to report safety issues
                </Text>
              </View>
            )}
          </ScrollView>

          {/* New Complaint Button */}
          <Pressable
            style={styles.fab}
            onPress={() => setShowComplaintModal(true)}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <IconSymbol name="plus" size={24} color="white" />
          </Pressable>
        </>
      )}

      {/* New Post Modal */}
      <Modal
        visible={showNewPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowNewPostModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>New Post</Text>
            <Pressable onPress={submitPost}>
              <Text style={styles.submitButton}>Post</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Post title..."
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
              placeholderTextColor={colors.grey}
            />
            
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
              numberOfLines={6}
              placeholderTextColor={colors.grey}
            />
            
            <Text style={styles.inputLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['general', 'safety', 'hostel', 'complaint'].map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categorySelector,
                    newPost.category === category && styles.categorySelectorActive,
                  ]}
                  onPress={() => setNewPost({ ...newPost, category: category as any })}
                >
                  <Text
                    style={[
                      styles.categorySelectorText,
                      newPost.category === category && styles.categorySelectorTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable
              style={styles.anonymousToggle}
              onPress={() => setNewPost({ ...newPost, isAnonymous: !newPost.isAnonymous })}
            >
              <IconSymbol 
                name={newPost.isAnonymous ? "checkmark.square.fill" : "square"} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.anonymousText}>Post anonymously</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* New Complaint Modal */}
      <Modal
        visible={showComplaintModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowComplaintModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>File Complaint</Text>
            <Pressable onPress={submitComplaint}>
              <Text style={styles.submitButton}>Submit</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Complaint title..."
              value={newComplaint.title}
              onChangeText={(text) => setNewComplaint({ ...newComplaint, title: text })}
              placeholderTextColor={colors.grey}
            />
            
            <TextInput
              style={styles.contentInput}
              placeholder="Describe the issue in detail..."
              value={newComplaint.description}
              onChangeText={(text) => setNewComplaint({ ...newComplaint, description: text })}
              multiline
              numberOfLines={8}
              placeholderTextColor={colors.grey}
            />
            
            <Text style={styles.inputLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['other', 'hostel', 'harassment', 'safety'].map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categorySelector,
                    newComplaint.category === category && styles.categorySelectorActive,
                  ]}
                  onPress={() => setNewComplaint({ ...newComplaint, category: category as any })}
                >
                  <Text
                    style={[
                      styles.categorySelectorText,
                      newComplaint.category === category && styles.categorySelectorTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable
              style={styles.anonymousToggle}
              onPress={() => setNewComplaint({ ...newComplaint, isAnonymous: !newComplaint.isAnonymous })}
            >
              <IconSymbol 
                name={newComplaint.isAnonymous ? "checkmark.square.fill" : "square"} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.anonymousText}>Submit anonymously</Text>
            </Pressable>
            
            <View style={styles.disclaimerBox}>
              <IconSymbol name="info.circle" size={20} color={colors.secondary} />
              <Text style={styles.disclaimerText}>
                Your complaint will be forwarded to the Women's Association of India for review and action.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activeTabText: {
    color: 'white',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
		marginLeft:6,
    borderWidth: 1,
    borderColor: colors.border,
		height:-10,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 12,
    color: colors.grey,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: colors.grey,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 12,
    color: colors.grey,
    marginLeft: 4,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintDate: {
    fontSize: 12,
    color: colors.grey,
  },
  anonymousLabel: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.grey,
  },
  submitButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categorySelector: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categorySelectorActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categorySelectorText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  categorySelectorTextActive: {
    color: 'white',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  anonymousText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});
