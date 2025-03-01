import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // 替换为实际的后端API地址

export const recordNutritionData = async (nutritionData) => {
  try {
    const response = await axios.post(`${API_URL}/nutrition-records`, nutritionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '记录饮食数据失败');
  }
}; 