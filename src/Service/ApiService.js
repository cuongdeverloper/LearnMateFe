import axios from './AxiosCustomize';
import Cookies from 'js-cookie';
const ApiLogin = (userEmail, userPassword) => {
  return axios.post('/login', { email: userEmail, password: userPassword });
}

const sendOTPApi = async (userId, otp) => {
  try {
    const response = await axios.post('/verify-otp', { userId, OTP: otp });
    return response
  } catch (error) {
    console.error("Error verifying OTP:", error.response ? error.response.data : error.message);
    return { errorCode: 1, message: 'Failed to verify OTP' }; 
  }
};

const ApiRegister = async (username, email, password, phoneNumber, gender, role, image) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('phoneNumber', phoneNumber);
  formData.append('gender', gender);
  formData.append('role', role);
  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
const loginWGoogle = () => {
  console.log('123')
  return axios.get(`/auth/google/callback`)
}

const requestPasswordResetApi = async (email) => {
    try {
        const response = await axios.post('/rqreset-password', { email });
        return response;
    } catch (error) {
        console.log(error)
    }
};

const resetPasswordApi = async (token, newPassword) => {
    try {
        const response = await axios.post('/reset-password', { token, newPassword });
        return response;
    } catch (error) {
        console.log(error)
    }
};
const ApiGetUserByUserId = async (userId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.open("/signin", "_blank");
      return;
    }

    const response = await axios.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error get user:", error);
    return null;
  }
};
const ApiMarkMessagesAsSeen = async (conversationId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.open("/signin", "_blank");
      return;
    }

    const response = await axios.put(`/seenmessage/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error message seen :", error);
    return null;
  }
};
const ApiSendMessage = async (receiverId, text) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.open("/signin", "_blank");
      return;
    }

    const response = await axios.post(
      "/message",
      { receiverId, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

const getConversationApi = async () => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.open("/signin", "_blank");
      return null;
    }

    const response = await axios.get(`/conversation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error getting conversations:", error);
    return null;
  }
};
const ApiGetMessageByConversationId = async (conversationId) => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.open("/signin", "_blank");
      return;
    }

    const response = await axios.get(`/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error get chat:", error);
    return null;
  }
};
export {
    ApiLogin,sendOTPApi,ApiRegister,loginWGoogle,requestPasswordResetApi,resetPasswordApi,
    ApiGetUserByUserId,ApiMarkMessagesAsSeen,ApiSendMessage,getConversationApi,ApiGetMessageByConversationId
}