import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiService } from '@/services/api.service';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Logo from '../assets/images/leaf.svg';

// Logo 组件 - 简约的叶子图案
const LifeLogo = ({ size = 40, color = '#6ee7b7' }) => (
  <Logo width={size} height={size} fill={color} />
);

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';

  const handleSendCode = async () => {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('提示', '请输入正确的手机号码');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.sendVerificationCode(phoneNumber);
      
      if (response.success) {
        setCodeSent(true);
        setCountdown(60);
        Alert.alert('成功', '验证码已发送');

        // 倒计时
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert('失败', response.message || '发送验证码失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '网络请求失败，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !verificationCode) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.verifyCode(phoneNumber, verificationCode);
      
      if (response.success) {
        // 保存 token 和用户信息（这里可以使用 AsyncStorage）
        console.log('登录成功:', response.user);
        console.log('Token:', response.token);
        
        Alert.alert('登录成功', `欢迎 ${response.user?.phoneNumber}`, [
          {
            text: '确定',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } else {
        Alert.alert('失败', response.message || '登录失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '网络请求失败，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LifeLogo size={38} color="#6ee7b7" />
              <ThemedText style={styles.logo}>Life</ThemedText>
            </View>
            <ThemedText style={styles.subtitle}>
              AI智能健身助手
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>手机号</ThemedText>
              <View style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                },
              ]}>
                <View style={styles.phoneInputContainer}>
                  <ThemedText style={styles.countryCode}>+86</ThemedText>
                  <View style={styles.divider} />
                  <TextInput
                    style={[
                      styles.input,
                      styles.phoneInput,
                      {
                        color: isDark ? '#fff' : '#000',
                      },
                    ]}
                    placeholder="请输入手机号码"
                    placeholderTextColor={isDark ? '#888' : '#999'}
                    keyboardType="phone-pad"
                    maxLength={11}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>验证码</ThemedText>
              <View style={styles.codeInputContainer}>
                <View style={[
                  styles.inputWrapper,
                  styles.codeInputWrapper,
                  {
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                  },
                ]}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: isDark ? '#fff' : '#000',
                      },
                    ]}
                    placeholder="请输入验证码"
                    placeholderTextColor={isDark ? '#888' : '#999'}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                  />
                </View>
                <TouchableOpacity
                  style={styles.sendButtonWrapper}
                  onPress={handleSendCode}
                  disabled={countdown > 0 || loading}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={(countdown > 0 || loading) ? ['#d1d5db', '#d1d5db'] : ['#86efac', '#6ee7b7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendButton}>
                    {loading && countdown === 0 ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <ThemedText style={styles.sendButtonText}>
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </ThemedText>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButtonWrapper}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}>
              <LinearGradient
                colors={loading ? ['#d1d5db', '#d1d5db'] : ['#6ee7b7', '#5eead4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>登录</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                登录即表示同意
                <ThemedText style={styles.link}> 用户协议 </ThemedText>
                和
                <ThemedText style={styles.link}> 隐私政策</ThemedText>
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    lineHeight: 40,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Avenir Next',
      android: 'sans-serif-light',
      default: 'System',
    }),
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '500',
    opacity: 0.7,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    paddingLeft: 16,
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '400',
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 0,
  },
  codeInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  codeInputWrapper: {
    flex: 1,
  },
  sendButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButton: {
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginButtonWrapper: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6ee7b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  loginButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.4,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#39e29f',
    opacity: 1,
    fontWeight: '500',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
