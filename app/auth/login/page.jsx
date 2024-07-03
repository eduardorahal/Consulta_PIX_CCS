'use client'

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Context } from '../../context';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { state, dispatch } = React.useContext(Context);

  const onLoginPressed = async () => {
    const authData = {
      email: email,
      password: password
    }

    var options = {
      method: 'POST',
      url: '/api/user/login',
      headers: { 'Content-Type': 'application/json' },
      data: authData
    };

    try {
      const data = await axios.request(options)
      if (data.data.status === 201) {
        document.cookie = `token=${data.data.token}; path=/`;
        localStorage.setItem('userInfo', JSON.stringify(data.data))
        dispatch({ type: 'logIn', payload: data.data })
        router.push('/');
      } else {
        alert(data.data.message)
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box
      sx={{
        marginTop: 10,
        marginInline: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          onClick={() => onLoginPressed()}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  )
}

export default LoginPage