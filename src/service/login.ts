import { get, set } from '@/helpers/mmkvStoreUtils';

const account = {
  email: 'trongtien000m@gmail.com',
  password: 'onsraybonte',
};

const validateToken = async (token: string) => {
  if (!token) return false;

  const response = await fetch('https://backend.metruyencv.com/api/account', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  
  const userInfo = await response.json();

  if (userInfo.status !== 200) {
    return false;
  }

  return true;
};

export const login = async () => {
  try {
    const response = await fetch(
      'https://backend.metruyencv.com/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          remember: 1,
          device_name:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();

    set('userToken', data.data.token);

    // Ví dụ: Lưu token vào localStorage hoặc AsyncStorage
    // localStorage.setItem('token', data.token);

    return data;
  } catch (e: any) {
    console.error('Login failed:', e.message);
  }
};

export const getToken = async () => {
  const token = get('userToken');
  const isValidToken = await validateToken(token);

  if (!isValidToken) {
    await login();
  }

  return get('userToken');
};
