import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // 替换为实际的后端API地址

export const recordExerciseData = async (exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/exercise-records`, exerciseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || '记录运动数据失败');
  }
}; 