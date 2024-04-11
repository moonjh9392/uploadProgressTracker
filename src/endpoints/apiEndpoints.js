const API_ENDPOINTS = {
  // 다른 API 엔드포인트들을 여기에 추가
  getRoom: "api/v1",
  uploadFile: (roomId) => `/api/v1/generate-thumbnails/${roomId}`,
  getFiles: (taskId) => `api/v1/task/${taskId}`,
};

export default API_ENDPOINTS;
