import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // 替换为实际的后端API地址

export const fetchDataAnalysis = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-analysis`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '获取数据分析失败');
  }
}; 