import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useInput from './hook/useInput';
import './Login.css';
import econoLogo from './images/econo_logo.png';
import Spinner from './util/Spinner';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const email = useInput();
  const passwd = useInput();
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!email.value || !passwd.value) {
      setErrorMessage('아이디나 비밀번호를 정확히 입력해주세요.');
      return;
    }
    setIsLoading(true);
    axios({
      method: 'post',
      baseURL: process.env.REACT_APP_SERVER_BASE_URL,
      url: '/api/account/login/process',
      headers: {
        'access-control-allow-origin': '*',
      },
      data: {
        userEmail: email.value,
        password: passwd.value,
        redirectUrl: redirectUrl,
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('userEmail', email.value);
          window.location.href = redirectUrl;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(
          () => '로그인에 실패했습니다. 네트워크 환경을 확인해주세요.'
        );
      });
  };

  const onSignUpClick = () => {
    navigate('/signup');
  };

  useEffect(() => {
    setRedirectUrl(
      () => localStorage.getItem('redirectUrl') ?? 'https://econovation.kr'
    );
  }, []);

  return (
    <div className="card">
      <img className="logo" src={econoLogo} alt="logo" />
      <h2>Sign In</h2>
      <form onSubmit={onSubmit} className="login-form">
        <input
          type="text"
          value={email.value}
          onChange={email.onChange}
          placeholder="아이디"
        />
        <input
          type="password"
          value={passwd.value}
          onChange={passwd.onChange}
          placeholder="비밀번호"
        />
        <button type="submit">{isLoading ? <Spinner /> : 'Sign In'}</button>
        <input type="button" value="회원가입" onClick={onSignUpClick} />
        <div className="error-message">{errorMessage}</div>
      </form>
    </div>
  );
};

export default Login;
