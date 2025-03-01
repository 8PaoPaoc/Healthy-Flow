import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // 替换为实际的后端API地址

export const recordHealthData = async (healthData) => {
  try {
    const response = await axios.post(`${API_URL}/health-records`, healthData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '记录健康数据失败');
  }
}; 