import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // 替换为实际的后端API地址

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '注册失败');
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '登录失败');
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '密码重置失败');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '获取用户信息失败');
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '更新用户信息失败');
  }
}; 