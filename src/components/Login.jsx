import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import './index.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
    // const url = isLogin ? '/api/controllers/authControllers' : '/api/controllers/authControllers';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(isLogin ? {} : { username })
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${isLogin ? 'Login' : 'Signup'} success!`);
        navigate('/MarkTask');
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 backdrop-blur-md bg-opacity-60"
      >
        <motion.h1 
          className="text-3xl font-bold text-center font-fancy text-animate mb-6"
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          {isLogin ? 'Welcome Back 👋' : 'Create Your Account 📝'}
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
              whileFocus={{ scale: 1.02 }}
            />
          )}
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="submit"
            className="bg-indigo-600 transform hover:bg-indigo-800 active:scale-90 text-white px-4 py-2 rounded-xl w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button 
            onClick={toggleForm} 
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
